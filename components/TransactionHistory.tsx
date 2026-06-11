import React, { useEffect, useState } from 'react';
import styles from '@/styles/TransactionHistory.module.css';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockTransactions: Transaction[] = [
      {
        id: '0x123...',
        from: 'TYXc...',
        to: 'TKkG...',
        amount: '100.00',
        timestamp: Date.now() - 3600000,
        status: 'success',
      },
    ];
    
    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  if (loading) return <div className={styles.card}>Loading...</div>;

  return (
    <div className={styles.card}>
      <h2>📋 Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className={styles.empty}>No transactions yet</p>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td><code>{tx.id}</code></td>
                  <td><code>{tx.from}</code></td>
                  <td><code>{tx.to}</code></td>
                  <td>{tx.amount} USDT</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${styles[tx.status]}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
