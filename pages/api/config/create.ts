import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@/lib/security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceWallet, destinationWallet, amount, signature } = req.body;

    // Verify signature
    const isValid = await verifySignature({
      sourceWallet,
      destinationWallet,
      amount,
      signature,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Here you would call the smart contract to create the config
    // For now, we'll return a mock response
    const configId = Buffer.from(
      `${sourceWallet}${destinationWallet}${amount}${Date.now()}`
    ).toString('hex');

    res.status(200).json({
      success: true,
      configId,
      message: 'Transfer config created successfully',
    });
  } catch (error) {
    console.error('Error creating config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
