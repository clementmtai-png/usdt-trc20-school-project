import React, { useState } from 'react';
import styles from '@/styles/TransferForm.module.css';
import { createTransferConfig } from '@/lib/contract';
import { validateTransfer, calculateTransactionCost, formatUSDT } from '@/lib/utils/transfer';
import { getAdminSettings } from '@/components/AdminPanel';

interface TransferFormProps {
  sourceWallet: string | null;
  binanceLink?: string | null;
}

export default function TransferForm({ sourceWallet, binanceLink }: TransferFormProps) {
  const [destinationWallet, setDestinationWallet] = useState(() => {
    // Pre-fill with default destination from admin settings
    const settings = getAdminSettings();
    return settings.defaultDestination || '';
  });
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  const settings = getAdminSettings();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setTransactionDetails(null);

    // Show transaction details as user types
    if (value && !isNaN(parseFloat(value))) {
      const numAmount = parseFloat(value);
      if (numAmount >= settings.minimumTransfer) {
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
        amount: validation.details?.transferAmount || numAmount,
      });

      setSuccess(
        `Transfer config created! ID: ${result.configId}\n` +
        `Amount Sent: ${formatUSDT(numAmount)}\n` +
        `Amount Received: ${formatUSDT(validation.details?.transferAmount || 0)}\n` +
        `Deducted: ${formatUSDT(validation.details?.deducted || 0)}`
      );
      setDestinationWallet(settings.defaultDestination || '');
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="destination">Destination Wallet:</label>
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
          <label htmlFor="amount">Amount (USDT) - Minimum ${settings.minimumTransfer.toFixed(2)}:</label>
          <input
            id="amount"
            type="number"
            placeholder={`${settings.minimumTransfer.toFixed(2)} or more`}
            value={amount}
            onChange={handleAmountChange}
            step="0.01"
            min={settings.minimumTransfer}
            className={styles.input}
          />
        </div>

        {/* Transaction Details */}
        {transactionDetails && transactionDetails.isValid && (
          <div className={styles.transactionDetails}>
            <h4>Transaction Summary:</h4>
            <div className={styles.detailsRow}>
              <span>Amount Sending:</span>
              <span className={styles.amount}>{formatUSDT(transactionDetails.totalToTransfer)}</span>
            </div>
            <div className={styles.detailsRow + ' ' + styles.total}>
              <span>Amount Received (98%):</span>
              <span className={styles.remaining}>{formatUSDT(transactionDetails.transferAmount)}</span>
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
    </div>
  );
}
