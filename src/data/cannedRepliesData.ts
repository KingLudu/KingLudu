export type CannedCategory = 'all' | 'deposit' | 'withdraw' | 'gameplay' | 'account' | 'bonus' | 'general';

export interface CannedReplyItem {
  id: string;
  category: 'deposit' | 'withdraw' | 'gameplay' | 'account' | 'bonus' | 'general';
  text: string;
  shortTitle?: string;
  badge?: string;
  isCustom?: boolean;
}

export const CANNED_CATEGORIES: { id: CannedCategory; label: string; icon?: string }[] = [
  { id: 'all', label: 'সব উত্তর (All)' },
  { id: 'deposit', label: '💰 ডিপোজিট' },
  { id: 'withdraw', label: '💸 উইথড্র' },
  { id: 'gameplay', label: '🎲 গেম ও রিফান্ড' },
  { id: 'account', label: '👤 একাউন্ট ও KYC' },
  { id: 'bonus', label: '🎁 বোনাস ও অফার' },
  { id: 'general', label: '🤝 সাধারণ ও শুভেচ্ছা' },
];

export const DEFAULT_CANNED_REPLIES: CannedReplyItem[] = [
  // 1. ডিপোজিট ও পেমেন্ট (Deposit & Payment) - Original 2 first
  {
    id: 'dep_1',
    category: 'deposit',
    text: 'আপনার ডিপোজিট TrxID যাচাই করা হচ্ছে, ২ মিনিটের মধ্যে পয়েন্ট জমা হবে।',
    shortTitle: 'TrxID যাচাই হচ্ছে (২ মিনিট)',
    badge: 'জরুরি',
  },
  {
    id: 'dep_2',
    category: 'deposit',
    text: 'অনুগ্রহ করে আপনার বিকাশ/নগদ স্টেটমেন্টের স্ক্রিনশট প্রদান করুন।',
    shortTitle: 'স্টেটমেন্টের স্ক্রিনশট চান',
    badge: 'স্ক্রিনশট',
  },
  {
    id: 'dep_3',
    category: 'deposit',
    text: 'আপনার ডিপোজিট সফলভাবে অ্যাকাউন্টে যোগ করা হয়েছে। দয়া করে ব্যালেন্স রিফ্রেশ করুন।',
    shortTitle: 'ডিপোজিট সফলভাবে যোগ হয়েছে',
    badge: 'সফল',
  },
  {
    id: 'dep_4',
    category: 'deposit',
    text: 'আপনার দেওয়া TrxID বা লেনদেন তথ্য সঠিক নয়। অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি দিন।',
    shortTitle: 'ভুল TrxID / তথ্য অসম্পূর্ণ',
    badge: 'ত্রুটি',
  },
  {
    id: 'dep_5',
    category: 'deposit',
    text: "আমাদের অফিশিয়াল নাম্বারে 'Send Money' নয়, শুধুমাত্র 'Cash Out' করতে হবে।",
    shortTitle: 'ক্যাশ আউট করার নির্দেশ',
  },
  {
    id: 'dep_6',
    category: 'deposit',
    text: 'এই TrxID টি পূর্বে ব্যবহার করা হয়েছে। অনুগ্রহ করে নতুন সফল লেনদেনের TrxID প্রদান করুন।',
    shortTitle: 'ডুপ্লিকেট TrxID সতর্কতা',
  },
  {
    id: 'dep_7',
    category: 'deposit',
    text: 'ডিপোজিট সফল হতে সর্বনিম্ন ৫০ টাকা বা তার বেশি ডিপোজিট করতে হবে।',
    shortTitle: 'সর্বনিম্ন ৫০ টাকা ডিপোজিট',
  },
  {
    id: 'dep_8',
    category: 'deposit',
    text: 'অফিশিয়াল ডিপোজিট নাম্বার নিয়মিত পরিবর্তন হতে পারে, প্রতিবার ডিপোজিট পেজে নাম্বার চেক করে টাকা পাঠান।',
    shortTitle: 'নাম্বার চেক করে টাকা পাঠান',
  },
  {
    id: 'dep_9',
    category: 'deposit',
    text: 'পেমেন্ট গেটওয়েতে সাময়িক নেটওয়ার্ক জ্যাম থাকায় ভেরিফিকেশনে সামান্য দেরি হচ্ছে, অনুগ্রহ করে একটু অপেক্ষা করুন।',
    shortTitle: 'পেমেন্ট গেটওয়ে বিলম্ব',
  },

  // 2. উইথড্র ও পেমেন্ট ডেলিভারি (Withdrawals) - Original 1 first
  {
    id: 'wth_1',
    category: 'withdraw',
    text: 'আপনার উইথড্র রিকোয়েস্ট সফলভাবে প্রসেস করা হয়েছে।',
    shortTitle: 'উইথড্র সফল হয়েছে',
    badge: 'সফল',
  },
  {
    id: 'wth_2',
    category: 'withdraw',
    text: 'আপনার উইথড্র রিকোয়েস্ট রিভিউতে আছে, ২০-৩০ মিনিটের মধ্যে টাকা পৌঁছে যাবে।',
    shortTitle: 'উইথড্র রিভিউতে (২০-৩০ মিনিট)',
  },
  {
    id: 'wth_3',
    category: 'withdraw',
    text: 'আপনার দেওয়া বিকাশ/নগদ/রকেট নম্বরটি ভুল দেখাচ্ছে। সঠিক পার্সোনাল নম্বর ও একাউন্ট টাইপ প্রদান করুন।',
    shortTitle: 'ভুল নম্বর সংশোধন নির্দেশ',
    badge: 'ত্রুটি',
  },
  {
    id: 'wth_4',
    category: 'withdraw',
    text: 'উইথড্র করার জন্য আপনার অ্যাকাউন্টে সর্বনিম্ন ২০০ টাকা ব্যালেন্স থাকতে হবে।',
    shortTitle: 'সর্বনিম্ন ২০০ টাকা উইথড্র লিমিট',
  },
  {
    id: 'wth_5',
    category: 'withdraw',
    text: 'ব্যাংকিং সার্ভার সাময়িক ডাউন থাকায় উইথড্র সামান্য বিলম্বিত হতে পারে, কিছুক্ষণের মধ্যে ব্যালেন্স চলে যাবে।',
    shortTitle: 'ব্যাংক সার্ভার বিলম্ব',
  },
  {
    id: 'wth_6',
    category: 'withdraw',
    text: 'উইথড্র বাতিল করা হয়েছে এবং পুরো টাকা আপনার ওয়ালেটে ফেরত দেওয়া হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিয়ে পুনরায় আবেদন করুন।',
    shortTitle: 'উইথড্র বাতিল ও রিফান্ড',
  },

  // 3. গেমপ্লে, রুম ও রিফান্ড (Gameplay, Room & Refund) - Original 1 first
  {
    id: 'gam_1',
    category: 'gameplay',
    text: 'সাময়িক নেটওয়ার্ক সমস্যার জন্য আমরা আন্তরিকভাবে দুঃখিত। গেম রিফান্ড প্রদান করা হয়েছে।',
    shortTitle: 'নেটওয়ার্ক সমস্যায় রিফান্ড',
    badge: 'রিফান্ড',
  },
  {
    id: 'gam_2',
    category: 'gameplay',
    text: 'রুম কোড দিয়ে লুডো কিং অ্যাপে জয়েন করে খেলুন। কোনো সমস্যা হলে সাথে সাথে রুম স্ক্রিনের স্ক্রিনশট দিন।',
    shortTitle: 'রুম কোডে জয়েন করার নির্দেশ',
  },
  {
    id: 'gam_3',
    category: 'gameplay',
    text: 'আপনার ম্যাচ ফলাফল ভেরিফাই করা হয়েছে এবং উইনিং প্রাইজ আপনার ব্যালেন্সে যোগ করে দেওয়া হয়েছে।',
    shortTitle: 'ম্যাচ ফলাফল ভেরিফাই ও প্রাইজ জমা',
    badge: 'উইন',
  },
  {
    id: 'gam_4',
    category: 'gameplay',
    text: 'ভুল রুম কোড বা প্রতিপক্ষের অনুপস্থিতির জন্য আপনার এন্ট্রি ফি সম্পূর্ণ ওয়ালেটে রিফান্ড করা হয়েছে।',
    shortTitle: 'প্রতিপক্ষ না থাকায় ফি রিফান্ড',
  },
  {
    id: 'gam_5',
    category: 'gameplay',
    text: 'প্রতিপক্ষ চাল না দিয়ে ম্যাচ ছেড়ে ডিসকানেক্ট করায় আপনাকে বিজয়ী ঘোষণা ও পয়েন্ট দেওয়া হয়েছে।',
    shortTitle: 'প্রতিপক্ষ লিভ করায় জয় ঘোষণা',
  },
  {
    id: 'gam_6',
    category: 'gameplay',
    text: 'ম্যাচ শেষ হওয়ার পর সর্বোচ্চ ১৫ মিনিটের মধ্যে উইনিং স্ক্রিনশট সাপোর্ট বা আপলোড বক্সে জমা দিন।',
    shortTitle: '১৫ মিনিটে স্ক্রিনশট জমা দিন',
  },
  {
    id: 'gam_7',
    category: 'gameplay',
    text: 'লুডো খেলায় অটো-রোল বা হ্যাকিং ব্যবহার সম্পূর্ণ নিষিদ্ধ। এরূপ কার্যকলাপে আইডি স্থায়ীভাবে ব্যান করা হবে।',
    shortTitle: 'হ্যাক/অসদুপায় সতর্কতা',
    badge: 'সতর্কতা',
  },
  {
    id: 'gam_8',
    category: 'gameplay',
    text: 'ম্যাচ চলাকালীন কল রিসিভ করা বা অ্যাপ মিনিমাইজ করলে গেম ডিসকানেক্ট হতে পারে, সতর্কতার সাথে খেলুন।',
    shortTitle: 'কল রিসিভ বা মিনিমাইজ সতর্কতা',
  },

  // 4. অ্যাকাউন্ট, নিরাপত্তা ও ওটিপি (Account, Security & KYC)
  {
    id: 'acc_1',
    category: 'account',
    text: 'আপনার অ্যাকাউন্ট ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে। নিশ্চিন্তে গেম খেলুন।',
    shortTitle: 'অ্যাকাউন্ট ভেরিফিকেশন সফল',
    badge: 'ভেরিফাইড',
  },
  {
    id: 'acc_2',
    category: 'account',
    text: 'পাসওয়ার্ড রিসেটের জন্য আপনার রেজিস্টার্ড মোবাইল নম্বর ও ওটিপি (OTP) যাচাই করুন।',
    shortTitle: 'পাসওয়ার্ড রিসেট ও ওটিপি',
  },
  {
    id: 'acc_3',
    category: 'account',
    text: 'একটি ফোনে একাধিক ভুয়া অ্যাকাউন্ট চালানো এবং ফেক রেফারেল সম্পূর্ণ নিষিদ্ধ। নীতি লঙ্ঘনে আইডি স্থগিত হবে।',
    shortTitle: 'মাল্টি-একাউন্ট পলিসি সতর্কতা',
    badge: 'সতর্কতা',
  },
  {
    id: 'acc_4',
    category: 'account',
    text: 'নিরাপত্তাজনিত কারণে আপনার প্রোফাইল তথ্য ও মোবাইল নম্বর আপডেট করার অনুরোধ করা হচ্ছে।',
    shortTitle: 'প্রোফাইল আপডেট অনুরোধ',
  },
  {
    id: 'acc_5',
    category: 'account',
    text: 'আপনার অ্যাকাউন্টে কোনো সন্দেহজনক কার্যকলাপ পরিলক্ষিত হয়নি, আপনার একাউন্ট সম্পূর্ণ নিরাপদ।',
    shortTitle: 'অ্যাকাউন্ট নিরাপদ ঘোষণা',
  },

  // 5. বোনাস, অফার ও রেফারেল (Bonus, Offers & Refer)
  {
    id: 'bon_1',
    category: 'bonus',
    text: 'আপনার রেফারেল বোনাস সফলভাবে ওয়ালেটে যুক্ত করা হয়েছে। বন্ধুদের আরও ইনভাইট করুন!',
    shortTitle: 'রেফারেল বোনাস ওয়ালেটে জমা',
    badge: 'বোনাস',
  },
  {
    id: 'bon_2',
    category: 'bonus',
    text: 'প্রতিদিন ফ্রি লাকি স্পিনার হুইল ঘুরিয়ে আকর্ষণীয় ক্যাশ রিওয়ার্ড ও গিফট সংগ্রহ করুন।',
    shortTitle: 'লাকি স্পিনার রিওয়ার্ড নির্দেশ',
  },
  {
    id: 'bon_3',
    category: 'bonus',
    text: 'প্রোমোকোড বোনাস পয়েন্ট সফলভাবে আপনার অ্যাকাউন্টে জমা হয়েছে।',
    shortTitle: 'প্রোমোকোড বোনাস জমা',
  },
  {
    id: 'bon_4',
    category: 'bonus',
    text: 'ভিআইপি লেভেল আপগ্রেড বোনাস ও ক্যাশব্যাক আপনার মূল ব্যালেন্সে যুক্ত হয়েছে।',
    shortTitle: 'ভিআইপি ক্যাশব্যাক ক্রেডিট',
  },
  {
    id: 'bon_5',
    category: 'bonus',
    text: 'কিং লুডো মেগা টুর্নামেন্টে অংশ নিয়ে বড় প্রাইজমানি জিতে নিন। বিস্তারিত টুর্নামেন্ট বোর্ডে দেখুন।',
    shortTitle: 'মেগা টুর্নামেন্ট অফার',
  },

  // 6. সাধারণ সহায়তা ও সমাপ্তি (General Greetings & Closing)
  {
    id: 'gen_1',
    category: 'general',
    text: 'হ্যালো, কিং লুডো ২৪/৭ কাস্টমার সাপোর্টে স্বাগতম! কীভাবে আপনাকে সাহায্য করতে পারি?',
    shortTitle: 'সাপোর্টে স্বাগতম',
    badge: 'গ্রিটিং',
  },
  {
    id: 'gen_2',
    category: 'general',
    text: 'আমাদের সাপোর্ট টিম বিষয়টি খতিয়ে দেখছে, অনুগ্রহ করে ১-২ মিনিট অপেক্ষা করুন।',
    shortTitle: 'পর্যবেক্ষণে আছে, অপেক্ষা করুন',
  },
  {
    id: 'gen_3',
    category: 'general',
    text: 'ধন্যবাদ! আপনার সমস্যাটির সমাধান হয়েছে। আর কোনো প্রশ্ন থাকলে নির্দ্বিধায় আমাদের জানাবেন।',
    shortTitle: 'সমস্যার সমাধান ধন্যবাদ',
  },
  {
    id: 'gen_4',
    category: 'general',
    text: 'কিং লুডোর সাথে থাকার জন্য ধন্যবাদ। আপনার গেমিং অভিজ্ঞতা আনন্দদায়ক হোক!',
    shortTitle: 'হ্যাপি গেমিং উইশ',
  },
  {
    id: 'gen_5',
    category: 'general',
    text: 'জরুরি সহায়তার জন্য আমাদের অফিসিয়াল হোয়াটসঅ্যাপ হেল্পলাইনে যোগাযোগ করতে পারেন।',
    shortTitle: 'হোয়াটসঅ্যাপ হেল্পলাইন রেফারেন্স',
  },
];

