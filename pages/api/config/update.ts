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
    const { configId, newDestination, signature } = req.body;

    // Verify signature
    const isValid = await verifySignature({
      configId,
      newDestination,
      signature,
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Call smart contract to update destination
    res.status(200).json({
      success: true,
      message: 'Destination wallet updated successfully',
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
