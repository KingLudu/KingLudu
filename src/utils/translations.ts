import { RegionCode } from '../types';

export interface Translations {
  appName: string;
  deposit: string;
  withdraw: string;
  depositSubtitle: string;
  withdrawSubtitle: string;
  createMatch: string;
  createMatchDesc: string;
  joinMatch: string;
  joinMatchDesc: string;
  leaderboard: string;
  profile: string;
  wallet: string;
  history: string;
  support: string;
  login: string;
  register: string;
  latestWinners: string;
  selectRegion: string;
  balance: string;
  refreshBalance: string;
  entryFee: string;
  prizePool: string;
  ludoBoard: string;
  rules: string;
  sound: string;
  chat: string;
  rollDice: string;
  rolling: string;
  turn: string;
  wait: string;
  roomCode: string;
  players: string;
  emptySlot: string;
  addMoneyTitle: string;
  withdrawTitle: string;
  submitRequest: string;
  referAndEarn: string;
  adminPanel: string;
  logout: string;
  home: string;
  settings: string;
  selectMethod: string;
  accountNumber: string;
  transactionId: string;
  minAmount: string;
  joinRoom: string;
  quickMatch: string;
  playNow: string;
  enterJoinCode: string;
  friendJoinCode: string;
  shareCodeWithFriend: string;
  copyCode: string;
  codeCopied: string;
}

