import { AppSettings, UserProfile, LiveChatMessage } from '../types';

interface AutoReplyOptions {
  messageText: string;
  user?: UserProfile;
  appSettings?: AppSettings;
  imageUrl?: string;
  imageName?: string;
  recentMessages?: LiveChatMessage[];
}

/**
 * Intelligent Bengali rule-based matcher for instant, deterministic, zero-latency replies.
 * Used as standalone or instantaneous fallback if Gemini API is unreachable or takes time.
 */
export function generateLocalSmartReply(options: AutoReplyOptions): string {
  const { messageText, user, appSettings, imageUrl, imageName } = options;
  const text = (messageText || '').toLowerCase().trim();
  const userName = user?.name || 'লুডো প্লেয়ার';
  const bkash = appSettings?.bkashNumber || '01712345678';
  const nagad = appSettings?.nagadNumber || '01812345678';
  const rocket = appSettings?.rocketNumber || '01912345678';
  const minDep = appSettings?.minDeposit || 100;
  const minWith = appSettings?.minWithdrawal || 100;
  const refBonus = appSettings?.referralBonus || 50;
  const commission = appSettings?.platformCommissionPercent || 10;
  const whatsapp = appSettings?.supportWhatsApp || '+8801700000000';
  const telegram = appSettings?.supportTelegram || '@kingludosupport';

  // 1. If an image/screenshot is attached
  if (imageUrl || text.includes('ছবি') || text.includes('স্ক্রিনশট') || text.includes('screenshot') || text.includes('স্লিপ') || text.includes('লোগো')) {
    return `📸 ধন্যবাদ ${userName}! আপনার প্রেরিত ${imageName ? `"${imageName}"` : 'স্ক্রিনশট/ছবি'} আমাদের সিকিউরিটি ভেরিফিকেশন প্যানেলে পৌঁছেছে।\n\nএডমিন টিম আপনার পেমেন্ট ভাউচার/তথ্য যাচাই করছেন। যাচাই শেষে সর্বোচ্চ ৩-৫ মিনিটের মধ্যে ফলাফল আপডেট পাবেন। সাথে থাকার জন্য ধন্যবাদ!`;
  }

  // 2. Greetings / Salutations
  if (
    text.match(/^(হাই|হ্যালো|সালাম|আসসালামু|hello|hi|hey|assalam|assalamu|kemon|কেমন|ভাই|vai|bro|bhai|admin|এডমিন)$/i) ||
    text.includes('সালাম') ||
    text.includes('আসসালামু') ||
    text.includes('কেমন আছেন') ||
    text.includes('kemon achen') ||
    text.startsWith('hi ') ||
    text.startsWith('hello ')
  ) {
    return `👋 আসসালামু আলাইকুম ${userName} ভাই! কিং লুডো ২৪/৭ অফিশিয়াল কাস্টমার সাপোর্টে স্বাগতম।\n\nআমরা আপনাকে কীভাবে সাহায্য করতে পারি? ডিপোজিট, উইথড্রল, গেম রুলস, রেফার বোনাস বা যেকোনো সমস্যায় নির্দ্বিধায় লিখুন—আমরা দ্রুত উত্তর দিতে প্রস্তুত।`;
  }

  // 3. Deposit / টাকা জমা / ব্যালেন্স অ্যাড / বিকাশ / নগদ
  if (
    text.includes('ডিপোজিট') ||
    text.includes('deposit') ||
    text.includes('টাকা জমা') ||
    text.includes('টাকা ঢুকাব') ||
    text.includes('টাকা ভরব') ||
    text.includes('টাকা অ্যাড') ||
    text.includes('ব্যালেন্স অ্যাড') ||
    text.includes('add money') ||
    text.includes('বিকাশ') ||
    text.includes('bkash') ||
    text.includes('নগদ') ||
    text.includes('nagad') ||
    text.includes('রকেট') ||
    text.includes('rocket') ||
    text.includes('উপায়') ||
    text.includes('upay') ||
    text.includes('trx') ||
    text.includes('টাকা পাঠাইছি') ||
    text.includes('টাকা পাঠিয়েছি')
  ) {
    return `💰 ডিপোজিট নির্দেশিকা (${userName} ভাই):\n\n১. হোম স্ক্রিনের "টাকা জমা (Add Money)" বাটনে ক্লিক করুন।\n২. আমাদের অফিশিয়াল নাম্বারসমূহ:\n • বিকাশ: ${bkash}\n • নগদ: ${nagad}\n • রকেট: ${rocket}\n৩. সর্বনিম্ন ডিপোজিট: ৳${minDep} টাকা।\n৪. টাকা পাঠানোর পর ফিরতি SMS থেকে প্রাপ্ত TrxID ও যে নাম্বার থেকে পাঠিয়েছেন তা লিখে ফর্ম সাবমিট করুন।\n\nএডমিন ভেরিফাই করে ১ থেকে ৩ মিনিটের মধ্যে আপনার ব্যালেন্স যোগ করে দেবেন!`;
  }

  // 4. Withdrawal / টাকা তোলা / ক্যাশআউট / পেন্ডিং
  if (
    text.includes('উইথড্র') ||
    text.includes('withdraw') ||
    text.includes('টাকা তুলব') ||
    text.includes('ক্যাশআউট') ||
    text.includes('cashout') ||
    text.includes('টাকা পাই নাই') ||
    text.includes('টাকা আসে নাই') ||
    text.includes('পেন্ডিং') ||
    text.includes('pending') ||
    text.includes('কতক্ষণ লাগবে')
  ) {
    return `💸 উইথড্রল সংক্রান্ত তথ্য:\n\n১. উইথড্র করতে হোম পেজের "টাকা উত্তোলন (Withdraw)" বাটনে ক্লিক করুন।\n২. সর্বনিম্ন উইথড্রল সীমা: ৳${minWith} টাকা।\n৩. আপনার বিকাশ/নগদ/রকেট একাউন্ট নাম্বার ও টাকার পরিমাণ লিখে রিকোয়েস্ট পাঠান।\n৪. সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যেই উইথড্রল স্বয়ংক্রিয়ভাবে বা এডমিন দ্বারা ভেরিফাই হয়ে আপনার একাউন্টে পৌঁছে যায়।\n\nযদি আপনার রিকোয়েস্ট পেন্ডিং থাকে, অনুগ্রহ করে আপনার একাউন্ট নাম্বারটি এখানে লিখে পাঠান, আমরা এখনই চেক করে দিচ্ছি!`;
  }

  // 5. Game Rules / লুডো নিয়ম / ছক্কা / বট / টুর্নামেন্ট
  if (
    text.includes('কুইক মোড') ||
    text.includes('ক্লাসিক মোড') ||
    text.includes('quick mode') ||
    text.includes('classic mode')
  ) {
    return `⚡ কুইক মোড বনাম ক্লাসিক মোড:\n\n• কুইক মোড (Quick Mode): যেকোনো ১টি গুটি হোমে (Home) নিলেই আপনি সরাসরি বিজয়ী হবেন! দ্রুত ম্যাচ শেষ করতে এটি সেরা।\n• ক্লাসিক মোড (Classic Mode): আপনার ৪টি গুটিই ঘুরিয়ে নির্দিষ্ট রঙের হোমে নিতে হবে। দীর্ঘ ও কৌশলগত খেলার জন্য উপযোগী।\n\nউভয় মোডেই সাধারণ লুডো নিয়ম (৬-এ বের হওয়া, প্রতিপক্ষের গুটি কাটা ও সেফ জোন) কার্যকর থাকে।`;
  }

  if (
    text.includes('ডিসকানেক্ট') ||
    text.includes('disconnect') ||
    text.includes('চাল দেয় না') ||
    text.includes('চাল দেয় না') ||
    text.includes('টাইমার') ||
    text.includes('timer') ||
    text.includes('লেফট') ||
    text.includes('left')
  ) {
    return `⏱️ ডিসকানেক্ট ও টাইমার রুলস:\n\n• প্রতি চালে খেলোয়াড়কে নির্দিষ্ট সময় (১৫-৩০ সেকেন্ড) দেওয়া হয়।\n• নির্ধারিত সময়ে চাল না দিলে অটো-টার্ন মিস বা অটো-প্লে মোডে চলে যায়।\n• পরপর ৩ বার চাল মিস করলে বা ম্যাচ থেকে বের হয়ে গেলে তাকে পরাজিত ঘোষণা করা হয় এবং প্রতিপক্ষ সরাসরি বিজয়ী হিসেবে কয়েন/পুরস্কার পায়।`;
  }

  if (
    text.includes('লিমিট') ||
    text.includes('limit') ||
    text.includes('সর্বনিম্ন') ||
    text.includes('সর্বোচ্চ') ||
    text.includes('কত টাকা ডিপোজিট') ||
    text.includes('কত টাকা উইথড্র')
  ) {
    return `💳 লেনদেন সীমা ও রেইট:\n\n• সর্বনিম্ন ডিপোজিট: ৳${minDep} টাকা\n• সর্বনিম্ন উত্তোলন (Withdraw): ৳${minWith} টাকা\n• উত্তোলন সময়: ৫ থেকে ১৫ মিনিট (২৪/৭ অটো ও ম্যানুয়াল ভেরিফাইড)\n• কোনো অতিরিক্ত ডিপোজিট ফি নেই। বিকাশ, নগদ, রকেট ও উপায় সরাসরি সমর্থিত।`;
  }

  if (
    text.includes('প্রাইজ') ||
    text.includes('পুরস্কার') ||
    text.includes('কমিশন') ||
    text.includes('commission') ||
    text.includes('কত পাব') ||
    text.includes('prize')
  ) {
    return `🏆 উইনিং প্রাইজ ও কমিশন নীতি:\n\n• ২ প্লেয়ার ম্যাচে মোট এন্ট্রি ফি যোগ হয়ে প্ল্যাটফর্মের মাত্র ${commission}% কমিশন বাদে বাকি পুরো অর্থ বিজয়ী খেলোয়াড় পেয়ে থাকেন (যেমন: ৳১০০+৳১০০ = ৳২০০, বিজয়ী পাবেন ৳১৮০)।\n• ৪ প্লেয়ার ম্যাচে ১ম ও ২য় স্থান অধিকারীদের মধ্যে টুর্নামেন্ট অনুপাতে প্রাইজ ডিস্ট্রিবিউট হয়।`;
  }

  if (
    text.includes('নিয়ম') ||
    text.includes('নিয়ম') ||
    text.includes('rules') ||
    text.includes('রুলস') ||
    text.includes('কীভাবে খেলব') ||
    text.includes('খেলব কীভাবে') ||
    text.includes('ছক্কা') ||
    text.includes('গুটি') ||
    text.includes('বট') ||
    text.includes('bot') ||
    text.includes('টুর্নামেন্ট') ||
    text.includes('tournament')
  ) {
    return `🎲 কিং লুডো গেম রুলস ও নিয়মাবলী:\n\n• গুটি বের করতে অবশ্যই ডাইসে ৬ (ছক্কা) ফেলতে হবে।\n• ৬ উঠলে পুনরায় ডাইস রোল করার সুযোগ পাবেন (তবে পর পর ৩টি ৬ উঠলে দান বাতিল হবে)।\n• প্রতিপক্ষের গুটি কাটলে বাড়তি একটি চাল পাওয়া যায়।\n• তারকা (Star) চিহ্নিত সেফ জোনে গুটি কাটা যায় না।\n• ক্লাসিক মোডে ৪টি গুটি ও কুইক মোডে যেকোনো ১টি গুটি হোমে নিলেই বিজয়ী হবেন।\n• প্লাটফর্ম উইনিং কমিশন মাত্র ${commission}%।\n\nআজই টুর্নামেন্টে যোগ দিন এবং জিতে নিন আকর্ষণীয় ক্যাশ প্রাইজ!`;
  }

  // 6. Referral & Bonus / রেফার বোনাস
  if (
    text.includes('রেফার') ||
    text.includes('refer') ||
    text.includes('বোনাস') ||
    text.includes('bonus') ||
    text.includes('invite') ||
    text.includes('ইনভাইট')
  ) {
    const refCode = user?.referralCode || 'আপনার প্রোফাইলে দেখুন';
    return `🎁 রেফার ও আর্ন প্রোগ্রাম:\n\nআপনার বন্ধুদের কিং লুডোতে ইনভাইট করে প্রতি রেফারে পেয়ে যান ৳${refBonus} ক্যাশ বোনাস!\n• আপনার রেফারেল কোড: ${refCode}\n• আপনার বন্ধু একাউন্ট খুলে প্রথম ডিপোজিট করলেই দুজনের ওয়ালেটে বোনাস যোগ হবে।\nহোম স্ক্রিনের "রেফার" অপশন থেকে আপনার লিংক কপি করে বন্ধুদের শেয়ার করুন!`;
  }

  // 7. Spin Wheel / স্পিনার
  if (
    text.includes('স্পিন') ||
    text.includes('spin') ||
    text.includes('হুইল') ||
    text.includes('wheel') ||
    text.includes('চাকা') ||
    text.includes('লাকি')
  ) {
    return `🎡 লাকি স্পিনার হুইল:\n\nপ্রতিদিন লগইন করে ফ্রি স্পিন ঘুরিয়ে জিতে নিন কয়েন ও সর্বোচ্চ ৳৫,০০০ পর্যন্ত আকর্ষণীয় রিওয়ার্ড!\nহোম স্ক্রিনের স্পিনার বাটনে চাপ দিয়ে ভাগ্যের চাকা ঘুরিয়ে দেখুন আজ আপনার ভাগ্য কী বলে!`;
  }

  // 8. Password / Account / Profile / Login
  if (
    text.includes('পাসওয়ার্ড') ||
    text.includes('password') ||
    text.includes('পাসওয়ার্ড') ||
    text.includes('একাউন্ট') ||
    text.includes('account') ||
    text.includes('লগইন') ||
    text.includes('login') ||
    text.includes('আইডি') ||
    text.includes('id')
  ) {
    return `🔐 একাউন্ট ও নিরাপত্তা সহায়তা:\n\nআপনার একাউন্ট তথ্য ও পাসওয়ার্ড পরিবর্তন করতে প্রোফাইল মেনুতে যান।\nপাসওয়ার্ড ভুলে গেলে বা লগইনে সমস্যা হলে আপনার রেজিস্টার্ড ফোন নাম্বারটি এখানে লিখুন অথবা আমাদের সরাসরি হেল্পলাইন নম্বরে (${whatsapp}) যোগাযোগ করুন। আমরা দ্রুত আপনার একাউন্ট রিকভারি করে দেব।`;
  }

  // 9. Helpline / WhatsApp / Telegram
  if (
    text.includes('হেল্পলাইন') ||
    text.includes('কন্টাক্ট') ||
    text.includes('হোয়াটসঅ্যাপ') ||
    text.includes('whatsapp') ||
    text.includes('telegram') ||
    text.includes('টেলিগ্রাম') ||
    text.includes('নাম্বার') ||
    text.includes('number')
  ) {
    return `📞 কিং লুডো সরাসরি হেল্পলাইন ও সাপোর্ট:\n\n• অফিসিয়াল হোয়াটসঅ্যাপ: ${whatsapp}\n• অফিশিয়াল টেলিগ্রাম: ${telegram}\n• লাইভ চ্যাট: এই চ্যাট উইন্ডোতে ২৪ ঘণ্টা খোলা থাকে!\nযেকোনো প্রয়োজনে আমাদের কল বা মেসেজ দিন।`;
  }

  // 10. Default General Contextual Answer
  return `ধন্যবাদ ${userName} ভাই! আপনার মেসেজটি আমরা পেয়েছি: "${messageText.length > 50 ? messageText.slice(0, 50) + '...' : messageText}"।\n\nআপনার অ্যাকাউন্টের বর্তমান ব্যালেন্স: ৳${user?.balance || 0} টাকা। ডিপোজিট, উইথড্র, কোনো ম্যাচের সমস্যা কিংবা ট্রানজেকশন যাচাইয়ের জন্য আপনার একাউন্ট/ট্রানজেকশন নাম্বারটি লিখুন। আমাদের সাপোর্ট টিম দ্রুত ব্যবস্থা নিচ্ছে!`;
}

