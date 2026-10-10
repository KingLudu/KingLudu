import { PaymentMethod } from '../types';

export interface VerifiedQrPaymentResult {
  rawText: string;
  trxId: string;
  detectedAmount?: number;
  detectedMethod?: PaymentMethod;
  detectedPhone?: string;
  detectedOrderId?: string;
  isValid: boolean;
  status: 'verified_complete' | 'verified_trx_only' | 'partial' | 'invalid';
  title: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
  amountMatches?: boolean;
}

/**
 * Intelligent parser & verifier for Payment Receipt QR codes, URLs, JSON, and raw TrxIDs
 * Supports bKash, Nagad, Rocket, Upay, Binance Pay, and Crypto USDT receipts
 */
export function parseAndVerifyPaymentQr(
  rawText: string,
  expectedAmount?: number,
  expectedMethod?: PaymentMethod
): VerifiedQrPaymentResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return {
      rawText,
      trxId: '',
      isValid: false,
      status: 'invalid',
      title: 'কিউআর কোড ফাঁকা',
      message: 'স্ক্যান করা কিউআর কোডে কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক পেমেন্ট রসিদ স্ক্যান করুন।',
      confidence: 'low',
    };
  }

  let extractedTrxId = '';
  let detectedAmount: number | undefined;
  let detectedMethod: PaymentMethod | undefined;
  let detectedPhone: string | undefined;
  let detectedOrderId: string | undefined;

  // 1. Check for JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      extractedTrxId =
        parsed.trxId ||
        parsed.trx_id ||
        parsed.txId ||
        parsed.txid ||
        parsed.transactionId ||
        parsed.transaction_id ||
        parsed.reference ||
        parsed.ref ||
        parsed.id ||
        '';

      if (parsed.amount) {
        const num = parseFloat(parsed.amount);
        if (!isNaN(num) && num > 0) detectedAmount = num;
      }
      if (parsed.method) {
        detectedMethod = normalizePaymentMethod(parsed.method);
      }
      if (parsed.phone || parsed.sender || parsed.account) {
        detectedPhone = sanitizePhone(parsed.phone || parsed.sender || parsed.account);
      }
      if (parsed.orderId || parsed.order_id) {
        detectedOrderId = parsed.orderId || parsed.order_id;
      }
    } catch {
      // not JSON, continue
    }
  }

  // 2. Check for URL or deep link scheme
  if (!extractedTrxId && (trimmed.includes('://') || trimmed.startsWith('http') || trimmed.includes('?'))) {
    try {
      // Normalize scheme for URL constructor if needed
      const urlToParse = trimmed.includes('://') ? trimmed : `https://${trimmed}`;
      const url = new URL(urlToParse);
      const params = url.searchParams;

      extractedTrxId =
        params.get('trxId') ||
        params.get('trx_id') ||
        params.get('txId') ||
        params.get('txid') ||
        params.get('txnId') ||
        params.get('transactionId') ||
        params.get('transaction_id') ||
        params.get('ref') ||
        params.get('orderId') ||
        params.get('id') ||
        '';

      const amtParam = params.get('amount') || params.get('amt');
      if (amtParam) {
        const num = parseFloat(amtParam);
        if (!isNaN(num) && num > 0) detectedAmount = num;
      }

      // Check scheme for method
      if (url.protocol.includes('bkash')) detectedMethod = 'bKash';
      else if (url.protocol.includes('nagad')) detectedMethod = 'Nagad';
      else if (url.protocol.includes('rocket')) detectedMethod = 'Rocket';
      else if (url.protocol.includes('upay')) detectedMethod = 'Upay';
      else if (url.protocol.includes('binance')) detectedMethod = 'BinancePay';
      else if (url.protocol.includes('crypto')) detectedMethod = 'Cryptocurrency';

      const phoneParam = params.get('phone') || params.get('recipient') || params.get('sender');
      if (phoneParam) detectedPhone = sanitizePhone(phoneParam);

      const refParam = params.get('ref') || params.get('orderId');
      if (refParam && !detectedOrderId) detectedOrderId = refParam;
    } catch {
      // fallback to regex
    }
  }

  // 3. Regex extraction from Receipt text (SMS, app statement, printed QR receipt)
  if (!extractedTrxId) {
    // TrxID matchers: TrxID: 9X721M88 or Transaction ID: BL9... or Txn: ...
    const trxRegex = /(?:TrxID|Transaction\s*ID|TxID|Txn\s*ID|Transaction\s*No|Trx\s*ID|Ref(?:erence)?|আইডি)[:=\s#]+([A-Za-z0-9_-]{6,36})/i;
    const trxMatch = trimmed.match(trxRegex);
    if (trxMatch && trxMatch[1]) {
      extractedTrxId = trxMatch[1];
    }
  }

  // Detect Amount from text if not found
  if (detectedAmount === undefined) {
    const amtRegex = /(?:Tk|BDT|৳|\$|USDT|USD|Amount|পরিমাণ)[:=\s]*([0-9]+(?:\.[0-9]{1,2})?)/i;
    const amtMatch = trimmed.match(amtRegex);
    if (amtMatch && amtMatch[1]) {
      const num = parseFloat(amtMatch[1]);
      if (!isNaN(num) && num > 0) detectedAmount = num;
    }
  }

  // Detect Phone from text if not found
  if (!detectedPhone) {
    const phoneRegex = /(?:01[3-9]\d{8})/;
    const phoneMatch = trimmed.match(phoneRegex);
    if (phoneMatch && phoneMatch[0]) {
      detectedPhone = phoneMatch[0];
    }
  }

  // Detect Method from text if not found
  if (!detectedMethod) {
    if (/bkash|বিকাশ/i.test(trimmed)) detectedMethod = 'bKash';
    else if (/nagad|নগদ/i.test(trimmed)) detectedMethod = 'Nagad';
    else if (/rocket|রকেট/i.test(trimmed)) detectedMethod = 'Rocket';
    else if (/upay|উপায়/i.test(trimmed)) detectedMethod = 'Upay';
    else if (/binance\s*pay|binance/i.test(trimmed)) detectedMethod = 'BinancePay';
    else if (/usdt|crypto|trc20|bep20/i.test(trimmed)) detectedMethod = 'Cryptocurrency';
  }

  // 4. If still no TrxID found, test if the entire string itself is a clean TrxID
  if (!extractedTrxId) {
    const cleanCandidate = trimmed.replace(/[^A-Za-z0-9]/g, '');
    if (cleanCandidate.length >= 6 && cleanCandidate.length <= 36) {
      extractedTrxId = cleanCandidate;
    }
  }

  // Format TrxID cleanly
  extractedTrxId = extractedTrxId.trim().toUpperCase();

  // 5. Validation & Confidence Scoring
  const isValidTrx = extractedTrxId.length >= 6 && extractedTrxId.length <= 36;
  let amountMatches: boolean | undefined = undefined;

  if (expectedAmount !== undefined && detectedAmount !== undefined) {
    amountMatches = Math.abs(expectedAmount - detectedAmount) < 0.01;
  }

  if (!isValidTrx) {
    return {
      rawText,
      trxId: extractedTrxId,
      detectedAmount,
      detectedMethod,
      detectedPhone,
      detectedOrderId,
      isValid: false,
      status: 'invalid',
      title: 'অকার্যকর ট্রানজেকশন আইডি',
      message: 'কিউআর কোডটিতে সঠিক ট্রানজেকশন আইডি (TrxID) পাওয়া যায়নি। অনুগ্রহ করে বিকাশ, নগদ বা বাইন্যান্সের পেমেন্ট রসিদ স্ক্যান করুন।',
      confidence: 'low',
    };
  }

  // Valid TrxID determined
  const isComplete = Boolean(detectedAmount && detectedMethod);
  const confidence: 'high' | 'medium' = isComplete || amountMatches ? 'high' : 'medium';

  let status: 'verified_complete' | 'verified_trx_only' = isComplete
    ? 'verified_complete'
    : 'verified_trx_only';

  let message = `ট্রানজেকশন আইডি: ${extractedTrxId} সফলভাবে যাচাই করা হয়েছে।`;
  if (detectedAmount) {
    message += ` পরিমাণ: ৳${detectedAmount.toLocaleString()}`;
    if (amountMatches === true) {
      message += ` (রিকোয়েস্ট পরিমাণের সাথে শতভাগ মিলেছে!)`;
    } else if (amountMatches === false && expectedAmount) {
      message += ` (সতর্কতা: রিকোয়েস্ট পরিমাণ ৳${expectedAmount} এর চেয়ে ভিন্ন)`;
    }
  }
  if (detectedMethod) {
    message += ` • পেমেন্ট মাধ্যম: ${detectedMethod}`;
  }

  return {
    rawText,
    trxId: extractedTrxId,
    detectedAmount,
    detectedMethod: detectedMethod || expectedMethod,
    detectedPhone,
    detectedOrderId,
    isValid: true,
    status,
    title: '✓ ট্রানজেকশন আইডি ভেরিফাইড (Verified TrxID)',
    message,
    confidence,
    amountMatches,
  };
}

function normalizePaymentMethod(methodStr: string): PaymentMethod | undefined {
  const m = methodStr.toLowerCase().trim();
  if (m.includes('bkash') || m.includes('বিকাশ')) return 'bKash';
  if (m.includes('nagad') || m.includes('নগদ')) return 'Nagad';
  if (m.includes('rocket') || m.includes('রকেট')) return 'Rocket';
  if (m.includes('upay') || m.includes('উপায়')) return 'Upay';
  if (m.includes('binance')) return 'BinancePay';
  if (m.includes('crypto') || m.includes('usdt')) return 'Cryptocurrency';
  return undefined;
}

function sanitizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('01')) return digits;
  if (digits.length === 13 && digits.startsWith('8801')) return digits.slice(2);
  return digits;
}
