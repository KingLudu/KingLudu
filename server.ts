import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Resilient production detection: Cloud Run sets PORT and runs npm start
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.npm_lifecycle_event === 'start' ||
  (process.env.npm_lifecycle_event !== 'dev' && fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

// In Cloud Run production, process.env.PORT (e.g. 8080) is injected. Default to 3000 for local development.
const PORT = Number(process.env.PORT) || 3000;

// Resilient resolution of production dist directory
const getDistPath = () => {
  // When bundled to dist/server.cjs, __dirname is the dist directory itself
  if (typeof __dirname !== 'undefined' && fs.existsSync(path.join(__dirname, 'index.html'))) {
    return __dirname;
  }
  const cwdDist = path.join(process.cwd(), 'dist');
  if (fs.existsSync(cwdDist)) {
    return cwdDist;
  }
  return path.resolve(process.cwd(), 'dist');
};

// Lazy initialization of Gemini client with recommended telemetry headers
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Resilient Gemini text generation with multi-model fallback across flash tiers
async function generateAutoReplyWithModelFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string
): Promise<string | null> {
  // Allowed fast text models in preference order
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text?.trim();
      if (replyText) {
        return replyText;
      }
    } catch (err: any) {
      // Gracefully catch 503 UNAVAILABLE or rate spikes
      const isCapacityError =
        err?.status === 503 ||
        err?.code === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE');

      if (isCapacityError) {
        console.warn(`[Gemini API] Model ${model} is experiencing temporary high demand (503). Trying fallback candidate...`);
      } else {
        console.warn(`[Gemini API] Model ${model} request note: ${err?.message || 'unexpected error'}`);
      }
    }
  }

  return null;
}

// Server Data Store for real-time Deposit, Withdraw & Admin persistence
const STORE_PATH = path.join(process.cwd(), 'server_store.json');

interface ServerStore {
  transactions: any[];
  users: any[];
  settings: any;
  lastUpdated: number;
}

function loadServerStore(): ServerStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        users: Array.isArray(parsed.users) ? parsed.users : [],
        settings: parsed.settings || {},
        lastUpdated: parsed.lastUpdated || Date.now(),
      };
    }
  } catch (err) {
    console.error('Error reading server_store.json:', err);
  }
  return { transactions: [], users: [], settings: {}, lastUpdated: Date.now() };
}

let serverStore: ServerStore = loadServerStore();

