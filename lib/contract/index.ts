import axios from 'axios';

export interface TransferConfigParams {
  sourceWallet: string;
  destinationWallet: string;
  amount: number;
}

/**
 * Create a transfer configuration
 */
export async function createTransferConfig(
  params: TransferConfigParams
): Promise<{ configId: string; success: boolean }> {
  try {
    const response = await axios.post('/api/config/create', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create config');
    }
    throw error;
  }
}

/**
 * Update destination wallet
 */
export async function updateDestinationWallet(
  configId: string,
  newDestination: string
): Promise<{ success: boolean }> {
  try {
    const response = await axios.post('/api/config/update', {
      configId,
      newDestination,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to update config');
    }
    throw error;
  }
}

/**
 * Execute a transfer
 */
export async function executeTransfer(configId: string): Promise<{ success: boolean }> {
  try {
    const response = await axios.post('/api/transfer/execute', { configId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to execute transfer');
    }
    throw error;
  }
}
