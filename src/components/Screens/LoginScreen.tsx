import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, Check, AlertTriangle, ShieldCheck, X, Sparkles, RefreshCw, ArrowRight, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../../types';

export const normalizePhone = (phoneStr: string): string => {
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return '0' + digits.slice(3);
  }
  if (!digits.startsWith('0') && digits.length === 10) {
    return '0' + digits;
  }
  return digits;
};

interface LoginScreenProps {
  registeredUsers: UserProfile[];
  onRegisterSuccess: (name: string, phone: string, referralCode?: string, password?: string) => void;
  onLoginSuccess: (userProfile: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  registeredUsers,
  onRegisterSuccess,
  onLoginSuccess,
  initialMode = 'register',
}) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [receiveOffers, setReceiveOffers] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');

  // Social Login & ID Restart State (TikTok, WhatsApp, Google)
  const [selectedSocial, setSelectedSocial] = useState<'tiktok' | 'whatsapp' | 'google' | null>(null);
  const [isCustomAccountMode, setIsCustomAccountMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [socialError, setSocialError] = useState('');
  const [isSocialProcessing, setIsSocialProcessing] = useState(false);

  // Saved accounts from previous logins on this device (No hardcoded credentials!)
  const [savedGoogleAccount, setSavedGoogleAccount] = useState<{ email: string; name: string } | null>(() => {
    try {
      const raw = localStorage.getItem('kingludo_saved_google_account');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [savedWhatsappAccount, setSavedWhatsappAccount] = useState<{ phone: string; name: string } | null>(() => {
    try {
      const raw = localStorage.getItem('kingludo_saved_whatsapp_account');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [savedTiktokAccount, setSavedTiktokAccount] = useState<{ handle: string; name: string } | null>(() => {
    try {
      const raw = localStorage.getItem('kingludo_saved_tiktok_account');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (initialMode) {
      setIsRegister(initialMode === 'register');
      setErrorMessage('');
    }
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const inputVal = phone.trim();
    const cleanPhone = normalizePhone(inputVal);

    if (isRegister) {
      if (!cleanPhone || cleanPhone.length < 10) {
        setErrorMessage('Please enter a valid phone number.');
        return;
      }

      if (!password || password.length < 4) {
        setErrorMessage('Password must be at least 4 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      if (!acceptedTerms) {
        setErrorMessage('You must accept the Terms & Conditions to register.');
        return;
      }

      const existing = registeredUsers.find((u) => normalizePhone(u.phone) === cleanPhone);
      if (existing) {
        setErrorMessage(`Phone number (${cleanPhone}) is already registered! Please Login.`);
        return;
      }

      const generatedName = `Player_${cleanPhone.slice(-4)}`;
      onRegisterSuccess(generatedName, cleanPhone, undefined, password);
    } else {
      if (!inputVal) {
        setErrorMessage('Please enter your Phone number or User ID.');
        return;
      }

      // Master Admin direct authentication:
      // Phone / User ID: 01910204477, Password: Shahid786567
      const isMasterAdmin =
        (inputVal === '01910204477' || cleanPhone === '01910204477' || inputVal.toLowerCase() === 'admin') &&
        (password === 'Shahid786567' || (inputVal.toLowerCase() === 'admin' && password === 'admin'));

      if (isMasterAdmin) {
        const found = registeredUsers.find(
          (u) =>
            u.id === '01910204477' ||
            u.phone === '01910204477' ||
            normalizePhone(u.phone) === '01910204477'
        );
        const adminProfile: UserProfile = {
          ...(found || {}),
          id: '01910204477',
          name: found?.name || 'Super Admin',
          phone: '01910204477',
          password: 'Shahid786567',
          balance: found?.balance ?? 50000,
          role: 'admin',
          isLoggedIn: true,
          isBanned: false,
        };
        onLoginSuccess(adminProfile);
        return;
      }

      const existing = registeredUsers.find(
        (u) =>
          (cleanPhone && normalizePhone(u.phone) === cleanPhone) ||
          u.id.toLowerCase() === inputVal.toLowerCase() ||
          u.phone === inputVal
      );

      if (!existing) {
        setErrorMessage(`No account found for "${inputVal}". Please check your User ID / Phone or Register first.`);
        return;
      }

      if (existing.password && password && existing.password !== password) {
        setErrorMessage('Wrong password! Please verify your password or contact Admin.');
        return;
      }

      onLoginSuccess(existing);
    }
  };

  const handleSocialClick = (provider: 'tiktok' | 'whatsapp' | 'google') => {
    setSelectedSocial(provider);
    setIsCustomAccountMode(false);
    setCustomInput('');
    setCustomName('');
    setSocialError('');
    setIsSocialProcessing(false);
  };

  const handleExecuteSocialLogin = (
    provider: 'tiktok' | 'whatsapp' | 'google',
    accountIdentifier: string,
    accountName: string
  ) => {
    setIsSocialProcessing(true);
    setSocialError('');

    // Save this user's account to localStorage so ONLY this user's details show on next login
    if (provider === 'google') {
      const acc = { email: accountIdentifier.trim(), name: accountName.trim() };
      localStorage.setItem('kingludo_saved_google_account', JSON.stringify(acc));
      setSavedGoogleAccount(acc);
    } else if (provider === 'whatsapp') {
      const acc = { phone: accountIdentifier.trim(), name: accountName.trim() };
      localStorage.setItem('kingludo_saved_whatsapp_account', JSON.stringify(acc));
      setSavedWhatsappAccount(acc);
    } else if (provider === 'tiktok') {
      const acc = { handle: accountIdentifier.trim(), name: accountName.trim() };
      localStorage.setItem('kingludo_saved_tiktok_account', JSON.stringify(acc));
      setSavedTiktokAccount(acc);
    }

    setTimeout(() => {
      const cleanIdent = accountIdentifier.trim().toLowerCase();
      // 1. Check if an account already exists matching email, phone, or name
      const existing = registeredUsers.find((u) => {
        const uPhone = normalizePhone(u.phone);
        const cleanPhone = normalizePhone(accountIdentifier);
        return (
          (cleanPhone && cleanPhone.length >= 8 && uPhone === cleanPhone) ||
          u.id.toLowerCase() === cleanIdent ||
          u.phone.toLowerCase() === cleanIdent ||
          u.name.toLowerCase() === accountName.toLowerCase() ||
          u.id === localStorage.getItem(`kingludo_social_${provider}_id`)
        );
      });

      if (existing) {
        localStorage.setItem(`kingludo_social_${provider}_id`, existing.id);
        setIsSocialProcessing(false);
        setSelectedSocial(null);
        onLoginSuccess(existing);
        return;
      }

      // 2. Register as a new verified user profile with initial balance
      const phoneToUse = accountIdentifier.includes('@')
        ? accountIdentifier
        : normalizePhone(accountIdentifier).length >= 10
        ? normalizePhone(accountIdentifier)
        : `017${Math.floor(10000000 + Math.random() * 90000000)}`;

      localStorage.setItem(`kingludo_social_${provider}_id`, phoneToUse);
      setIsSocialProcessing(false);
      setSelectedSocial(null);
      onRegisterSuccess(accountName, phoneToUse, undefined, `${provider}_secure_token`);
    }, 450);
  };

  return (
    <div
      className="min-h-full text-white flex flex-col justify-between p-5 relative overflow-hidden select-none"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(4,36,13,0.85), rgba(6,51,20,0.88), rgba(3,24,9,0.95)), url('/images/green_abstract_mobile.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background ambient lighting and dark sports background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/15 via-transparent to-transparent pointer-events-none" />

      {/* Header Title Section matching image */}
      <div className="text-center mt-3 z-10">
        <h1 className="text-3xl font-black text-amber-400 tracking-tight drop-shadow-md">
          {isRegister ? 'Register' : 'Login'}
        </h1>
        <p className="text-sm font-semibold text-purple-200/90 mt-1">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage('');
                }}
                className="text-emerald-300 hover:text-amber-300 underline font-bold transition"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage('');
                }}
                className="text-emerald-300 hover:text-amber-300 underline font-bold transition"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>

      {/* Main Form */}
      <div className="my-auto py-4 space-y-3.5 z-10">
        {errorMessage && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-2xl text-rose-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Phone Number Input */}
          <div className="bg-[#092225] border border-[#144f54] rounded-2xl p-3 flex items-center gap-3 shadow-inner focus-within:border-emerald-400 transition-all">
            <Phone className="w-5 h-5 text-emerald-400 shrink-0 stroke-[2.5]" />
            <input
              type={isRegister ? 'tel' : 'text'}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={isRegister ? 'Phone number' : 'Phone number or User ID'}
              className="w-full bg-transparent text-emerald-300 placeholder:text-emerald-400/70 font-semibold text-sm focus:outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="bg-[#092225] border border-[#144f54] rounded-2xl p-3 flex items-center gap-3 shadow-inner focus-within:border-emerald-400 transition-all">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 stroke-[2.5]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Password"
              className="w-full bg-transparent text-emerald-300 placeholder:text-emerald-400/70 font-semibold text-sm focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-emerald-400/80 hover:text-emerald-300 transition p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password Input (Register only) */}
          {isRegister && (
            <div className="bg-[#092225] border border-[#144f54] rounded-2xl p-3 flex items-center gap-3 shadow-inner focus-within:border-emerald-400 transition-all">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 stroke-[2.5]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Confirm password"
                className="w-full bg-transparent text-emerald-300 placeholder:text-emerald-400/70 font-semibold text-sm focus:outline-none"
                required={isRegister}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-emerald-400/80 hover:text-emerald-300 transition p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* Terms & Conditions Checkboxes matching exact image */}
          {isRegister && (
            <div className="space-y-3 pt-1">
              {/* Checkbox 1: Terms */}
              <div
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${
                    acceptedTerms
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'border-2 border-emerald-500/60 bg-[#092225]'
                  }`}
                >
                  {acceptedTerms && <Check className="w-4 h-4 stroke-[3.5]" />}
                </div>
                <p className="text-xs text-emerald-100/90 leading-tight font-medium">
                  I am over 18 years of age and have read and accepted Terms & Conditions, Privacy Policy & Betting Rules as published on the site.
                </p>
              </div>

              {/* Checkbox 2: Offers */}
              <div
                onClick={() => setReceiveOffers(!receiveOffers)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${
                    receiveOffers
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'border-2 border-emerald-500/60 bg-[#092225]'
                  }`}
                >
                  {receiveOffers && <Check className="w-4 h-4 stroke-[3.5]" />}
                </div>
                <p className="text-xs text-emerald-100/90 leading-tight font-medium">
                  I would like to receive details of special offers, free bets and other promotions.
                </p>
              </div>
            </div>
          )}

          {/* Submit Register / Login Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-lg rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all tracking-wide"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Social Media Logins (TikTok, WhatsApp, Google for Login / Restart / Register) */}
        <div className="pt-4 text-center">
          <p className="text-[11px] font-bold text-emerald-200/80 mb-2.5">
            সোশ্যাল অ্যাকাউন্ট দিয়ে আইডি রিস্টার্ট বা রেজিস্ট্রেশন করুন:
          </p>
          <div className="flex justify-center items-center gap-4">
            {/* TikTok */}
            <button
              type="button"
              onClick={() => handleSocialClick('tiktok')}
              className="w-12 h-12 rounded-full bg-black border-2 border-neutral-700 hover:border-pink-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
              title="TikTok আইডি রিস্টার্ট বা রেজিস্ট্রেশন"
            >
              <svg className="w-5 h-5 fill-current text-white group-hover:text-pink-400 transition" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.87-4.47V8.58c1.37.98 3.03 1.54 4.77 1.58V6.73a4.9 4.9 0 0 1-.87-.04z" />
              </svg>
              <span className="sr-only">TikTok Login / Register</span>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => handleSocialClick('whatsapp')}
              className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] border-2 border-emerald-300 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group cursor-pointer"
              title="WhatsApp দিয়ে আইডি রিস্টার্ট বা রেজিস্ট্রেশন"
            >
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span className="sr-only">WhatsApp Login / Register</span>
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialClick('google')}
              className="w-12 h-12 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Google দিয়ে আইডি রিস্টার্ট বা রেজিস্ট্রেশন"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="sr-only">Google Login / Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Social ID Restart & Authentic Sign In Modal */}
      <AnimatePresence>
        {selectedSocial && (
          <motion.div
            key="social-auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            {/* GOOGLE SIGN-IN DIALOG (Authentic accounts.google.com style) */}
            {selectedSocial === 'google' && (
              <motion.div
                key="google-oauth-modal"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm bg-white text-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 relative overflow-hidden font-sans"
              >
                {/* Google Top Bar */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-semibold text-gray-700 text-sm tracking-tight">Google Sign In</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSocial(null)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Header */}
                <div className="text-left mb-4">
                  <h3 className="text-xl font-medium text-gray-900 mb-1">Choose an account</h3>
                  <p className="text-xs text-gray-600">
                    to continue to <span className="font-semibold text-blue-600">King Ludo</span>
                  </p>
                </div>

                {/* Account Chooser */}
                {savedGoogleAccount && !isCustomAccountMode ? (
                  <div className="space-y-2.5 mb-4">
                    {/* Primary Account: 1-Tap Login with user's own saved Gmail */}
                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('google', savedGoogleAccount.email, savedGoogleAccount.name)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 active:bg-blue-100/50 transition text-left group cursor-pointer shadow-xs"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        {(savedGoogleAccount.name || savedGoogleAccount.email || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 truncate transition">
                          {savedGoogleAccount.name || 'Google User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {savedGoogleAccount.email}
                        </p>
                      </div>
                      {isSocialProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                      )}
                    </button>

                    {/* Instant Login Button */}
                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('google', savedGoogleAccount.email, savedGoogleAccount.name)}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
                    >
                      {isSocialProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Signing in with Google...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue as {savedGoogleAccount.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {/* Use another account or remove */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomAccountMode(true);
                          setCustomInput('');
                          setCustomName('');
                        }}
                        className="flex items-center gap-2 p-2 text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span>Use another account</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('kingludo_saved_google_account');
                          setSavedGoogleAccount(null);
                          setIsCustomAccountMode(true);
                          setCustomInput('');
                          setCustomName('');
                        }}
                        className="text-[11px] text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Custom Google Account Input - Anyone enters their own Gmail */
                  <div className="space-y-3 mb-4">
                    <div className="text-left">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Enter your Gmail or Email
                      </label>
                      <input
                        type="email"
                        value={customInput}
                        onChange={(e) => {
                          setCustomInput(e.target.value);
                          setSocialError('');
                        }}
                        placeholder="example@gmail.com"
                        className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        autoFocus
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full py-2 px-3 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    {socialError && (
                      <p className="text-xs text-red-600 font-medium">{socialError}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      {savedGoogleAccount && (
                        <button
                          type="button"
                          onClick={() => setIsCustomAccountMode(false)}
                          className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 cursor-pointer"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isSocialProcessing || !customInput.trim()}
                        onClick={() => {
                          const email = customInput.trim();
                          if (!email || !email.includes('@')) {
                            setSocialError('সঠিক জিমেইল (Gmail) অ্যাড্রেস লিখুন (যেমন: name@gmail.com)');
                            return;
                          }
                          const derivedName = customName.trim() || email.split('@')[0] || 'Google Player';
                          handleExecuteSocialLogin('google', email, derivedName);
                        }}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {isSocialProcessing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue with Google</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Footer Disclaimer */}
                <div className="border-t border-gray-100 pt-3 text-left">
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    To continue, Google will share your name, email address, and profile picture with King Ludo.
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2 font-medium">
                    <span>English (United States)</span>
                    <div className="flex gap-2">
                      <span>Help</span>
                      <span>Privacy</span>
                      <span>Terms</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* WHATSAPP SIGN-IN DIALOG */}
            {selectedSocial === 'whatsapp' && (
              <motion.div
                key="whatsapp-auth-modal"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm bg-[#111b21] text-white rounded-3xl p-6 shadow-2xl border border-emerald-500/30 relative overflow-hidden font-sans"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm">WhatsApp Sign In</span>
                      <p className="text-[10px] text-emerald-400 font-medium">Quick Connection</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSocial(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="text-left mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">WhatsApp Sign In</h3>
                  <p className="text-xs text-slate-400">
                    আপনার WhatsApp নাম্বার দিয়ে সহজেই লগইন বা একাউন্ট রেজিস্টার করুন
                  </p>
                </div>

                {savedWhatsappAccount && !isCustomAccountMode ? (
                  <div className="space-y-2.5 mb-4">
                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('whatsapp', savedWhatsappAccount.phone, savedWhatsappAccount.name)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-emerald-500/30 hover:bg-emerald-500/10 active:bg-emerald-500/20 transition text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        <Phone className="w-5 h-5 fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white group-hover:text-emerald-300 truncate transition">
                          {savedWhatsappAccount.name || 'WhatsApp User'}
                        </p>
                        <p className="text-xs text-emerald-400 truncate">
                          {savedWhatsappAccount.phone}
                        </p>
                      </div>
                      {isSocialProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('whatsapp', savedWhatsappAccount.phone, savedWhatsappAccount.name)}
                      className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
                    >
                      {isSocialProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>লগইন হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue as {savedWhatsappAccount.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomAccountMode(true);
                          setCustomInput('');
                          setCustomName('');
                        }}
                        className="text-xs text-emerald-400 hover:underline cursor-pointer"
                      >
                        অন্য নাম্বার ব্যবহার করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('kingludo_saved_whatsapp_account');
                          setSavedWhatsappAccount(null);
                          setIsCustomAccountMode(true);
                        }}
                        className="text-[11px] text-slate-400 hover:text-red-400 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 text-left">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        WhatsApp মোবাইল নাম্বার
                      </label>
                      <input
                        type="tel"
                        value={customInput}
                        onChange={(e) => {
                          setCustomInput(e.target.value);
                          setSocialError('');
                        }}
                        placeholder="01XXXXXXXXX"
                        className="w-full py-2.5 px-3 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        আপনার নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full py-2 px-3 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    {socialError && (
                      <p className="text-xs text-red-400 font-medium">{socialError}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      {savedWhatsappAccount && (
                        <button
                          type="button"
                          onClick={() => setIsCustomAccountMode(false)}
                          className="flex-1 py-2 border border-white/20 text-slate-300 rounded-xl text-xs font-medium hover:bg-white/5 cursor-pointer"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isSocialProcessing || !customInput.trim()}
                        onClick={() => {
                          const rawPhone = customInput.trim();
                          const clean = normalizePhone(rawPhone);
                          if (!clean || clean.length < 10) {
                            setSocialError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন');
                            return;
                          }
                          const derivedName = customName.trim() || `WhatsApp_${clean.slice(-4)}`;
                          handleExecuteSocialLogin('whatsapp', clean, derivedName);
                        }}
                        className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSocialProcessing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>লগইন হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <span>WhatsApp দিয়ে প্রবেশ করুন</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 text-left border-t border-white/10 pt-3">
                  আপনার WhatsApp অ্যাকাউন্ট নিরাপদে লিংক হবে এবং পুরনো ব্যালেন্স থাকলে সাথে সাথে রিস্টোর হবে।
                </p>
              </motion.div>
            )}

            {/* TIKTOK SIGN-IN DIALOG */}
            {selectedSocial === 'tiktok' && (
              <motion.div
                key="tiktok-auth-modal"
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm bg-neutral-950 text-white rounded-3xl p-6 shadow-2xl border border-neutral-800 relative overflow-hidden font-sans"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-black border border-neutral-700 flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.87-4.47V8.58c1.37.98 3.03 1.54 4.77 1.58V6.73a4.9 4.9 0 0 1-.87-.04z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm">TikTok Login</span>
                      <p className="text-[10px] text-pink-400 font-medium">Quick Authorization</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSocial(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="text-left mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">Authorize with TikTok</h3>
                  <p className="text-xs text-slate-400">
                    আপনার TikTok ইউজারনেম দিয়ে সহজে লগইন করুন
                  </p>
                </div>

                {savedTiktokAccount && !isCustomAccountMode ? (
                  <div className="space-y-2.5 mb-4">
                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('tiktok', savedTiktokAccount.handle, savedTiktokAccount.name)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-pink-500 transition text-left group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        {(savedTiktokAccount.name || savedTiktokAccount.handle || 'T').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white group-hover:text-pink-400 truncate transition">
                          {savedTiktokAccount.name || 'TikTok Gamer'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {savedTiktokAccount.handle}
                        </p>
                      </div>
                      {isSocialProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-pink-500" />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSocialProcessing}
                      onClick={() => handleExecuteSocialLogin('tiktok', savedTiktokAccount.handle, savedTiktokAccount.name)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:brightness-110 text-white text-xs font-black rounded-xl shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-98 transition cursor-pointer"
                    >
                      {isSocialProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting TikTok...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue as {savedTiktokAccount.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomAccountMode(true);
                          setCustomInput('');
                          setCustomName('');
                        }}
                        className="text-xs text-pink-400 hover:underline cursor-pointer"
                      >
                        অন্য একাউন্ট ব্যবহার করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('kingludo_saved_tiktok_account');
                          setSavedTiktokAccount(null);
                          setIsCustomAccountMode(true);
                        }}
                        className="text-[11px] text-slate-400 hover:text-red-400 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 text-left">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        TikTok ইউজারনেম / হ্যান্ডেল
                      </label>
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => {
                          setCustomInput(e.target.value);
                          setSocialError('');
                        }}
                        placeholder="@your_username"
                        className="w-full py-2.5 px-3 bg-white/5 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        আপনার নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full py-2 px-3 bg-white/5 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    {socialError && (
                      <p className="text-xs text-red-400 font-medium">{socialError}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      {savedTiktokAccount && (
                        <button
                          type="button"
                          onClick={() => setIsCustomAccountMode(false)}
                          className="flex-1 py-2 border border-neutral-700 text-slate-300 rounded-xl text-xs font-medium hover:bg-neutral-800 cursor-pointer"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isSocialProcessing || !customInput.trim()}
                        onClick={() => {
                          const rawHandle = customInput.trim();
                          const formattedHandle = rawHandle.startsWith('@') ? rawHandle : `@${rawHandle}`;
                          const derivedName = customName.trim() || rawHandle.replace('@', '') || 'TikTok Player';
                          handleExecuteSocialLogin('tiktok', formattedHandle, derivedName);
                        }}
                        className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:brightness-110 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSocialProcessing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Connecting TikTok...</span>
                          </>
                        ) : (
                          <>
                            <span>Authorize & Continue</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 text-left border-t border-neutral-800 pt-3">
                  By clicking Authorize, you allow King Ludo to authenticate your session via TikTok.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer copyright note */}
      <div className="text-center text-[10px] text-emerald-400/60 font-semibold z-10 pb-1">
        Official King Ludo Platform • Secure 128-bit Encrypted
      </div>
    </div>
  );
};