function saveServerStore() {
  try {
    serverStore.lastUpdated = Date.now();
    fs.writeFileSync(STORE_PATH, JSON.stringify(serverStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving server_store.json:', err);
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // API Health Endpoints (Standardized for Cloud Run startup/liveness probes)
  app.get(['/health', '/api/health', '/healthz', '/_healthz'], (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
      transactionCount: serverStore.transactions.length,
    });
  });

  // ================= TRANSACTIONS API FOR DEPOSIT & WITHDRAW CONTROL =================
  // GET: Fetch all transactions
  app.get('/api/transactions', (req: Request, res: Response) => {
    res.json({
      success: true,
      transactions: serverStore.transactions,
      lastUpdated: serverStore.lastUpdated,
    });
  });

  // POST: Create a new transaction (Deposit or Withdraw by user, or Manual by Admin)
  app.post('/api/transactions', (req: Request, res: Response) => {
    try {
      const transaction = req.body;
      if (!transaction || !transaction.id || !transaction.type || transaction.amount === undefined) {
        return res.status(400).json({ success: false, error: 'Invalid transaction payload' });
      }

      // Check if transaction already exists (avoid duplicates)
      const existingIdx = serverStore.transactions.findIndex((t) => t.id === transaction.id);
      if (existingIdx >= 0) {
        serverStore.transactions[existingIdx] = { ...serverStore.transactions[existingIdx], ...transaction };
      } else {
        serverStore.transactions.unshift(transaction);
      }

      saveServerStore();
      return res.json({ success: true, transaction });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // PATCH: Update single transaction (Approve, Reject, or Edit details)
  app.patch('/api/transactions/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const targetIdx = serverStore.transactions.findIndex((t) => t.id === id);

      if (targetIdx === -1) {
        // If not found in store, add it with updates
        const newTrx = { id, ...updates };
        serverStore.transactions.unshift(newTrx);
        saveServerStore();
        return res.json({ success: true, transaction: newTrx });
      }

      serverStore.transactions[targetIdx] = {
        ...serverStore.transactions[targetIdx],
        ...updates,
      };

      saveServerStore();
      return res.json({ success: true, transaction: serverStore.transactions[targetIdx] });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // POST: Bulk approve or reject transactions
  app.post('/api/transactions/bulk-status', (req: Request, res: Response) => {
    try {
      const { ids, status } = req.body;
      if (!Array.isArray(ids) || !status) {
        return res.status(400).json({ success: false, error: 'ids array and status are required' });
      }

      const idSet = new Set(ids);
      serverStore.transactions = serverStore.transactions.map((trx) => {
        if (idSet.has(trx.id)) {
          return { ...trx, status };
        }
        return trx;
      });

      saveServerStore();
      return res.json({ success: true, updatedCount: ids.length, status });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // DELETE: Delete a transaction
  app.delete('/api/transactions/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const initialCount = serverStore.transactions.length;
      serverStore.transactions = serverStore.transactions.filter((t) => t.id !== id);
      saveServerStore();
      return res.json({ success: true, deleted: initialCount !== serverStore.transactions.length });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // POST: Sync/seed transactions in batch from client
  app.post('/api/transactions/sync', (req: Request, res: Response) => {
    try {
      const { transactions = [] } = req.body;
      if (Array.isArray(transactions) && transactions.length > 0) {
        const idMap = new Map(serverStore.transactions.map((t) => [t.id, t]));
        for (const trx of transactions) {
          if (trx && trx.id && !idMap.has(trx.id)) {
            serverStore.transactions.push(trx);
            idMap.set(trx.id, trx);
          }
        }
        saveServerStore();
      }
      return res.json({ success: true, count: serverStore.transactions.length });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // ================= USERS API FOR ADMIN MANAGEMENT =================
  app.get('/api/users', (req: Request, res: Response) => {
    res.json({ success: true, users: serverStore.users });
  });

  app.post('/api/users/sync', (req: Request, res: Response) => {
    try {
      const { users = [] } = req.body;
      if (Array.isArray(users) && users.length > 0) {
        serverStore.users = users;
        saveServerStore();
      }
      return res.json({ success: true, count: serverStore.users.length });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // ================= APP SETTINGS API =================
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json({ success: true, settings: serverStore.settings });
  });

  app.post('/api/settings', (req: Request, res: Response) => {
    try {
      const { settings } = req.body;
      if (settings) {
        serverStore.settings = { ...serverStore.settings, ...settings };
        saveServerStore();
      }
      return res.json({ success: true, settings: serverStore.settings });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || 'Server error' });
    }
  });

  // API: Live Chat Auto-Reply with Gemini AI
  app.post('/api/chat/auto-reply', async (req: Request, res: Response) => {
    try {
      const {
        messageText,
        userName = 'লুডো প্লেয়ার',
        userPhone = '01700000000',
        userBalance = 0,
        referralCode = '',
        imageUrl,
        imageName,
        appSettings = {},
        recentMessages = [],
      } = req.body;

      const ai = getGenAi();

      if (!ai) {
        // Return 200 with empty so client uses smart local fallback
        return res.json({ reply: null, reason: 'no_api_key' });
      }

      const bkash = appSettings.bkashNumber || '01712345678';
      const nagad = appSettings.nagadNumber || '01812345678';
      const rocket = appSettings.rocketNumber || '01912345678';
      const upay = appSettings.upayNumber || '01712345678';
      const minDep = appSettings.minDeposit || 100;
      const minWith = appSettings.minWithdrawal || 100;
      const refBonus = appSettings.referralBonus || 50;
      const commission = appSettings.platformCommissionPercent || 10;
      const helplinePhone = appSettings.supportWhatsApp || '+8801700000000';

      const systemInstruction = `
You are the official 24/7 AI Customer Support Agent for "King Ludo" (কিং লুডো), the premier online multiplayer Ludo gaming platform in Bangladesh.
Your goal is to provide immediate, ultra-helpful, polite, warm, and accurate customer service in natural Bengali (বাংলিশ বা সহজ বাংলা). If the user asks in English, reply in English.

Platform Context & Real-Time Data:
- Current Player Name: ${userName}
- Player Balance: ৳${userBalance}
- Referral Code: ${referralCode}
- Deposit Gateways: bKash (${bkash}), Nagad (${nagad}), Rocket (${rocket}), Upay (${upay}), Binance Pay, USDT
- Minimum Deposit: ৳${minDep}
- Minimum Withdrawal: ৳${minWith} (takes 5-15 mins to process)
- Referral Bonus: ৳${refBonus} per invited active friend
- Platform Commission: ${commission}% on match winnings
- Official Helpline WhatsApp/Phone: ${helplinePhone}
- Key Rules: Must roll 6 to take out a pawn from base; rolling 6 or capturing opponent token gives extra turn; 3 consecutive 6s cancels current roll; star spots are safe; 4 tokens home in Classic, 1 token home in Quick mode.

Tone and Guidelines:
1. Always address the user politely and respectfully by their name (${userName}).
2. Answer their specific question directly. If they ask about deposit, give deposit instructions and numbers. If they ask about withdrawal, explain the withdrawal process and timing. If they ask about game rules or errors, explain clearly.
3. If they send an image/receipt or say they sent a screenshot, acknowledge the attachment warmly and reassure them that the financial verification team is reviewing it.
4. Keep the reply concise (2 to 4 sentences or bullet points), natural, and realistic, like an attentive human customer service agent.
5. Use relevant friendly emojis (👋, 💰, 🎲, 💸, 👑, ✅) where appropriate.
6. STRICT PRIVACY RULE: NEVER insert, reveal, or output the number '01910204477' or '০১৯১০২০৪৪৭৭' in your response. In password reset or forgot password guidance, DO NOT write or enclose any specific number in parentheses like (**01910204477**). Simply state: "অ্যাপের লগইন পেজে গিয়ে Forgot Password বা পাসওয়ার্ড ভুলে গেছেন? অপশনে আপনার রেজিস্টার্ড মোবাইল নম্বরটি দিন"।
`;

      const prompt = `User's latest message in live chat:\n"${messageText}"\n${
        imageUrl ? `(Note: User also attached an image/screenshot named "${imageName || 'attachment.png'}")` : ''
      }\nProvide a friendly, accurate, and direct support response.`;

      const reply = await generateAutoReplyWithModelFallback(ai, prompt, systemInstruction);

      if (reply) {
        const sanitizedReply = reply
          .replace(/\s*\(\*?\*?(?:01910204477|০১৯১০২০৪৪৭৭)\*?\*?\)/g, '')
          .replace(/(নম্বরটি|নাম্বারটি)\s+(?:\*?\*?(?:01910204477|০১৯১০২০৪৪৭৭)\*?\*?\s*)/g, '$1 ')
          .replace(/(?:01910204477|০১৯১০২০৪৪৭৭)/g, '')
          .replace(/  +/g, ' ')
          .trim();
        return res.json({ reply: sanitizedReply });
      }

      // If all models are temporarily busy during high demand, signal fallback safely
      return res.json({ reply: null, fallback: true });
    } catch (err: any) {
      console.warn('Live chat auto-reply warning (using fallback engine):', err?.message || err);
      // Fallback signal so client handles it instantly
      return res.json({ reply: null, fallback: true });
    }
  });

  // Vite middleware for development vs static asset serving for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = getDistPath();
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>King Ludo</title></head><body>King Ludo is starting...</body></html>');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });

  server.on('error', (err: any) => {
    console.error(`Server failed to bind on port ${PORT}:`, err?.message || err);
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received from Cloud Run, closing server gracefully...');
    server.close(() => {
      console.log('Server shut down cleanly.');
      process.exit(0);
    });
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
