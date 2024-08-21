"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { getBalance, sendTransaction } from "../utils/sol";

type account = { keypair: Keypair; publicKey: string; privateKey: string };

export default function Home() {
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [seed, setSeed] = useState<Buffer>();
  const [currInd, setcurrInd] = useState<number>(0);
  const [balances, setBalances] = useState<any>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [receiverAddress, setReceiverAddress] = useState<{
    [key: string]: string;
  }>({});
  const [receiverAmount, setReceiverAmount] = useState<{
    [key: string]: number;
  }>({});

  const fetchBalance = async (publicKey: string) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [publicKey]: true,
    }));

    const balance = await getBalance(publicKey);
    setBalances((prevBalances: any) => ({
      ...prevBalances,
      [publicKey]: balance,
    }));

    setLoading((prevLoading) => ({
      ...prevLoading,
      [publicKey]: false,
    }));
  };

  const generateAccountKeys = () => {
    const path = `m/44'/501'/${currInd + 1}'/0'`;
    const derivedSeed = derivePath(path, seed!.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const mykeyPair = Keypair.fromSecretKey(secret);
    setAccounts([
      ...accounts,
      {
        keypair: mykeyPair,
        publicKey: Keypair.fromSecretKey(secret).publicKey.toBase58(),
        privateKey: Keypair.fromSecretKey(secret).secretKey.toString(),
      },
    ]);
    setcurrInd(currInd + 1);
    console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
  };
  const generateKeys = () => {
    // Replace this with actual key generation logic
    const mnemonic = generateMnemonic();
    console.log("Generated Mnemonic:", mnemonic);
    const seed = mnemonicToSeedSync(mnemonic);
    setSeed(seed);
    console.log("Generated Seed:", seed.toString("hex"));
    const generatedSeedWords = mnemonic.split(" ");

    const generatedAccounts = Array.from({ length: 5 }, (_, index) => ({
      publicKey: `GeneratedPublicKey${index + 1}`,
    }));

    setSeedWords(generatedSeedWords);
    setcurrInd(0);
    setAccounts([]);
  };
  // Code for send Transaction
  const handleSendTransaction = async (
    account: account,
    recieverPublicKey: string,
    amountTobeSent: number
  ) => {
    if (
      (await getBalance(account.publicKey)) < receiverAmount[amountTobeSent]
    ) {
      alert("Insufficient balance.");
      return;
    }
    const address = receiverAddress[account.publicKey];
    const amount = receiverAmount[account.publicKey];

    if (!address || !amount) {
      alert("Please enter both receiver address and amount.");
      return;
    }

    try {
      await sendTransaction(account, address, amount);
      alert("Transaction successful!");
      await fetchBalance(account.publicKey); // Update balance after sending
    } catch (error: any) {
      alert("Transaction failed: " + error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-500 dark:via-pink-600 dark:to-red-600 drop-shadow-lg">
        CryptonicWallet
      </h1>
      <button
        onClick={generateKeys}
        className="mt-8 mb-4 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
      >
        Generate Seed Words
      </button>
      {seedWords.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Seed Words</h2>
          <div className="grid grid-cols-2 gap-4">
            {seedWords.map((word, index) => (
              <span
                key={index}
                className="bg-gray-800 text-white p-2 rounded-lg"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Accounts</h2>
      <button
        onClick={generateAccountKeys}
        className="mt-8 mb-8 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
      >
        Generate Wallet Accounts
      </button>
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account, index) => (
          <div key={index} className="bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Account {index + 1}</h3>
            <p className="break-all">
              <strong>Public Key:</strong> {account.publicKey}
            </p>
            <br></br>
            <div>
              <strong>Balance: </strong>
              {loading[account.publicKey]
                ? "Loading..."
                : balances[account.publicKey] !== undefined
                ? `${balances[account.publicKey]} SOL`
                : "0 SOL"}
            </div>
            <button
              className="mt-2 m-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              onClick={() =>
                window.open("https://faucet.solana.com/", "_blank")
              }
            >
              Get Faucet
            </button>
            <button
              onClick={async () => await fetchBalance(account.publicKey)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              disabled={loading[account.publicKey]}
            >
              {loading[account.publicKey] ? "Loading..." : "Fetch Balance"}
            </button>
            <p className="text-sm text-gray-400 mt-2">
              It will take a few seconds ( upto 30sec ) to reflect the updated
              amount.
            </p>
            <div className="mt-4 p-5">
              <input
                type="text"
                placeholder="Receiver Address"
                value={receiverAddress[account.publicKey] || ""}
                onChange={(e) =>
                  setReceiverAddress((prev) => ({
                    ...prev,
                    [account.publicKey]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 mb-2 text-black rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount in Sol"
                value={receiverAmount[account.publicKey] || ""}
                onChange={(e) =>
                  setReceiverAmount((prev) => ({
                    ...prev,
                    [account.publicKey]: parseFloat(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 mb-2 text-black rounded-lg"
              />
              <button
                onClick={() =>
                  handleSendTransaction(
                    account,
                    receiverAddress[account.publicKey],
                    receiverAmount[account.publicKey]
                  )
                }
                className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                Send
              </button>
              <p className="text-sm text-gray-400 mt-2">
                It will take a few seconds ( upto 30sec ) to confirm the
                Transaction. Please wait.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]"></div>
    </main>
  );
}
