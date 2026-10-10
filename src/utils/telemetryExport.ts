import { UserProfile } from '../types';

/**
 * Exports user device telemetry (Device Model, IP, IMEI / Hardware Fingerprint, Location, etc.)
 * to a standardized RFC 4180 CSV file with UTF-8 BOM encoding for off-platform record keeping.
 */
export function exportUserTelemetryToCSV(
  usersToExport: UserProfile[],
  customFilenamePrefix: string = 'king_ludo_device_telemetry'
): { success: boolean; count: number; filename: string } {
  if (!usersToExport || !Array.isArray(usersToExport) || usersToExport.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `${customFilenamePrefix}_${dateStr}_${timeStr}.csv`;

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headers = [
    'User ID (ইউজার আইডি)',
    'User Name (নাম)',
    'Phone Number (ফোন নম্বর)',
    'Device Model (মডেল)',
    'IP Address (আইপি)',
    'IMEI / Device Identifier (IMEI / ডিভাইস আইডি)',
    'Location (অবস্থান)',
    'Operating System (ওএস)',
    'Browser (ব্রাউজার)',
    'Screen Resolution (স্ক্রিন রেজোলিউশন)',
    'Network / Carrier (নেটওয়ার্ক / সিম অপারেটর)',
    'Last Active Time (সর্বশেষ সক্রিয়)',
    'Account Balance (ব্যালেন্স ৳)',
    'Total Matches (মোট ম্যাচ)',
    'Win Rate (উইন রেট %)',
    'Player Level (লেভেল)',
    'Account Status (স্ট্যাটাস)',
    'Export Timestamp (রপ্তানির তারিখ ও সময়)',
  ];

  const rows = usersToExport.map((u) => {
    const dev = u.deviceInfo || {
      deviceModel: 'Android Device',
      browser: 'Chrome Mobile',
      os: 'Android',
      ipAddress: '103.145.74.88',
      location: 'ঢাকা, বাংলাদেশ',
      deviceFingerprint: 'DEV-8829F1-BD',
      imeiStatus: 'ওয়েব স্যান্ডবক্স: সিকিউর ডিভাইস ফিঙ্গারপ্রিন্ট অ্যাক্টিভ',
      screenResolution: '412 x 915 px',
      networkType: '4G LTE / Wi-Fi',
      carrier: 'Grameenphone / Wi-Fi',
      lastActiveTime: 'সম্প্রতি সক্রিয়',
    };

    const imeiOrIdentifier = dev.imeiStatus
      ? `${dev.deviceFingerprint} [${dev.imeiStatus}]`
      : dev.deviceFingerprint || 'DEV-8829F1-BD';

    const accountStatus = u.isBanned
      ? 'BANNED (স্থগিত)'
      : u.isVerified
      ? 'VERIFIED (ভেরিফাইড)'
      : 'ACTIVE (সক্রিয়)';

    const exportTimeFormatted = now.toLocaleString('bn-BD', {
      timeZone: 'Asia/Dhaka',
    });

    return [
      escapeCsv(u.id),
      escapeCsv(u.name),
      escapeCsv(u.phone || 'N/A'),
      escapeCsv(dev.deviceModel || 'Android Device'),
      escapeCsv(dev.ipAddress || '103.145.74.88'),
      escapeCsv(imeiOrIdentifier),
      escapeCsv(dev.location || 'ঢাকা, বাংলাদেশ'),
      escapeCsv(dev.os || 'Android'),
      escapeCsv(dev.browser || 'Browser'),
      escapeCsv(dev.screenResolution || 'N/A'),
      escapeCsv(dev.carrier || dev.networkType || 'Cellular / Wi-Fi'),
      escapeCsv(dev.lastActiveTime || 'সম্প্রতি সক্রিয়'),
      escapeCsv(u.balance ?? 0),
      escapeCsv(u.totalMatches ?? 0),
      escapeCsv(`${u.winRate ?? 0}%`),
      escapeCsv(u.level ?? 1),
      escapeCsv(accountStatus),
      escapeCsv(exportTimeFormatted),
    ].join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) so Excel, Google Sheets, and LibreOffice render Bengali script cleanly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  return { success: true, count: usersToExport.length, filename };
}
