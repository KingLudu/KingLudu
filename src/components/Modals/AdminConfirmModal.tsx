import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, RotateCcw, ShieldAlert, UserX, X, Check } from 'lucide-react';

export interface AdminConfirmModalConfig {
  isOpen: boolean;
  title: string;
  description: string;
  consequence?: string;
  badge?: string;
  targetDetail?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: 'trash' | 'alert' | 'reset' | 'user';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AdminConfirmModalProps {
  config: AdminConfirmModalConfig | null;
  onClose: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({ config, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && config?.isOpen) {
        if (config.onCancel) {
          config.onCancel();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, onClose]);

  if (!config || !config.isOpen) return null;

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    config.onConfirm();
    onClose();
  };

  const variant = config.variant || 'danger';
  const iconType = config.icon || (variant === 'warning' ? 'alert' : 'trash');

  const renderIcon = () => {
    const iconClass = 'w-6 h-6 sm:w-7 sm:h-7';
    switch (iconType) {
      case 'reset':
        return <RotateCcw className={iconClass} />;
      case 'user':
        return <UserX className={iconClass} />;
      case 'alert':
        return <AlertTriangle className={iconClass} />;
      case 'trash':
      default:
        return <Trash2 className={iconClass} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Dark Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0f0828] border-2 border-rose-500/60 rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header with Icon and Close Button */}
        <div className="flex items-start justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                variant === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-400/50 shadow-amber-500/10'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-rose-500/10'
              }`}
            >
              {renderIcon()}
            </div>
            <div>
              {config.badge && (
                <span
                  className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border mb-1 ${
                    variant === 'warning'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {config.badge}
                </span>
              )}
              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                {config.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-purple-300 hover:text-white transition active:scale-95 cursor-pointer shrink-0"
            title="বাতিল ও বন্ধ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Details Chip if provided */}
        {config.targetDetail && (
          <div className="p-2.5 rounded-xl bg-[#170e3a] border border-purple-700/50 flex items-center justify-between text-xs">
            <span className="text-purple-300 font-medium">লক্ষ্যবস্তু / রেকর্ড:</span>
            <span className="text-amber-300 font-mono font-bold">{config.targetDetail}</span>
          </div>
        )}

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {config.description}
        </p>

        {/* Consequence Warning Notice Box */}
        {config.consequence && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-rose-200 text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-tight text-[11px] sm:text-xs">
              <strong>সতর্কতা:</strong> {config.consequence}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 hover:text-white text-xs font-extrabold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{config.cancelText || 'বাতিল করুন'}</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
              variant === 'warning'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 border border-amber-300/60'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border border-rose-400/60 shadow-rose-900/30'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{config.confirmText || 'হ্যাঁ, নিশ্চিত করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
