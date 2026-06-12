/**
 * Transaction cost calculation for USDT TRC20
 * Network fee is approximately 1-10 USDT for TRC20 transfers
 */

const NETWORK_FEE_USDT = 1; // Approximate network fee in USDT
const MINIMUM_TRANSFER = 50; // Minimum transfer amount

export function calculateTransactionCost(amount: number): {
  isValid: boolean;
  error?: string;
  networkFee: number;
  totalAmount: number;
  remainingBalance: number;
} {
  // Check if amount is valid
  if (amount < MINIMUM_TRANSFER) {
    return {
      isValid: false,
      error: `Minimum transfer amount is $${MINIMUM_TRANSFER}. You entered $${amount}.`,
      networkFee: 0,
      totalAmount: amount,
      remainingBalance: 0,
    };
  }

  const networkFee = NETWORK_FEE_USDT;
  const totalAmount = amount + networkFee;
  const remainingBalance = amount - networkFee;

  return {
    isValid: true,
    networkFee,
    totalAmount,
    remainingBalance,
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
    networkFee: number;
    remainingBalance: number;
    totalRequired: number;
  };
} {
  const balanceNum = parseFloat(balance);

  // Check minimum amount
  if (amount < MINIMUM_TRANSFER) {
    return {
      isValid: false,
      error: `Minimum transfer amount is $${MINIMUM_TRANSFER}`,
    };
  }

  const { networkFee, totalAmount } = calculateTransactionCost(amount);

  // Check if sufficient balance
  if (balanceNum < totalAmount) {
    return {
      isValid: false,
      error: `Insufficient balance. Required: $${totalAmount.toFixed(2)} (including $${networkFee} fee), Available: $${balanceNum.toFixed(2)}`,
    };
  }

  return {
    isValid: true,
    details: {
      amount,
      networkFee,
      remainingBalance: amount - networkFee,
      totalRequired: totalAmount,
    },
  };
}

/**
 * Format USDT amount with proper decimals
 */
export function formatUSDT(amount: number): string {
  return `$${amount.toFixed(2)} USDT`;
}
