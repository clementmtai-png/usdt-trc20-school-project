import React, { useState } from 'react';
import styles from '@/styles/TransferForm.module.css';
import { createTransferConfig } from '@/lib/contract';
import { validateTransfer, calculateTransactionCost, formatUSDT } from '@/lib/utils/transfer';

interface TransferFormProps {
  sourceWallet: string | null;
  binanceLink?: string | null;
}

export default function TransferForm({ sourceWallet, binanceLink }: TransferFormProps) {
  const [destinationWallet, setDestinationWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setTransactionDetails(null);

    // Show transaction details as user types
    if (value && !isNaN(parseFloat(value))) {
      const numAmount = parseFloat(value);
      if (numAmount >= 50) {
        const details = calculateTransactionCost(numAmount);
        setTransactionDetails(details);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!sourceWallet) {
        throw new Error('Source wallet not detected. Please connect your wallet.');
      }

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

      const numAmount = parseFloat(amount);

      // Validate transfer amount and calculate costs
      const validation = validateTransfer(numAmount, '999999'); // Assuming sufficient balance
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const result = await createTransferConfig({
        sourceWallet,
        destinationWallet,
        amount: numAmount,
      });

      setSuccess(
        `Transfer config created! ID: ${result.configId}\n` +
        `Amount: ${formatUSDT(numAmount)}\n` +
        `Network Fee: ${formatUSDT(validation.details?.networkFee || 0)}\n` +
        `After Fee: ${formatUSDT(validation.details?.remainingBalance || 0)}`
      );
      setDestinationWallet('');
      setAmount('');
      setTransactionDetails(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBinanceClick = () => {
    if (binanceLink) {
      window.open(binanceLink, '_blank');
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
            value={sourceWallet || 'Not connected'}
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
          <label htmlFor="amount">Amount (USDT) - Minimum $50:</label>
          <input
            id="amount"
            type="number"
            placeholder="50.00 or more"
            value={amount}
            onChange={handleAmountChange}
            step="0.01"
            min="50"
            className={styles.input}
          />
        </div>

        {/* Transaction Details */}
        {transactionDetails && transactionDetails.isValid && (
          <div className={styles.transactionDetails}>
            <h4>Transaction Summary:</h4>
            <div className={styles.detailsRow}>
              <span>Transfer Amount:</span>
              <span className={styles.amount}>{formatUSDT(transactionDetails.amount)}</span>
            </div>
            <div className={styles.detailsRow}>
              <span>Network Fee:</span>
              <span className={styles.fee}>{formatUSDT(transactionDetails.networkFee)}</span>
            </div>
            <div className={styles.detailsRow + ' ' + styles.total}>
              <span>After Fee (Received):</span>
              <span className={styles.remaining}>{formatUSDT(transactionDetails.remainingBalance)}</span>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          type="submit"
          disabled={loading || !sourceWallet}
          className={styles.button}
        >
          {loading ? 'Processing...' : 'Create Transfer Config'}
        </button>
      </form>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleBinanceClick}
          className={styles.binanceButton}
          title="Open Binance USDT TRC20 Wallet"
        >
          🏦 Link Wallet
        </button>
      </div>

      <div className={styles.info}>
        <h3>💡 How it works:</h3>
        <ul>
          <li>Minimum transfer amount is $50</li>
          <li>Network fee is approximately $1 USDT</li>
          <li>Click "Link Wallet" to open your device's Binance wallet</li>
          <li>Enter your destination wallet address (where USDT will be sent)</li>
          <li>The remaining balance after fees will be transferred</li>
        </ul>
      </div>
    </div>
  );
}
