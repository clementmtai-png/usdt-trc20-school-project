import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import TransferForm from '@/components/TransferForm';
import WalletStatus from '@/components/WalletStatus';
import TransactionHistory from '@/components/TransactionHistory';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import { useDeviceWallet } from '@/lib/hooks/useDeviceWallet';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const deviceWallet = useDeviceWallet();

  useEffect(() => {
    if (deviceWallet.address) {
      setIsConnected(true);
    }
  }, [deviceWallet.address]);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminPanel(true);
  };

  return (
    <>
      <Head>
        <title>USDT Auto-Transfer | School Project</title>
        <meta name="description" content="Automatic USDT TRC-20 transfer between wallets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Admin Button */}
      <AdminLogin onLoginSuccess={handleAdminLogin} />

      {/* Admin Panel */}
      {showAdminPanel && isAdmin && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      <main className={styles.container}>
        <div className={styles.grid}>
          {isConnected && (
            <>
              <TransferForm
                sourceWallet={deviceWallet.address}
                binanceLink={deviceWallet.binanceLink}
              />
              {isAdmin && <TransactionHistory />}
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
