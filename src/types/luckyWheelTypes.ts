// Lucky Wheel System Types & Configuration Sync

export interface AdminLuckyWheelSlice {
  id: string;
  sliceNumber: number; // 1 to 8
  isActiveForWinner: boolean; // Active for Spin Winner
  showingFigure: string; // Showing Figure (৳) - displayed on wheel slice
  actualCreditedValue: string; // Actual Credited Value (৳) - credited to user wallet
}

export interface AdminLuckyWheelSettings {
  enableLuckyWheel: boolean; // Enable Lucky Wheel Game
  cooldownHours: number; // Spin Cooldown / Frequency (Hours)
  minDepositRequired: number; // Minimum Deposit Required (BDT ৳)
}

export const LUCKY_WHEEL_CONFIG_STORAGE_KEY = 'kingludo_admin_lucky_wheel_config';
export const LUCKY_WHEEL_UPDATED_EVENT = 'kingludo_lucky_wheel_updated';

// Default 8 slices exactly matching user's admin screenshot
export const DEFAULT_ADMIN_WHEEL_SLICES: AdminLuckyWheelSlice[] = [
  {
    id: 'slice_1',
    sliceNumber: 1,
    isActiveForWinner: true,
    showingFigure: '2.49',
    actualCreditedValue: '2.49',
  },
  {
    id: 'slice_2',
    sliceNumber: 2,
    isActiveForWinner: false,
    showingFigure: '49999',
    actualCreditedValue: '49999',
  },
  {
    id: 'slice_3',
    sliceNumber: 3,
    isActiveForWinner: true,
    showingFigure: '1.99',
    actualCreditedValue: '1.99',
  },
  {
    id: 'slice_4',
    sliceNumber: 4,
    isActiveForWinner: false,
    showingFigure: '999.99',
    actualCreditedValue: '4.99',
  },
  {
    id: 'slice_5',
    sliceNumber: 5,
    isActiveForWinner: true,
    showingFigure: '0.99',
    actualCreditedValue: '0.99',
  },
  {
    id: 'slice_6',
    sliceNumber: 6,
    isActiveForWinner: false,
    showingFigure: '499',
    actualCreditedValue: '499.99',
  },
  {
    id: 'slice_7',
    sliceNumber: 7,
    isActiveForWinner: true,
    showingFigure: '3.99',
    actualCreditedValue: '3.99',
  },
  {
    id: 'slice_8',
    sliceNumber: 8,
    isActiveForWinner: true,
    showingFigure: '9.99',
    actualCreditedValue: '9.99',
  },
];

export const DEFAULT_ADMIN_WHEEL_SETTINGS: AdminLuckyWheelSettings = {
  enableLuckyWheel: true,
  cooldownHours: 1,
  minDepositRequired: 0,
};

export interface LuckyWheelFullConfig {
  slices: AdminLuckyWheelSlice[];
  settings: AdminLuckyWheelSettings;
}

export function getStoredLuckyWheelConfig(): LuckyWheelFullConfig {
  if (typeof window === 'undefined') {
    return {
      slices: DEFAULT_ADMIN_WHEEL_SLICES,
      settings: DEFAULT_ADMIN_WHEEL_SETTINGS,
    };
  }

  try {
    const raw = localStorage.getItem(LUCKY_WHEEL_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.slices) && parsed.slices.length === 8 && parsed?.settings) {
        return {
          slices: parsed.slices,
          settings: {
            enableLuckyWheel: parsed.settings.enableLuckyWheel ?? DEFAULT_ADMIN_WHEEL_SETTINGS.enableLuckyWheel,
            cooldownHours: Number(parsed.settings.cooldownHours ?? DEFAULT_ADMIN_WHEEL_SETTINGS.cooldownHours),
            minDepositRequired: Number(parsed.settings.minDepositRequired ?? DEFAULT_ADMIN_WHEEL_SETTINGS.minDepositRequired),
          },
        };
      }
    }
  } catch (err) {
    console.error('Failed to load lucky wheel config:', err);
  }

  return {
    slices: DEFAULT_ADMIN_WHEEL_SLICES,
    settings: DEFAULT_ADMIN_WHEEL_SETTINGS,
  };
}

export function saveStoredLuckyWheelConfig(config: LuckyWheelFullConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(LUCKY_WHEEL_CONFIG_STORAGE_KEY, JSON.stringify(config));
    // Dispatch local broadcast event so modal/home screen updates in real time
    window.dispatchEvent(
      new CustomEvent(LUCKY_WHEEL_UPDATED_EVENT, { detail: config })
    );
  } catch (err) {
    console.error('Failed to save lucky wheel config:', err);
  }
}
