import { PaymentMethod } from '../types';

// High-fidelity, self-contained SVG Data URIs for official payment brands
// These work 100% offline, never 404, never get blocked by CORS, and look sharp on all displays.

export const DEFAULT_PAYMENT_LOGOS: Record<string, string> = {
  bKash: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23E2136E"/><path d="M52 18 L76 43 L60 49 L52 18 Z" fill="%23FFFFFF"/><path d="M52 18 L24 49 L48 49 L52 18 Z" fill="%23FFFFFF" opacity="0.9"/><path d="M48 49 L28 74 L54 62 L48 49 Z" fill="%23FFFFFF" opacity="0.85"/><path d="M54 62 L74 78 L65 53 L54 62 Z" fill="%23FFFFFF"/><path d="M60 49 L76 43 L84 62 L65 53 Z" fill="%23FFFFFF" opacity="0.95"/><circle cx="50" cy="50" r="4" fill="%23E2136E"/></svg>`,

  Nagad: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23F7941D"/><path d="M50 15 C34 15 22 28 22 45 C22 62 35 76 52 76 C68 76 80 64 80 47 C80 34 71 25 61 25 C52 25 45 32 45 41 C45 49 51 55 58 55 C63 55 67 51 67 46" fill="none" stroke="%23FFFFFF" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="46" r="6" fill="%23ED1C24"/><path d="M28 65 Q45 88 72 70" fill="none" stroke="%23ED1C24" stroke-width="6" stroke-linecap="round"/></svg>`,

  Rocket: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%238C3494"/><path d="M50 16 C50 16 66 32 66 56 L34 56 C34 32 50 16 50 16 Z" fill="%23FFFFFF"/><circle cx="50" cy="38" r="7" fill="%238C3494"/><path d="M34 46 L22 60 L34 58 Z" fill="%23FFD100"/><path d="M66 46 L78 60 L66 58 Z" fill="%23FFD100"/><path d="M42 56 L38 72 L46 66 L50 78 L54 66 L62 72 L58 56 Z" fill="%23FF4D4D"/><circle cx="50" cy="38" r="4" fill="%23FFFFFF"/></svg>`,

  Upay: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23002D62"/><path d="M30 25 L30 52 C30 64 39 74 51 74 C63 74 72 64 72 52 L72 25" fill="none" stroke="%23FFCC00" stroke-width="12" stroke-linecap="round"/><circle cx="51" cy="48" r="7" fill="%23FFFFFF"/><path d="M72 45 L72 75" fill="none" stroke="%2300A859" stroke-width="10" stroke-linecap="round"/></svg>`,

  BinancePay: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23F0B90B"/><path d="M50 20 L65 35 L50 50 L35 35 Z" fill="%231E2026"/><path d="M50 58 L65 73 L50 88 L35 73 Z" fill="%231E2026"/><path d="M26 44 L36 54 L26 64 L16 54 Z" fill="%231E2026"/><path d="M74 44 L84 54 L74 64 L64 54 Z" fill="%231E2026"/><path d="M50 40 L60 50 L50 60 L40 50 Z" fill="%231E2026"/></svg>`,

  Cryptocurrency: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2326A17B"/><path d="M26 32 L74 32 L74 42 L55 42 L55 48 C68 49 78 52 78 56 C78 61 66 65 50 65 C34 65 22 61 22 56 C22 52 32 49 45 48 L45 42 L26 42 Z" fill="%23FFFFFF"/><path d="M50 61 C63 61 72 58 72 56 C72 54 63 51 50 51 C37 51 28 54 28 56 C28 58 37 61 50 61 Z" fill="%2326A17B"/><rect x="45" y="48" width="10" height="30" fill="%23FFFFFF"/></svg>`,
};

// Preset logo variations for 1-click admin selection
export interface PaymentLogoPreset {
  name: string;
  badge: string;
  url: string;
}

