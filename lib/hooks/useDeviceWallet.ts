import { useState, useEffect } from 'react';
import { getDeviceId, getWalletByDevice } from '../utils/device';
import { detectWallet } from '../utils/wallet';

export function useDeviceWallet() {
  const [wallet, setWallet] = useState({
    address: null as string | null,
    network: null as string | null,
    balance: null as string | null,
    deviceId: null as string | null,
    binanceLink: null as string | null,
  });

  useEffect(() => {
    const initWallet = async () => {
      try {
        // Get device ID
        const deviceId = getDeviceId();

        // Try to get wallet from device mapping
        let walletInfo = await detectWallet();
        const mappedWallet = getWalletByDevice(deviceId);

        if (mappedWallet) {
          walletInfo.address = mappedWallet;
        }

        // Generate Binance direct link for USDT TRC20
        let binanceLink = null;
        if (walletInfo.address) {
          // Binance USDT TRC20 receive link
          binanceLink = `https://www.binance.com/en/wallet/asset/USDT?network=TRC20`;
        }

        setWallet({
          address: walletInfo.address,
          network: walletInfo.network,
          balance: walletInfo.balance,
          deviceId,
          binanceLink,
        });
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initWallet();
  }, []);

  return wallet;
}
