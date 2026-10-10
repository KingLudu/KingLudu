import { RegionCode, PaymentMethod, UserProfile } from '../types';

/**
 * Determines whether the user/account is a Bangladeshi ID or connection.
 * Checked based on:
 * 1. Region selection is 'BN'
 * 2. Or user phone number starts with Bangladeshi country code / format (013, 014, 015, 016, 017, 018, 019, +880, 880)
 */
export function isBangladeshUser(region: string | RegionCode = 'BN', user?: UserProfile | null): boolean {
  if (region === 'BN') return true;

  if (user?.phone) {
    const clean = user.phone.replace(/\D/g, '');
    if (clean.startsWith('880') || (clean.startsWith('01') && clean.length === 11)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns available payment methods based on country/ID location:
 * - Bangladeshi ID/Region ('BN'): bKash, Nagad, Rocket, Upay (along with optional Binance/Crypto if configured)
 * - Outside Bangladesh (All other countries / regions): STRICTLY Binance Pay and Cryptocurrency only!
 */
export function getPaymentMethodsForRegion(
  region: string | RegionCode = 'BN',
  user?: UserProfile | null,
  appSettings?: {
    enableBkashDeposit?: boolean;
    enableNagadDeposit?: boolean;
    enableRocketDeposit?: boolean;
    enableUpayDeposit?: boolean;
    enableBkashWithdraw?: boolean;
    enableNagadWithdraw?: boolean;
    enableRocketWithdraw?: boolean;
    enableUpayWithdraw?: boolean;
    enableBinancePay?: boolean;
    enableCrypto?: boolean;
  },
  type: 'deposit' | 'withdraw' = 'deposit'
): PaymentMethod[] {
  const isBd = isBangladeshUser(region, user);

  // Outside Bangladesh: ONLY Binance Pay & Cryptocurrency
  if (!isBd) {
    const foreignMethods: PaymentMethod[] = [];
    if (appSettings?.enableBinancePay !== false) {
      foreignMethods.push('BinancePay');
    }
    if (appSettings?.enableCrypto !== false) {
      foreignMethods.push('Cryptocurrency');
    }
    // Fallback if both disabled: ensure at least BinancePay is available
    if (foreignMethods.length === 0) {
      foreignMethods.push('BinancePay', 'Cryptocurrency');
    }
    return foreignMethods;
  }

  // Inside Bangladesh: Standard Bangladeshi local MFS (bKash, Nagad, Rocket, Upay) + Binance/Crypto
  const localList: PaymentMethod[] = [];
  if (type === 'deposit') {
    if (appSettings?.enableBkashDeposit !== false) localList.push('bKash');
    if (appSettings?.enableNagadDeposit !== false) localList.push('Nagad');
    if (appSettings?.enableRocketDeposit !== false) localList.push('Rocket');
    if (appSettings?.enableUpayDeposit !== false) localList.push('Upay');
  } else {
    if (appSettings?.enableBkashWithdraw !== false) localList.push('bKash');
    if (appSettings?.enableNagadWithdraw !== false) localList.push('Nagad');
    if (appSettings?.enableRocketWithdraw !== false) localList.push('Rocket');
    if (appSettings?.enableUpayWithdraw !== false) localList.push('Upay');
  }

  if (localList.length === 0) {
    localList.push('bKash', 'Nagad', 'Rocket', 'Upay');
  }

  if (appSettings?.enableBinancePay !== false) {
    localList.push('BinancePay');
  }
  if (appSettings?.enableCrypto !== false) {
    localList.push('Cryptocurrency');
  }

  return localList;
}
