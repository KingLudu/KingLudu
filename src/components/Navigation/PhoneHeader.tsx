import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface PhoneHeaderProps {
  dark?: boolean;
}

export const PhoneHeader: React.FC<PhoneHeaderProps> = ({ dark = true }) => {
  return (
    <div className={`flex justify-between items-center px-5 pt-3 pb-2 select-none text-xs ${dark ? 'text-white' : 'text-slate-800'}`}>
      <span className="font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
};
