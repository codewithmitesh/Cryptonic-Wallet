# CryptonicWallet

CryptonicWallet is a secure and user-friendly cryptocurrency wallet built with Next.js. It allows users to generate seed words, create multiple accounts, and manage their public and private keys. This project leverages the Solana blockchain and uses libraries like `@solana/web3.js`, `bip39`, and `tweetnacl` for key generation and management.

## Features

- **Seed Word Generation**: Generate a set of 12 seed words to securely back up your wallet.
- **Multiple Accounts**: Create multiple accounts using the generated seed words.
- **Public and Private Keys**: Generate and display public and private keys for each account.
- **Responsive Design**: A clean and responsive UI built with Tailwind CSS.

## Libraries Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **@solana/web3.js**: A JavaScript API for interacting with the Solana blockchain.
- **bip39**: A library for generating BIP39 mnemonic phrases (seed words).
- **tweetnacl**: A cryptographic library for key pair generation and signing.
- **ed25519-hd-key**: A library for deriving keys using the Ed25519 curve.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/cryptonicwallet.git
    cd cryptonicwallet
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Project Locally

1. **Start the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. **Open your browser** and navigate to `http://localhost:3000` to see the application in action.

## Project Structure

- **`pages/index.tsx`**: The main page component that handles seed word generation and account creation.
- **`components/AccountCard.tsx`**: A reusable component for displaying account information.
- **`styles`**: Contains global styles and Tailwind CSS configuration.

## How It Works

### Seed Word Generation

The seed words are generated using the `bip39` library. These words are used to derive a master seed, which is then used to generate multiple accounts.

### Account Creation

Using the master seed, multiple accounts are created by deriving keys using the `ed25519-hd-key` library. Each account has a unique public and private key pair, generated using the `tweetnacl` library.

### Example Code

Here's a simplified version of the key generation logic:

```typescript
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';

const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic);

const accounts = Array.from({ length: 5 }, (_, index) => {
  const path = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(path, seed.toString('hex')).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  const keypair = Keypair.fromSecretKey(secret);
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(secret).toString('hex'),
  };
});

```
## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Solana](https://solana.com/) for their amazing blockchain platform.
- [Next.js](https://nextjs.org/) for the powerful React framework.
- [bip39](https://github.com/bitcoinjs/bip39) for the mnemonic generation library.
- [tweetnacl](https://github.com/dchest/tweetnacl-js) for the cryptographic library.

---

Thanks and Happy coding! 🚀