export const PAYMENT_LOGO_PRESETS: Record<string, PaymentLogoPreset[]> = {
  bKash: [
    {
      name: 'অফিশিয়াল পিঙ্ক ব্যাজ (Official Badge)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.bKash,
    },
    {
      name: 'হোয়াইট ব্যাকগ্রাউন্ড লোগো (White Card)',
      badge: 'White',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FFFFFF" stroke="%23E2136E" stroke-width="4"/><path d="M52 20 L74 43 L59 49 L52 20 Z" fill="%23E2136E"/><path d="M52 20 L26 49 L48 49 L52 20 Z" fill="%23E2136E" opacity="0.85"/><path d="M48 49 L30 72 L54 61 L48 49 Z" fill="%23E2136E" opacity="0.75"/><path d="M54 61 L72 76 L64 53 L54 61 Z" fill="%23E2136E"/><circle cx="50" cy="50" r="4" fill="%23FFD100"/></svg>`,
    },
    {
      name: 'ডার্ক গোল্ড প্রিমিয়াম (Dark Gold)',
      badge: 'Gold',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23180E2B" stroke="%23F59E0B" stroke-width="3"/><path d="M52 20 L74 43 L59 49 L52 20 Z" fill="%23F59E0B"/><path d="M52 20 L26 49 L48 49 L52 20 Z" fill="%23F59E0B" opacity="0.85"/><path d="M48 49 L30 72 L54 61 L48 49 Z" fill="%23F59E0B" opacity="0.7"/><path d="M54 61 L72 76 L64 53 L54 61 Z" fill="%23F59E0B"/></svg>`,
    },
  ],
  Nagad: [
    {
      name: 'অফিশিয়াল অরেঞ্জ (Official Orange)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.Nagad,
    },
    {
      name: 'হোয়াইট ব্যাকগ্রাউন্ড (White Card)',
      badge: 'White',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FFFFFF" stroke="%23F7941D" stroke-width="4"/><path d="M50 15 C34 15 22 28 22 45 C22 62 35 76 52 76 C68 76 80 64 80 47 C80 34 71 25 61 25 C52 25 45 32 45 41 C45 49 51 55 58 55" fill="none" stroke="%23F7941D" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="46" r="6" fill="%23ED1C24"/></svg>`,
    },
    {
      name: 'ডার্ক রেড প্রিমিয়াম (Dark Red)',
      badge: 'Dark',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%231F0A10" stroke="%23EF4444" stroke-width="3"/><path d="M50 15 C34 15 22 28 22 45 C22 62 35 76 52 76 C68 76 80 64 80 47 C80 34 71 25 61 25 C52 25 45 32 45 41 C45 49 51 55 58 55" fill="none" stroke="%23FB923C" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="46" r="6" fill="%23EF4444"/></svg>`,
    },
  ],
  Rocket: [
    {
      name: 'অফিশিয়াল পার্পল (Official Purple)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.Rocket,
    },
    {
      name: 'হোয়াইট ব্যাকগ্রাউন্ড (White Card)',
      badge: 'White',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FFFFFF" stroke="%238C3494" stroke-width="4"/><path d="M50 16 C50 16 66 32 66 56 L34 56 C34 32 50 16 50 16 Z" fill="%238C3494"/><circle cx="50" cy="38" r="6" fill="%23FFD100"/><path d="M42 56 L38 72 L50 66 L62 72 L58 56 Z" fill="%23E11D48"/></svg>`,
    },
  ],
  Upay: [
    {
      name: 'অফিশিয়াল নেভি ব্লু (Official Navy)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.Upay,
    },
    {
      name: 'গোল্ডেন ইয়েলো ব্যাকগ্রাউন্ড (Yellow Card)',
      badge: 'Yellow',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23FFCC00"/><path d="M30 25 L30 52 C30 64 39 74 51 74 C63 74 72 64 72 52 L72 25" fill="none" stroke="%23002D62" stroke-width="12" stroke-linecap="round"/><circle cx="51" cy="48" r="7" fill="%23002D62"/></svg>`,
    },
  ],
  BinancePay: [
    {
      name: 'বাইনান্স গোল্ড (Official Gold)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.BinancePay,
    },
    {
      name: 'বাইনান্স ডার্ক মোড (Dark Premium)',
      badge: 'Dark',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23181A20" stroke="%23F0B90B" stroke-width="3"/><path d="M50 20 L65 35 L50 50 L35 35 Z" fill="%23F0B90B"/><path d="M50 58 L65 73 L50 88 L35 73 Z" fill="%23F0B90B"/><path d="M26 44 L36 54 L26 64 L16 54 Z" fill="%23F0B90B"/><path d="M74 44 L84 54 L74 64 L64 54 Z" fill="%23F0B90B"/><path d="M50 40 L60 50 L50 60 L40 50 Z" fill="%23F0B90B"/></svg>`,
    },
  ],
  Cryptocurrency: [
    {
      name: 'টেথার ইউএসডিটি গ্রিন (Official USDT)',
      badge: 'Official',
      url: DEFAULT_PAYMENT_LOGOS.Cryptocurrency,
    },
    {
      name: 'ডার্ক সায়ান ক্রিপ্টো (Dark Cyan)',
      badge: 'Dark',
      url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%230B1C1A" stroke="%232DD4BF" stroke-width="3"/><path d="M26 32 L74 32 L74 42 L55 42 L55 48 C68 49 78 52 78 56 C78 61 66 65 50 65 C34 65 22 61 22 56 C22 52 32 49 45 48 L45 42 L26 42 Z" fill="%232DD4BF"/><rect x="45" y="48" width="10" height="30" fill="%232DD4BF"/></svg>`,
    },
  ],
};