export const STORAGE_KEY_CUSTOM_CANNED = 'kingludo_custom_canned_replies';

export function getStoredCannedReplies(): CannedReplyItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CANNED);
    if (!raw) return DEFAULT_CANNED_REPLIES;
    const customList: CannedReplyItem[] = JSON.parse(raw);
    return [...DEFAULT_CANNED_REPLIES, ...customList];
  } catch (e) {
    console.error('Error reading custom canned replies:', e);
    return DEFAULT_CANNED_REPLIES;
  }
}

export function saveCustomCannedReply(reply: CannedReplyItem): CannedReplyItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CANNED);
    const existing: CannedReplyItem[] = raw ? JSON.parse(raw) : [];
    const updated = [reply, ...existing];
    localStorage.setItem(STORAGE_KEY_CUSTOM_CANNED, JSON.stringify(updated));
    return [...DEFAULT_CANNED_REPLIES, ...updated];
  } catch (e) {
    console.error('Error saving custom canned reply:', e);
    return DEFAULT_CANNED_REPLIES;
  }
}

export function deleteCustomCannedReply(id: string): CannedReplyItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CANNED);
    if (!raw) return DEFAULT_CANNED_REPLIES;
    const existing: CannedReplyItem[] = JSON.parse(raw);
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_CANNED, JSON.stringify(filtered));
    return [...DEFAULT_CANNED_REPLIES, ...filtered];
  } catch (e) {
    console.error('Error deleting custom canned reply:', e);
    return DEFAULT_CANNED_REPLIES;
  }
}
