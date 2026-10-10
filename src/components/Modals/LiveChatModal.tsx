import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  UserRound,
  UserCheck,
  Sparkles, 
  CheckCheck, 
  Image as ImageIcon, 
  Upload, 
  Maximize2, 
  ShieldCheck, 
  Phone,
  Trash2,
  Paperclip,
  Smile,
  MessageCircle,
  ExternalLink,
  MessageSquarePlus,
  ChevronRight,
  HelpCircle,
  Zap,
  Coins,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gamepad2,
  Gift,
  Shield,
  CheckCircle2,
  ListFilter,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, AppSettings, LiveChatMessage } from '../../types';
import { cleanChatText } from '../../utils/chatAutoReply';
import { requestAppFullscreen } from '../../utils/fullscreen';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  appSettings?: AppSettings;
  messages?: LiveChatMessage[];
  onSendMessage?: (text: string, imageUrl?: string, imageName?: string) => void;
  onMarkAsRead?: () => void;
  isTyping?: boolean;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  user,
  appSettings,
  messages = [],
  onSendMessage,
  onMarkAsRead,
  isTyping: externalIsTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);
  const [localIsTyping, setLocalIsTyping] = useState(false);
  const [showChatListModal, setShowChatListModal] = useState(false);
  const [chatListCategory, setChatListCategory] = useState<'all' | 'deposit' | 'withdraw' | 'rules' | 'bonus' | 'account'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      requestAppFullscreen().catch(() => {});
    }
  }, [isOpen]);

  const isAgentTyping = externalIsTyping || localIsTyping;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || user?.phone || 'guest_user';
  const currentUserName = user?.name || 'লুডো প্লেয়ার';
  const currentUserPhone = user?.phone || '01700000000';

  const safeMessages = Array.isArray(messages) ? messages : [];

  // Filter messages for current user thread
  const userThreadMessages = safeMessages.filter(
    (m) => m && (m.userId === currentUserId || m.userPhone === currentUserPhone)
  );

  const defaultWelcomeMessage: LiveChatMessage = {
    id: 'welcome_msg',
    userId: currentUserId,
    userName: currentUserName,
    userPhone: currentUserPhone,
    senderRole: 'agent',
    text: `হ্যালো ${currentUserName}! 👋 কিং লুডো ২৪/৭ লাইভ সাপোর্টে আপনাকে স্বাগতম। আপনার যেকোনো জিজ্ঞাসা, ডিপোজিট, উইথড্র বা ম্যাচের সহায়তার জন্য এখানে বার্তা লিখুন। আমাদের সাপোর্ট এজেন্ট দ্রুত উত্তর দেবেন।`,
    time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
  };

  const displayMessages = userThreadMessages.length > 0 ? userThreadMessages : [defaultWelcomeMessage];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [safeMessages.length, isOpen, isAgentTyping]);

  useEffect(() => {
    if (isOpen && onMarkAsRead) {
      onMarkAsRead();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Comprehensive categorized Quick Chat items
  const allQuickChatItems = [
    // Deposit & Payments
    {
      id: 'dep_1',
      category: 'deposit',
      icon: ArrowDownToLine,
      label: 'বিকাশ ও নগদে কিভাবে ডিপোজিট করব?',
      query: 'বিকাশ ও নগদ ব্যবহার করে কিভাবে ব্যালেন্সে টাকা ডিপোজিট করব এবং অফিশিয়াল নাম্বার কত?',
      badge: 'জনপ্রিয়',
    },
    {
      id: 'dep_2',
      category: 'deposit',
      icon: Coins,
      label: 'টাকা পাঠিয়েছি কিন্তু ব্যালেন্সে যোগ হয়নি (পেন্ডিং)',
      query: 'আমি ডিপোজিট করেছি কিন্তু এখনো একাউন্টে যোগ হয়নি। অনুগ্রহ করে আমার ট্রানজেকশন ভেরিফাই করে দিন।',
      badge: 'জরুরি',
    },
    {
      id: 'dep_3',
      category: 'deposit',
      icon: Coins,
      label: 'সর্বনিম্ন ডিপোজিট লিমিট কত টাকা?',
      query: 'কিং লুডোতে সর্বনিম্ন কত টাকা ডিপোজিট করা যায় এবং কোন কোন মাধ্যম সাপোর্টেড?',
    },
    {
      id: 'dep_4',
      category: 'deposit',
      icon: ImageIcon,
      label: 'পেমেন্ট স্ক্রিনশট বা ভাউচার পাঠাতে চাই',
      query: 'আমি পেমেন্ট সফল হওয়ার স্ক্রিনশট ও TrxID দিতে চাই, অনুগ্রহ করে চেক করুন।',
    },

    // Withdrawals
    {
      id: 'with_1',
      category: 'withdraw',
      icon: ArrowUpFromLine,
      label: 'উইথড্র করার নিয়ম ও টাকা পেতে কত সময় লাগে?',
      query: 'উইথড্র রিকোয়েস্ট দেওয়ার পর টাকা ক্যাশআউট হতে সাধারণত কত মিনিট সময় লাগে?',
      badge: 'জরুরি',
    },
    {
      id: 'with_2',
      category: 'withdraw',
      icon: HelpCircle,
      label: 'আমার উইথড্র রিকোয়েস্ট পেন্ডিং, বর্তমান স্ট্যাটাস কি?',
      query: 'আমার করা উইথড্র রিকোয়েস্টটি এখনো পেন্ডিং দেখাচ্ছে, এর বর্তমান আপডেট জানতে চাই।',
      badge: 'জনপ্রিয়',
    },
    {
      id: 'with_3',
      category: 'withdraw',
      icon: Coins,
      label: 'সর্বনিম্ন কত টাকা উইথড্র করা যায় ও চার্জ কত?',
      query: 'সর্বনিম্ন উইথড্র লিমিট কত টাকা এবং ক্যাশআউটে কোনো সার্ভিস চার্জ কাটা হয় কি না?',
    },

    // Rules & Modes
    {
      id: 'rules_1',
      category: 'rules',
      icon: Gamepad2,
      label: 'লুডো খেলার মূল নিয়ম ও গুটি বের হওয়ার শর্ত কি?',
      query: 'কিং লুডো খেলায় গুটি ঘর থেকে বের হতে কি ছক্কা (৬) ফেলতে হয় এবং পর পর ৩টি ছক্কার নিয়ম কি?',
      badge: 'রুলস',
    },
    {
      id: 'rules_2',
      category: 'rules',
      icon: Zap,
      label: 'কুইক মোড বনাম ক্লাসিক মোডের পার্থক্য কি?',
      query: 'কুইক মোড এবং ক্লাসিক মোডের মধ্যে খেলার নিয়ম ও জেতার শর্তের পার্থক্য কি?',
      badge: 'নতুন',
    },
    {
      id: 'rules_3',
      category: 'rules',
      icon: Coins,
      label: 'উইনিং প্রাইজ ও প্ল্যাটফর্ম কমিশন কিভাবে হিসাব হয়?',
      query: 'ম্যাচ জেতার পর বিজয়ী পুরস্কার ও প্ল্যাটফর্মের কমিশন ফি কিভাবে কাটা হয়?',
    },
    {
      id: 'rules_4',
      category: 'rules',
      icon: HelpCircle,
      label: 'প্রতিপক্ষ চাল না দিলে বা ডিসকানেক্ট হলে কি হবে?',
      query: 'ম্যাচ চলাকালীন প্রতিপক্ষ চাল না দিলে বা টাইমার শেষ হয়ে ডিসকানেক্ট হলে কি নিয়ম কার্যকর হবে?',
    },

    // Bonus & Wheel
    {
      id: 'bonus_1',
      category: 'bonus',
      icon: Gift,
      label: 'রেফার করে প্রতি রেফারে ৳৫০ বোনাস কিভাবে নিব?',
      query: 'বন্ধুদের ইনভাইট করে রেফারেল বোনাস এবং কমিশন পাওয়ার নিয়মাবলী কি?',
      badge: 'বোনাস',
    },
    {
      id: 'bonus_2',
      category: 'bonus',
      icon: Sparkles,
      label: 'লাকি স্পিনার হুইল ঘুরিয়ে রিওয়ার্ড পাওয়ার উপায়',
      query: 'দৈনিক ফ্রি লাকি স্পিনার হুইল কিভাবে ঘুরাব এবং সর্বোচ্চ কত টাকা জেতা সম্ভব?',
    },

    // Account & Helpline
    {
      id: 'acc_1',
      category: 'account',
      icon: Phone,
      label: 'অফিসিয়াল হোয়াটসঅ্যাপ হেল্পলাইন নাম্বার দিন',
      query: 'কিং লুডোর সরাসরি অফিশিয়াল হোয়াটসঅ্যাপ এবং টেলিগ্রাম কাস্টমার সাপোর্ট নাম্বার দিন।',
      badge: 'সাপোর্ট',
    },
    {
      id: 'acc_2',
      category: 'account',
      icon: Shield,
      label: 'পাসওয়ার্ড ভুলে গেছি বা একাউন্ট রিকভারি',
      query: 'আমার একাউন্টের পাসওয়ার্ড মনে নেই বা প্রোফাইল তথ্যে সমস্যা হচ্ছে, কিভাবে সমাধান করব?',
    },
    {
      id: 'acc_3',
      category: 'account',
      icon: CheckCircle2,
      label: 'আইডি ভেরিফিকেশন ও নিরাপত্তা সহায়তার নিয়ম',
      query: 'কিং লুডো প্রোফাইল ভেরিফিকেশন ও নিরাপদ ট্রানজেকশনের জন্য কী কী তথ্য প্রয়োজন?',
    },
  ];

  // Quick topics for the top fast-scrolling pill bar
  const quickTopics = [
    { label: '💰 ডিপোজিট নির্দেশিকা', query: 'আমার ডিপোজিট করতে সাহায্য প্রয়োজন। বিকাশ ও নগদ নাম্বার দিন।' },
    { label: '💸 উইথড্র সময় ও আপডেট', query: 'আমার উইথড্র রিকোয়েস্টের বর্তমান আপডেট ও প্রসেসিং সময় জানতে চাই।' },
    { label: '⚡ কুইক মোড রুলস', query: 'কুইক মোড ও ক্লাসিক মোডের মধ্যে লুডো খেলার নিয়মের পার্থক্য কি?' },
    { label: '🎁 ৳৫০ রেফার বোনাস', query: 'বন্ধুদের ইনভাইট করে প্রতি রেফারে ৳৫০ ক্যাশ বোনাস কিভাবে নিব?' },
    { label: '🎲 ছক্কা ও গুটি কাটার নিয়ম', query: 'লুডো খেলায় গুটি বের হতে কি ৬ পড়তে হবে এবং পর পর ৩টি ছক্কার নিয়ম কি?' },
    { label: '💳 লেনদেন সীমা ও লিমিট', query: 'সর্বনিম্ন ডিপোজিট ও সর্বনিম্ন উইথড্র কত টাকা?' },
    { label: '🎡 লাকি স্পিনার রিওয়ার্ড', query: 'প্রতিদিন ফ্রি স্পিনার হুইল ঘুরিয়ে কিভাবে রিওয়ার্ড পাব?' },
    { label: '⏱️ ডিসকানেক্ট ও টাইমার', query: 'প্রতিপক্ষ চাল না দিলে বা ডিসকানেক্ট হলে কি নিয়ম প্রযোজ্য?' },
    { label: '🏆 প্রাইজ ও প্ল্যাটফর্ম ফি', query: 'উইনিং প্রাইজ ও প্ল্যাটফর্ম কমিশন ফি কিভাবে হিসাব করা হয়?' },
    { label: '📞 হোয়াটসঅ্যাপ হেল্পলাইন', query: 'কিং লুডোর সরাসরি অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইন নম্বর দিন।' },
    { label: '🖼️ ছবি/লোগো ভেরিফিকেশন', query: 'আমি পেমেন্ট স্লিপ বা লোগো ছবি পাঠিয়েছি, অনুগ্রহ করে চেক করুন।' },
    { label: '🔐 পাসওয়ার্ড রিকভারি', query: 'আমার একাউন্টের পাসওয়ার্ড পরিবর্তন বা রিকভার করতে চাই।' },
  ];

  // Filtered Quick Chat List for Drawer
  const filteredChatItems = allQuickChatItems.filter((item) => {
    const matchesCategory = chatListCategory === 'all' || item.category === chatListCategory;
    const matchesSearch =
      !chatSearchQuery.trim() ||
      item.label.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      item.query.toLowerCase().includes(chatSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredStarterQuestions = [
    allQuickChatItems[0], // deposit how
    allQuickChatItems[4], // withdraw how
    allQuickChatItems[7], // rules ludo
    allQuickChatItems[11], // refer bonus
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির সাইজ ৫ মেগাবাইটের (5MB) নিচে হতে হবে!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setSelectedImageName(file.name);
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be reselected if needed
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageName(null);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text && !selectedImage) return;

    if (onSendMessage) {
      onSendMessage(text, selectedImage || undefined, selectedImageName || undefined);
    }

    if (textToSend === undefined) {
      setInputText('');
    }
    setSelectedImage(null);
    setSelectedImageName(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full text-white flex flex-col overflow-hidden animate-in fade-in duration-200 select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.92), rgba(6,51,20,0.95), rgba(3,24,9,0.98)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Application Bar */}
      <div className="bg-[#063314]/95 px-3 sm:px-4 py-2.5 border-b border-emerald-500/40 flex items-center justify-between shrink-0 shadow-md z-30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-500/40 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="হোম পেজে ফিরুন"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরুন</span>
          </button>
          
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-slate-950 shadow-inner">
              <UserRound className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#063314] rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-xs sm:text-sm text-white">লাইভ কাস্টমার সাপোর্ট</h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                অনলাইন
              </span>
            </div>
            <p className="text-[10px] text-amber-300 font-medium hidden xs:block">যেকোনো প্রশ্ন লিখুন • সাথে সাথে উত্তর পাবেন</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center border border-white/20 transition cursor-pointer"
            title="চ্যাট বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col overflow-hidden relative">

        {/* Quick Topic Chips */}
        <div className="bg-[#080f2d] px-3 py-2 border-b border-blue-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setShowChatListModal(true)}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[10px] font-black border border-amber-300 flex items-center gap-1 shrink-0 whitespace-nowrap shadow transition active:scale-95"
            title="সব চ্যাট তালিকা দেখুন"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>সব চ্যাট তালিকা ({allQuickChatItems.length})</span>
          </button>

          <span className="text-[10px] font-black text-amber-300 shrink-0 uppercase tracking-wider pl-1">টপিক:</span>
          {quickTopics.map((topic, i) => (
            <button
              key={`quick-topic-${i}-${topic.label}`}
              type="button"
              onClick={() => handleSend(topic.query)}
              className="px-2.5 py-1 rounded-full bg-blue-900/60 hover:bg-amber-400 hover:text-slate-950 text-blue-100 text-[10px] font-bold border border-blue-500/30 whitespace-nowrap transition active:scale-95"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-gradient-to-b from-[#091130] to-[#0b1437]">
          {displayMessages.map((msg, mIdx) => {
            const isUser = msg.senderRole === 'user';
            const isAgent = !isUser;
            return (
              <React.Fragment key={`chat-frag-${msg.id || mIdx}-${mIdx}`}>
              <div
                key={`chat-msg-${msg.id || mIdx}-${mIdx}`}
                className={`flex gap-2 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 border border-amber-200 text-xs shadow mt-1">
                    <UserRound className="w-4 h-4 text-slate-950 font-black" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md space-y-2 ${
                    isAgent
                      ? 'bg-[#12235c] text-slate-100 border border-blue-500/40 rounded-tl-none'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none shadow-amber-950/40'
                  }`}
                >
                  {/* Sender Role Banner if Admin */}
                  {isAgent && (
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-1 text-[10px]">
                      <span className="font-extrabold text-amber-300 flex items-center gap-1">
                        <Bot className="w-3 h-3 text-amber-400" />
                        <span>অফিশিয়াল এডমিন / সাপোর্ট</span>
                      </span>
                    </div>
                  )}

                  {/* Attached Image / Logo if present */}
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-black/20 bg-black/40 relative group">
                      <img
                        src={msg.imageUrl}
                        alt="Chat Attachment"
                        className="w-full max-h-52 object-contain bg-black/60 cursor-pointer rounded-lg hover:opacity-95 transition"
                        onClick={() => setPreviewZoomImage(msg.imageUrl || null)}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewZoomImage(msg.imageUrl || null)}
                        className="absolute bottom-1.5 right-1.5 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm"
                        title="বড় করে দেখুন"
                      >
                        <Maximize2 className="w-3 h-3 text-amber-300" />
                        <span>জুম</span>
                      </button>
                    </div>
                  )}

                  {/* Text Message */}
                  {msg.text && (
                    <p className="whitespace-pre-line text-xs font-medium">{cleanChatText(msg.text)}</p>
                  )}

                  {/* Timestamp & Read Status */}
                  <div
                    className={`flex items-center gap-1 justify-end pt-0.5 text-[9px] ${
                      isAgent ? 'text-blue-300/70' : 'text-slate-900/80 font-bold'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-slate-950" />}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 border border-indigo-400 text-xs shadow mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Starter Popular Chat List inside chat if user hasn't sent anything yet */}
              {userThreadMessages.length === 0 && mIdx === 0 && (
                <div key="starter-quick-chats" className="bg-[#0f1a45]/90 border border-amber-400/35 rounded-2xl p-3 shadow-lg space-y-2.5 my-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
                    <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>জনপ্রিয় প্রশ্ন তালিকা (ট্যাপ করলেই উত্তর পাবেন):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowChatListModal(true)}
                      className="text-[10px] text-amber-300 hover:text-white font-extrabold flex items-center gap-0.5 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-400/30 transition active:scale-95"
                    >
                      <span>সব ({allQuickChatItems.length})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featuredStarterQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSend(q.query)}
                        className="text-left p-2.5 rounded-xl bg-blue-950/80 hover:bg-amber-400 hover:text-slate-950 border border-blue-500/40 group transition active:scale-[0.98] flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="p-1.5 rounded-lg bg-blue-900/80 group-hover:bg-amber-300 text-amber-300 group-hover:text-slate-950 shrink-0 shadow-inner">
                            <q.icon className="w-3.5 h-3.5" />
                          </span>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-black text-slate-100 group-hover:text-slate-950 truncate">
                              {q.label}
                            </p>
                            {q.badge && (
                              <span className="inline-block text-[8px] font-bold text-amber-300 group-hover:text-slate-950">
                                • {q.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-400 group-hover:text-slate-950 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </React.Fragment>
            );
          })}

          {/* Animated Agent Typing Indicator */}
          {isAgentTyping && (
            <div className="flex items-start gap-2 animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 border border-amber-200 text-xs shadow mt-1">
                <UserRound className="w-4 h-4 text-slate-950 font-black" />
              </div>
              <div className="bg-[#12235c] text-slate-100 border border-blue-500/40 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-md flex items-center gap-2">
                <span className="text-[11px] text-amber-300 font-bold">সাপোর্ট এজেন্ট লিখছেন</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image Preview Box before Sending */}
        {selectedImage && (
          <div className="bg-[#121c45] p-2.5 border-t border-amber-400/40 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 bg-black/50">
                <img
                  src={selectedImage}
                  alt="Selected Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{selectedImageName || 'ছবি / লোগো সংযুক্ত'}</p>
                <p className="text-[10px] text-amber-300">পাঠানোর জন্য প্রস্তুত</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shrink-0 shadow"
              title="ছবিটি মুছুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar with Image / Logo Upload Attachment */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 bg-[#080f2d] border-t border-amber-400/30 flex items-center gap-2 shrink-0"
        >
          {/* Hidden File Input for Photos / Logos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Photo / Logo Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-emerald-950/90 hover:bg-emerald-800 border border-amber-400/60 text-amber-300 hover:text-white transition shrink-0 flex items-center gap-1 shadow"
            title="ছবি বা লোগো আপলোড করুন (Upload Photo / Logo)"
          >
            <ImageIcon className="w-4.5 h-4.5" />
          </button>

          {/* Quick Chat List Button */}
          <button
            type="button"
            onClick={() => setShowChatListModal((prev) => !prev)}
            className={`p-2.5 rounded-2xl border transition shrink-0 flex items-center gap-1 shadow ${
              showChatListModal
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-emerald-950/90 hover:bg-amber-400/20 text-amber-300 border-amber-400/60'
            }`}
            title="সব চ্যাট তালিকা ও প্রশ্নসমূহ (Quick Chat List)"
          >
            <MessageSquarePlus className="w-4.5 h-4.5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={selectedImage ? 'ছবির সাথে ক্যাপশন লিখুন (ঐচ্ছিক)...' : 'আপনার প্রশ্ন বা মেসেজ লিখুন...'}
            className="flex-1 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:border-amber-400 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !selectedImage}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shrink-0 flex items-center justify-center"
            title="মেসেজ পাঠান"
          >
            <Send className="w-4 h-4 text-slate-950 fill-slate-950" />
          </button>
        </form>

        {/* Quick Chat List Full Drawer / Overlay */}
        {showChatListModal && (
          <div className="absolute inset-0 z-30 bg-[#070d28]/95 backdrop-blur-md flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Drawer Header */}
            <div className="p-3.5 bg-gradient-to-r from-[#0d1f5c] to-[#0b1437] border-b border-amber-400/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                  <MessageSquarePlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>জনপ্রিয় চ্যাট তালিকা</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                      {allQuickChatItems.length}টি প্রশ্ন
                    </span>
                  </h4>
                  <p className="text-[10px] text-amber-300/80">যেকোনো প্রশ্নে চাপ দিন, স্বয়ংক্রিয় উত্তর পেয়ে যাবেন</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowChatListModal(false)}
                className="p-1.5 rounded-xl bg-blue-950 hover:bg-rose-600 text-slate-200 hover:text-white border border-blue-500/40 transition active:scale-95"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-2.5 bg-[#091130] border-b border-blue-900/40 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  placeholder="প্রশ্ন বা কি-ওয়ার্ড খুঁজুন (যেমন: ডিপোজিট, উইথড্র, রুলস)..."
                  className="w-full bg-blue-950/90 border border-blue-500/50 rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-blue-300/50 focus:outline-none focus:border-amber-400"
                />
                <HelpCircle className="w-4 h-4 text-amber-400 absolute left-2.5 pointer-events-none" />
                {chatSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setChatSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="px-2.5 py-2 bg-[#060b24] border-b border-blue-900/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'all', name: 'সব প্রশ্ন' },
                { id: 'deposit', name: '💰 ডিপোজিট' },
                { id: 'withdraw', name: '💸 উইথড্র' },
                { id: 'rules', name: '🎲 গেম রুলস' },
                { id: 'bonus', name: '🎁 বোনাস' },
                { id: 'account', name: '📞 হেল্পলাইন' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setChatListCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold whitespace-nowrap transition active:scale-95 ${
                    chatListCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow-md border border-amber-300'
                      : 'bg-blue-950/70 text-blue-200 hover:bg-blue-900 border border-blue-600/30'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Scrollable Questions List */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {filteredChatItems.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-slate-300">কোনো ম্যাচিং প্রশ্ন খুঁজে পাওয়া যায়নি।</p>
                  <p className="text-[11px] text-amber-400 font-bold">নিচের বক্সে সরাসরি আপনার প্রশ্নটি লিখুন।</p>
                </div>
              ) : (
                filteredChatItems.map((item) => (
                  <button
                    key={`drawer-item-${item.id}`}
                    type="button"
                    onClick={() => {
                      handleSend(item.query);
                      setShowChatListModal(false);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-[#0d1a45] to-[#10235a] hover:from-amber-400 hover:to-amber-500 border border-blue-500/30 hover:border-amber-300 group transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-2.5 shadow"
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-xl bg-blue-900/80 group-hover:bg-slate-950 text-amber-300 group-hover:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-black text-white group-hover:text-slate-950 leading-snug">
                            {item.label}
                          </p>
                          {item.badge && (
                            <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-amber-400/20 group-hover:bg-slate-950 group-hover:text-amber-300 text-amber-300 border border-amber-400/40">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-blue-200/70 group-hover:text-slate-900 font-medium line-clamp-1">
                          {item.query}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      <span className="text-[10px] font-black text-amber-300 group-hover:text-slate-950 hidden sm:inline-block">
                        পাঠান
                      </span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-slate-950" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Bottom Dismiss Bar */}
            <div className="p-2.5 bg-[#080f2d] border-t border-amber-400/20 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowChatListModal(false)}
                className="w-full py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-xs text-blue-200 font-bold border border-blue-500/30 transition"
              >
                চ্যাট স্ক্রিনে ফিরে যান
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Zoom Modal for Images */}
      {previewZoomImage && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg flex items-center justify-between pb-3 text-white">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>ছবি/লোগো প্রিভিউ (Full View)</span>
            </span>
            <button
              type="button"
              onClick={() => setPreviewZoomImage(null)}
              className="p-2 bg-slate-800 hover:bg-rose-600 rounded-full text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-w-lg max-h-[80vh] overflow-auto rounded-2xl border-2 border-amber-400/80 bg-black flex items-center justify-center">
            <img
              src={previewZoomImage}
              alt="Zoomed"
              className="max-w-full max-h-[78vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
