/**
 * Transaction calculation for USDT TRC20
 * Transfer 98% of available balance
 */

import { getAdminSettings } from '@/components/AdminPanel';

export function calculateTransactionCost(amount: number): {
  isValid: boolean;
  error?: string;
  transferAmount: number;
  totalToTransfer: number;
} {
  const settings = getAdminSettings();
  const minimumTransfer = settings.minimumTransfer;

  // Check if amount is valid
  if (amount < minimumTransfer) {
    return {
      isValid: false,
      error: `Minimum transfer amount is $${minimumTransfer.toFixed(2)}. You entered $${amount.toFixed(2)}.`,
      transferAmount: 0,
      totalToTransfer: amount,
    };
  }

  // Transfer 98% of the amount
  const transferAmount = amount * 0.98;

  return {
    isValid: true,
    transferAmount,
    totalToTransfer: amount,
  };
}

/**
 * Validate transfer with balance check
 */
export function validateTransfer(
  amount: number,
  balance: string
): {
  isValid: boolean;
  error?: string;
  details?: {
    amount: number;
    transferAmount: number;
    deducted: number;
  };
} {
  const settings = getAdminSettings();
  const minimumTransfer = settings.minimumTransfer;
  const balanceNum = parseFloat(balance);

  // Check minimum amount
  if (amount < minimumTransfer) {
    return {
      isValid: false,
      error: `Minimum transfer amount is $${minimumTransfer.toFixed(2)}`,
    };
  }

  // Check if sufficient balance
  if (balanceNum < amount) {
    return {
      isValid: false,
      error: `Insufficient balance. Required: $${amount.toFixed(2)}, Available: $${balanceNum.toFixed(2)}`,
    };
  }

  const { transferAmount } = calculateTransactionCost(amount);
  const deducted = amount - transferAmount;

  return {
    isValid: true,
    details: {
      amount,
      transferAmount,
      deducted,
    },
  };
}

/**
 * Format USDT amount with proper decimals
 */
export function formatUSDT(amount: number): string {
  return `$${amount.toFixed(2)} USDT`;
}
