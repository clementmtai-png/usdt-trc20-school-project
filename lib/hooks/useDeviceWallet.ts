import { useState, useEffect } from 'react';
import { getDeviceId } from '../utils/device';
import { detectWallet } from '../utils/wallet';

export function useDeviceWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    network: null as string | null,
    balance: null as string | null,
    deviceId: null as string | null,
  });

  useEffect(() => {
    const initWallet = async () => {
      try {
        // Get device ID
        const deviceId = getDeviceId();

        // Detect wallet from browser
        const walletInfo = await detectWallet();

        setWallet({
          address: walletInfo.address,
          network: walletInfo.network,
          balance: walletInfo.balance,
          deviceId,
        });
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initWallet();
  }, []);

  return wallet;
}
