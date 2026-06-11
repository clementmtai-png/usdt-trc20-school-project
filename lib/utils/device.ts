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
 * Generate a device fingerprint based on browser/device characteristics
 */
function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    new Date().getTime(),
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
  };
}
