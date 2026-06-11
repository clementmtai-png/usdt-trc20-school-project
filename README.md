# USDT TRC-20 Auto-Transfer Smart Contract

A school project for automatically transferring USDT (TRC-20) from one wallet to another with device detection and editable destination wallet.

## Features
- ✅ Smart Contract for automated USDT transfers
- ✅ Device-based source wallet detection
- ✅ Editable destination wallet address
- ✅ Vercel-deployable Next.js frontend
- ✅ Real-time transaction tracking
- ✅ Wallet integration (MetaMask, Tron Link)

## Tech Stack
- Solidity (Smart Contract)
- Next.js + React (Frontend)
- TronWeb (TRON blockchain interaction)
- Vercel (Deployment)

## Getting Started

### Prerequisites
- Node.js 16+
- Yarn or npm
- TRON wallet (MetaMask or Tron Link)

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Deployment

```bash
vercel
```

## Project Structure

```
.
├── contracts/          # Smart contracts
├── pages/              # Next.js pages
├── components/         # React components
├── lib/                # Utility functions
├── public/             # Static assets
└── .env.local          # Environment variables
```

## Smart Contract Deployment

Deploy on TRON testnet using TronBox:

```bash
cd contracts
tronbox migrate --network shasta
```

## License
MIT
