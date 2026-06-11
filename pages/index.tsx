import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import TransferForm from '@/components/TransferForm';
import WalletStatus from '@/components/WalletStatus';
import TransactionHistory from '@/components/TransactionHistory';
import { useDeviceWallet } from '@/lib/hooks/useDeviceWallet';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const deviceWallet = useDeviceWallet();

  useEffect(() => {
    if (deviceWallet.address) {
      setIsConnected(true);
    }
  }, [deviceWallet.address]);

  return (
    <>
      <Head>
        <title>USDT Auto-Transfer | School Project</title>
        <meta name="description" content="Automatic USDT TRC-20 transfer between wallets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>💎 USDT Auto-Transfer</h1>
          <p>Device-Based Automated TRC-20 Transfer System</p>
        </div>
        
        <div className={styles.grid}>
          <WalletStatus wallet={deviceWallet} />
          
          {isConnected && (
            <>
              <TransferForm sourceWallet={deviceWallet.address} />
              <TransactionHistory />
            </>
          )}
          
          {!isConnected && (
            <div className={styles.alert}>
              <p>⚠️ Please connect your wallet to get started</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
