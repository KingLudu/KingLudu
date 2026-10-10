import { initialUserProfile, initialTransactions, initialMatchHistory } from '../data/mockData';
import { UserProfile } from '../types';
import { getClientDeviceInfo } from './deviceTracker';

export const DATA_RESET_KEY = 'kingludo_master_reset_timestamp_20260918';

export const getCleanAdminUser = (): UserProfile => ({
  id: '01910204477',
  name: 'Super Admin',
  phone: '01910204477',
  password: 'Shahid786567',
  balance: 50000,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  referralCode: 'ADMIN77',
  totalWon: 25000,
  totalMatches: 50,
  winRate: 85,
  isLoggedIn: true,
  role: 'admin',
  deviceInfo: getClientDeviceInfo(),
});

/**
 * Completely purges all localStorage and sessionStorage keys for the application.
 */
export const clearAllApplicationStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear all localStorage items
    if (window.localStorage) {
      window.localStorage.clear();
    }
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }

  try {
    // 2. Clear all sessionStorage items
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  } catch (err) {
    console.error('Failed to clear sessionStorage:', err);
  }

  // Mark the reset timestamp so automatic one-time reset is satisfied
  try {
    localStorage.setItem(DATA_RESET_KEY, Date.now().toString());
  } catch (e) {
    console.error(e);
  }
};

/**
 * Checks if the one-time data reset was already executed for this browser session.
 * If not, purges all stored data and returns true.
 */
export const executeInitialDataPurgeIfNeeded = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const hasReset = localStorage.getItem(DATA_RESET_KEY);
    if (!hasReset) {
      console.log('Clearing all application data for fresh start...');
      clearAllApplicationStorage();
      return true;
    }
  } catch (e) {
    console.error('Data purge check failed:', e);
  }
  return false;
};