export const TRANSLATIONS: Record<RegionCode, Translations> = {
  BN: {
    appName: 'KingLudu',
    deposit: 'ডিপোজিট',
    withdraw: 'উইথড্র',
    depositSubtitle: 'টাকা জমা দিন',
    withdrawSubtitle: 'টাকা তুলুন',
    createMatch: 'ম্যাচ তৈরি করুন',
    createMatchDesc: 'কাস্টম রুম বানিয়ে বন্ধুদের সাথে খেলুন',
    joinMatch: 'ম্যাচে যোগ দিন',
    joinMatchDesc: 'রুম কোড দিয়ে সরাসরি ম্যাচে অংশ নিন',
    leaderboard: 'লিডারবোর্ড',
    profile: 'প্রোফাইল',
    wallet: 'ওয়ালেট',
    history: 'ম্যাচ হিস্ট্রি',
    support: 'কাস্টমার সাপোর্ট',
    login: 'লগইন',
    register: 'নিবন্ধন',
    latestWinners: 'সর্বশেষ বিজয়ীগণ',
    selectRegion: 'দেশ নির্বাচন করুন',
    balance: 'ব্যালেন্স',
    refreshBalance: 'ব্যালেন্স রিফ্রেশ',
    entryFee: 'এন্ট্রি ফি',
    prizePool: 'প্রাইজ পুল',
    ludoBoard: 'লুডু বোর্ড',
    rules: 'নিয়মকানুন',
    sound: 'সাউন্ড',
    chat: 'চ্যাট',
    rollDice: 'দান চালুন',
    rolling: 'ঘুরছে...',
    turn: 'আপনার চাল',
    wait: 'অপেক্ষা করুন',
    roomCode: 'রুম কোড',
    players: 'খেলোয়াড়',
    emptySlot: 'খালি স্লট',
    addMoneyTitle: 'ডিপোজিট (টাকা জমা)',
    withdrawTitle: 'উইথড্র (টাকা উত্তোলন)',
    submitRequest: 'রিকোয়েস্ট পাঠান',
    referAndEarn: 'রেফার এবং আয় করুন',
    adminPanel: 'এডমিন প্যানেল',
    logout: 'লগআউট',
    home: 'হোম',
    settings: 'সেটিংস',
    selectMethod: 'পেমেন্ট মাধ্যম বেছে নিন',
    accountNumber: 'অ্যাকাউন্ট নম্বর',
    transactionId: 'ট্রানজেকশন আইডি',
    minAmount: 'সর্বনিম্ন পরিমাণ',
    joinRoom: 'রুমে যোগ দিন',
    quickMatch: 'কুইক অটো ম্যাচ',
    playNow: 'এখনই খেলুন',
    enterJoinCode: 'জয়েন কোড দিন',
    friendJoinCode: 'ফ্রেন্ডের জয়েন কোড',
    shareCodeWithFriend: 'ফ্রেন্ডকে কোড পাঠান',
    copyCode: 'কোড কপি করুন',
    codeCopied: 'কোড কপি হয়েছে!',
  },
  EN: {
    appName: 'KingLudu',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    depositSubtitle: 'Add Money to Wallet',
    withdrawSubtitle: 'Cash Out Winnings',
    createMatch: 'Create Match',
    createMatchDesc: 'Create a custom room & play with friends',
    joinMatch: 'Join Match',
    joinMatchDesc: 'Enter room code to play instantly',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    wallet: 'Wallet',
    history: 'Match History',
    support: 'Customer Support',
    login: 'Login',
    register: 'Register',
    latestWinners: 'Latest Winners',
    selectRegion: 'Select Region',
    balance: 'Balance',
    refreshBalance: 'Refresh Balance',
    entryFee: 'Entry Fee',
    prizePool: 'Prize Pool',
    ludoBoard: 'Ludo Board',
    rules: 'Rules',
    sound: 'Sound',
    chat: 'Chat',
    rollDice: 'Roll Dice',
    rolling: 'Rolling...',
    turn: 'Your Turn',
    wait: 'Please Wait',
    roomCode: 'Room Code',
    players: 'Players',
    emptySlot: 'Empty Slot',
    addMoneyTitle: 'Deposit Funds',
    withdrawTitle: 'Withdraw Winnings',
    submitRequest: 'Submit Request',
    referAndEarn: 'Refer & Earn',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    home: 'Home',
    settings: 'Settings',
    selectMethod: 'Select Payment Method',
    accountNumber: 'Account Number',
    transactionId: 'Transaction ID',
    minAmount: 'Minimum Amount',
    joinRoom: 'Join Room',
    quickMatch: 'Quick Auto Match',
    playNow: 'Play Now',
    enterJoinCode: 'Enter Join Code',
    friendJoinCode: "Friend's Join Code",
    shareCodeWithFriend: 'Share Code with Friend',
    copyCode: 'Copy Code',
    codeCopied: 'Code Copied!',
  },
  IN: {
    appName: 'KingLudu',
    deposit: 'डिपॉजिट',
    withdraw: 'विथड्रॉ',
    depositSubtitle: 'वॉलेट में पैसे जोड़ें',
    withdrawSubtitle: 'जीत की राशि निकालें',
    createMatch: 'मैच बनाएं',
    createMatchDesc: 'कस्टम रूम बनाएं और दोस्तों के साथ खेलें',
    joinMatch: 'मैच में शामिल हों',
    joinMatchDesc: 'रूम कोड डालकर तुरंत खेलें',
    leaderboard: 'लीडरबोर्ड',
    profile: 'प्रोफ़ाइल',
    wallet: 'वॉलेट',
    history: 'मैच इतिहास',
    support: 'ग्राहक सहायता',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    latestWinners: 'नवीनतम विजेता',
    selectRegion: 'देश चुनें',
    balance: 'बैलेंस',
    refreshBalance: 'बैलेंस रिफ्रेश करें',
    entryFee: 'एंट्री फीस',
    prizePool: 'इनाम राशि',
    ludoBoard: 'लूडो बोर्ड',
    rules: 'नियम',
    sound: 'ध्वनि',
    chat: 'चैट',
    rollDice: 'पासा फेंकें',
    rolling: 'घूम रहा है...',
    turn: 'आपकी बारी',
    wait: 'कृपया प्रतीक्षा करें',
    roomCode: 'रूम कोड',
    players: 'खिलाड़ी',
    emptySlot: 'खाली स्लॉट',
    addMoneyTitle: 'डिपॉजिट (पैसे जोड़ें)',
    withdrawTitle: 'विथड्रॉ (पैसे निकालें)',
    submitRequest: 'अनुरोध भेजें',
    referAndEarn: 'रेफर करें और कमाएं',
    adminPanel: 'एडमिन पैनल',
    logout: 'लॉगआउट',
    home: 'होम',
    settings: 'सेटिंग्स',
    selectMethod: 'भुगतान विधि चुनें',
    accountNumber: 'खाता संख्या / नंबर',
    transactionId: 'ट्रांजेक्शन आईडी',
    minAmount: 'न्यूनतम राशि',
    joinRoom: 'रूम में शामिल हों',
    quickMatch: 'क्विक ऑटो मैच',
    playNow: 'अभी खेलें',
    enterJoinCode: 'जॉइन कोड दर्ज करें',
    friendJoinCode: 'फ्रेंड का जॉइन कोड',
    shareCodeWithFriend: 'फ्रेंड को कोड भेजें',
    copyCode: 'कोड कॉपी करें',
    codeCopied: 'कोड कॉपी हो गया!',
  },
  NP: {
    appName: 'KingLudu',
    deposit: 'डिपोजिट',
    withdraw: 'विथड्र',
    depositSubtitle: 'वालेटमा पैसा थप्नुहोस्',
    withdrawSubtitle: 'जितेको रकम निकाल्नुहोस्',
    createMatch: 'म्याच बनाउनुहोस्',
    createMatchDesc: 'कस्टम रुम बनाएर साथीहरूसँग खेल्नुहोस्',
    joinMatch: 'म्याचमा सामेल हुनुहोस्',
    joinMatchDesc: 'रुम कोड राखेर तुरुन्तै खेल्नुहोस्',
    leaderboard: 'लिडरबोर्ड',
    profile: 'प्रोफाइल',
    wallet: 'वालेट',
    history: 'म्याच इतिहास',
    support: 'ग्राहक सहायता',
    login: 'लगइन',
    register: 'दर्ता',
    latestWinners: 'पछिल्ला विजेताहरू',
    selectRegion: 'देश छान्नुहोस्',
    balance: 'ब्यालेन्स',
    refreshBalance: 'ब्यालेन्स रिफ्रेस गर्नुहोस्',
    entryFee: 'प्रवेश शुल्क',
    prizePool: 'पुरस्कार राशि',
    ludoBoard: 'लुडो बोर्ड',
    rules: 'नियमहरू',
    sound: 'आवाज',
    chat: 'च्याट',
    rollDice: 'पासा गुडाउनुहोस्',
    rolling: 'घुम्दैछ...',
    turn: 'तपाईंको पालो',
    wait: 'कृपया पर्खनुहोस्',
    roomCode: 'रुम कोड',
    players: 'खेलाडीहरू',
    emptySlot: 'खाली स्थान',
    addMoneyTitle: 'डिपोजिट (पैसा थप्नुहोस्)',
    withdrawTitle: 'विथड्र (पैसा निकाल्नुहोस्)',
    submitRequest: 'अनुरोध पठाउनुहोस्',
    referAndEarn: 'सिफारिस गर्नुहोस् र कमाउनुहोस्',
    adminPanel: 'एडमिन प्यानल',
    logout: 'लगआउट',
    home: 'गृहपृष्ठ',
    settings: 'सेटिङहरू',
    selectMethod: 'भुक्तानी तरिका छान्नुहोस्',
    accountNumber: 'खाता नम्बर',
    transactionId: 'ट्रान्जिसन आईडी',
    minAmount: 'न्यूनतम रकम',
    joinRoom: 'रुममा सामेल हुनुहोस्',
    quickMatch: 'क्विक अटो म्याच',
    playNow: 'अहिले खेल्नुहोस्',
    enterJoinCode: 'ज्वाइन कोड राख्नुहोस्',
    friendJoinCode: 'साथीको ज्वाइन कोड',
    shareCodeWithFriend: 'साथीलाई कोड पठाउनुहोस्',
    copyCode: 'कोड कपी गर्नुहोस्',
    codeCopied: 'कोड कपी भयो!',
  },
};

export const getTranslation = (region: string = 'BN'): Translations => {
  return TRANSLATIONS[region as RegionCode] || TRANSLATIONS.BN;
};
