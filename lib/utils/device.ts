/**
 * Generate or retrieve device ID based on device fingerprint
 * This helps identify which device clicked the link
 */
export function getDeviceId(): string {
  const storageKey = 'device_id';
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    // Generate a unique device ID
    deviceId = generateDeviceFingerprint();
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}

/**
 * Map device to a specific wallet address
 * You can customize this mapping based on your needs
 */
const DEVICE_WALLET_MAP: { [key: string]: string } = {
  // Format: deviceId -> walletAddress
  // Example:
  // 'abc123def456': 'TYXc9...',
  // 'xyz789uvw012': 'TKkG3...',
};

/**
 * Get wallet address based on device ID
 * Falls back to wallet detection if no mapping exists
 */
export function getWalletByDevice(deviceId: string): string | null {
  const mappedWallet = DEVICE_WALLET_MAP[deviceId];
  if (mappedWallet) {
    return mappedWallet;
  }
  
  // Check localStorage for device-specific wallet
  const storedWallet = localStorage.getItem(`device_wallet_${deviceId}`);
  return storedWallet || null;
}

/**
 * Register a device to a wallet address
 */
export function registerDeviceWallet(deviceId: string, walletAddress: string): void {
  DEVICE_WALLET_MAP[deviceId] = walletAddress;
  localStorage.setItem(
    `device_wallet_${deviceId}`,
    walletAddress
  );
}

/**
 * Generate a device fingerprint based on browser/device characteristics
 */
function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
  ];

  const fingerprint = components.join('|');
  return hashString(fingerprint);
}

/**
 * Simple hash function for device fingerprint
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Get detailed device information
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
    platform: navigator.platform,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
  };
}

/**
 * Get device type (mobile, tablet, desktop)
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod/.test(userAgent)) {
    return 'mobile';
  } else if (/ipad|tablet/.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Check if it's the same device (useful for validating device-specific transfers)
 */
export function isSameDevice(deviceId: string): boolean {
  return getDeviceId() === deviceId;
}
