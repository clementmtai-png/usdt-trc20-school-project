import React, { useState } from 'react';
import styles from '@/styles/TransferForm.module.css';
import { createTransferConfig } from '@/lib/contract';

interface TransferFormProps {
  sourceWallet: string;
}

export default function TransferForm({ sourceWallet }: TransferFormProps) {
  const [destinationWallet, setDestinationWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!destinationWallet || !amount) {
        throw new Error('Please fill in all fields');
      }

      if (sourceWallet === destinationWallet) {
        throw new Error('Source and destination wallets must be different');
      }

      // Validate TRON address format
      if (!destinationWallet.startsWith('T') || destinationWallet.length !== 34) {
        throw new Error('Invalid TRON wallet address');
      }

      const result = await createTransferConfig({
        sourceWallet,
        destinationWallet,
        amount: parseFloat(amount),
      });

      setSuccess(`Transfer config created! ID: ${result.configId}`);
      setDestinationWallet('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>⚙️ Create Transfer Configuration</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="source">Source Wallet (Auto-Detected):</label>
          <input
            id="source"
            type="text"
            value={sourceWallet}
            disabled
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="destination">Destination Wallet (Editable):</label>
          <input
            id="destination"
            type="text"
            placeholder="Enter TRON wallet address (starts with T)"
            value={destinationWallet}
            onChange={(e) => setDestinationWallet(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="amount">Amount (USDT):</label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className={styles.input}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Creating...' : 'Create Transfer Config'}
        </button>
      </form>

      <div className={styles.info}>
        <h3>💡 How it works:</h3>
        <ul>
          <li>Source wallet is automatically detected from your device</li>
          <li>Enter your destination wallet address (where USDT will be sent)</li>
          <li>Specify the amount to transfer</li>
          <li>The configuration will be created on the smart contract</li>
        </ul>
      </div>
    </div>
  );
}
