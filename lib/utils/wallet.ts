import TronWeb from 'tronweb';

let tronWeb: typeof TronWeb | null = null;

/**
 * Detect and initialize wallet based on available providers
 */
export async function detectWallet(): Promise<{
  address: string | null;
  network: string | null;
  balance: string | null;
}> {
  try {
    // Check for Tron Link (TRON wallet)
    if ((window as any).tronLink) {
      return initializeTronLink();
    }

    // Check for MetaMask
    if ((window as any).ethereum) {
      return initializeMetaMask();
    }

    return {
      address: null,
      network: null,
      balance: null,
    };
  } catch (error) {
    console.error('Error detecting wallet:', error);
    return {
      address: null,
      network: null,
      balance: null,
    };
  }
}

/**
 * Initialize Tron Link wallet
 */
async function initializeTronLink(): Promise<{
  address: string | null;
  network: string | null;
  balance: string | null;
}> {
  try {
    const tronLink = (window as any).tronLink;

    if (!tronLink.ready) {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (tronLink.ready) {
            clearInterval(interval);
            resolve(true);
          }
        }, 100);
        setTimeout(() => clearInterval(interval), 10000);
      });
    }

    const address = tronLink.tronWeb.defaultAddress.base58;
    const network = await getNetworkInfo(tronLink.tronWeb);
    const balance = await getUSDTBalance(tronLink.tronWeb, address);

    return {
      address,
      network,
      balance,
    };
  } catch (error) {
    console.error('Error initializing Tron Link:', error);
    return {
      address: null,
      network: null,
      balance: null,
    };
  }
}

/**
 * Initialize MetaMask wallet
 */
async function initializeMetaMask(): Promise<{
  address: string | null;
  network: string | null;
  balance: string | null;
}> {
  try {
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    return {
      address,
      network: `0x${chainId}`,
      balance: null, // Would need to fetch USDT balance
    };
  } catch (error) {
    console.error('Error initializing MetaMask:', error);
    return {
      address: null,
      network: null,
      balance: null,
    };
  }
}

/**
 * Get network information from TronWeb
 */
async function getNetworkInfo(tronWeb: typeof TronWeb): Promise<string> {
  try {
    // This would determine if on mainnet or testnet
    return 'TRON Mainnet'; // or 'TRON Testnet'
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Get USDT balance for an address
 */
export async function getUSDTBalance(
  tronWeb: typeof TronWeb,
  address: string
): Promise<string> {
  try {
    const usdtAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT on TRON
    const contract = await tronWeb.contract().at(usdtAddress);
    const balance = await contract.balanceOf(address).call();
    const decimals = await contract.decimals().call();

    // Convert to human-readable format
    const balanceNumber = balance.toNumber() / Math.pow(10, decimals.toNumber());
    return balanceNumber.toFixed(2);
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
    return '0.00';
  }
}

/**
 * Validate TRON address format
 */
export function isValidTronAddress(address: string): boolean {
  return /^T[1-9A-HJ-NP-Z]{33}$/.test(address);
}
