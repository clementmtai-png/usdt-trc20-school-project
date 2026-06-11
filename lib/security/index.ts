/**
 * Verify wallet signature
 */
export async function verifySignature(data: {
  sourceWallet: string;
  destinationWallet: string;
  amount: number;
  signature: string;
}): Promise<boolean> {
  // This would verify the signature against the source wallet
  // Implementation depends on your signing mechanism
  return true; // Placeholder
}

/**
 * Sign transaction data
 */
export async function signData(data: any, wallet: string): Promise<string> {
  try {
    if ((window as any).tronLink) {
      const tronWeb = (window as any).tronLink.tronWeb;
      const signature = await tronWeb.trx.sign(data);
      return signature;
    }
    throw new Error('No wallet provider found');
  } catch (error) {
    console.error('Error signing data:', error);
    throw error;
  }
}