/**
 * Sanitizes chat messages to ensure administrative/private numbers like 01910204477
 * are never shown in chat bubbles, password reset prompts, or auto replies.
 */
export function cleanChatText(text: string): string {
  if (!text) return text;
  return text
    // Replace "(**01910204477**)" or "(01910204477)" or bengali numerals
    .replace(/\s*\(\*?\*?(?:01910204477|০১৯১০২০৪৪৭৭)\*?\*?\)/g, '')
    // Replace "নম্বরটি 01910204477 দিন" -> "নম্বরটি দিন"
    .replace(/(নম্বরটি|নাম্বারটি)\s+(?:\*?\*?(?:01910204477|০১৯১০২০৪৪৭৭)\*?\*?\s*)/g, '$1 ')
    // Replace any remaining 01910204477 / ০১৯১০২০৪৪৭৭
    .replace(/(?:01910204477|০১৯১০২০৪৪৭৭)/g, '')
    .replace(/  +/g, ' ');
}

/**
 * Main auto-reply fetcher:
 * 1. Tries calling full-stack backend API (/api/chat/auto-reply) with Gemini AI.
 * 2. Falls back seamlessly to generateLocalSmartReply if backend is unreachable or offline.
 */
export async function getLiveChatAutoReply(options: AutoReplyOptions): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch('/api/chat/auto-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        messageText: options.messageText,
        userName: options.user?.name || 'লুডো প্লেয়ার',
        userPhone: options.user?.phone || '01700000000',
        userBalance: options.user?.balance || 0,
        referralCode: options.user?.referralCode || '',
        imageUrl: options.imageUrl,
        imageName: options.imageName,
        appSettings: options.appSettings,
        recentMessages: (options.recentMessages || []).slice(-6).map((m) => ({
          role: m.senderRole === 'user' ? 'user' : 'model',
          text: m.text,
        })),
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply && typeof data.reply === 'string' && data.reply.trim()) {
        return cleanChatText(data.reply.trim());
      }
    }
  } catch (err) {
    // Graceful fallback on network timeout/offline
    console.warn('API auto-reply unavailable, fallback to smart local engine:', err);
  }

  // Fallback to rich local intelligent Bengali generator
  return cleanChatText(generateLocalSmartReply(options));
}
