import React from 'react';
import styles from '@/styles/WalletStatus.module.css';

interface WalletStatusProps {
  wallet: {
    address: string | null;
    network: string | null;
    balance: string | null;
    deviceId: string | null;
  };
}

export default function WalletStatus({ wallet }: WalletStatusProps) {
  return (
    <div className={styles.card}>
      <h2>📱 Device Wallet Information</h2>
      
      <div className={styles.info}>
        <div className={styles.field}>
          <label>Source Wallet (Auto-Detected):</label>
          <code>{wallet.address || 'Not connected'}</code>
        </div>
        
        <div className={styles.field}>
          <label>Network:</label>
          <span>{wallet.network || 'Not detected'}</span>
        </div>
        
        <div className={styles.field}>
          <label>USDT Balance:</label>
          <span>{wallet.balance || '0.00'} USDT</span>
        </div>
        
        <div className={styles.field}>
          <label>Device ID:</label>
          <code>{wallet.deviceId || 'Unknown'}</code>
        </div>
      </div>
      
      <div className={styles.status}>
        {wallet.address ? (
          <span className={styles.connected}>✅ Connected</span>
        ) : (
          <span className={styles.disconnected}>❌ Disconnected</span>
        )}
      </div>
    </div>
  );
}