/**
 * Returns the effective logo for any payment method.
 * Checks custom logos from AppSettings first; falls back to default official SVG data URI.
 */
export function getPaymentMethodLogo(
  method: PaymentMethod | string,
  customLogos?: Record<string, string | undefined>
): string {
  // Normalize method key
  const raw = String(method || '').trim();
  let normalizedKey = raw;

  if (/bkash|বিকাশ/i.test(raw)) {
    normalizedKey = 'bKash';
  } else if (/nagad|নগদ/i.test(raw)) {
    normalizedKey = 'Nagad';
  } else if (/rocket|রকেট/i.test(raw)) {
    normalizedKey = 'Rocket';
  } else if (/upay|উপায়|উপায়/i.test(raw)) {
    normalizedKey = 'Upay';
  } else if (/binance|বাইনান্স/i.test(raw)) {
    normalizedKey = 'BinancePay';
  } else if (/crypto|usdt|ক্রিপ্টো/i.test(raw)) {
    normalizedKey = 'Cryptocurrency';
  }

  // If customLogos passed directly, check that
  if (customLogos && customLogos[normalizedKey]) {
    const custom = customLogos[normalizedKey];
    if (custom && custom.trim().length > 0) {
      return custom.trim();
    }
  }

  // Fallback: check localStorage app settings if customLogos was not provided or didn't contain key
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('kingludo_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.paymentLogos && parsed.paymentLogos[normalizedKey]) {
          const custom = parsed.paymentLogos[normalizedKey];
          if (custom && typeof custom === 'string' && custom.trim().length > 0) {
            return custom.trim();
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_PAYMENT_LOGOS[normalizedKey] || DEFAULT_PAYMENT_LOGOS.bKash;
}

/**
 * Brand accent colors for UI matching
 */
export const PAYMENT_BRAND_THEMES: Record<
  string,
  {
    name: string;
    bengaliName: string;
    bgBadge: string;
    borderColor: string;
    textColor: string;
    accentHex: string;
  }
> = {
  bKash: {
    name: 'bKash',
    bengaliName: 'বিকাশ',
    bgBadge: 'bg-pink-600/20 text-pink-300',
    borderColor: 'border-pink-500/50',
    textColor: 'text-pink-400',
    accentHex: '#E2136E',
  },
  Nagad: {
    name: 'Nagad',
    bengaliName: 'নগদ',
    bgBadge: 'bg-orange-600/20 text-orange-300',
    borderColor: 'border-orange-500/50',
    textColor: 'text-orange-400',
    accentHex: '#F7941D',
  },
  Rocket: {
    name: 'Rocket',
    bengaliName: 'রকেট',
    bgBadge: 'bg-purple-600/20 text-purple-300',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-300',
    accentHex: '#8C3494',
  },
  Upay: {
    name: 'Upay',
    bengaliName: 'উপায়',
    bgBadge: 'bg-yellow-600/20 text-yellow-300',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    accentHex: '#FFCC00',
  },
  BinancePay: {
    name: 'Binance Pay',
    bengaliName: 'বাইনান্স পে',
    bgBadge: 'bg-amber-500/20 text-amber-300',
    borderColor: 'border-amber-400/50',
    textColor: 'text-amber-300',
    accentHex: '#F0B90B',
  },
  Cryptocurrency: {
    name: 'Cryptocurrency',
    bengaliName: 'ইউএসডিটি ক্রিপ্টো',
    bgBadge: 'bg-emerald-500/20 text-emerald-300',
    borderColor: 'border-emerald-400/50',
    textColor: 'text-emerald-300',
    accentHex: '#26A17B',
  },
};
