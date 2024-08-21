// {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "getBalance",
//     "params": [
//       "88aR7Ab2LayWCQVK5JnEj4GxjqZ8U3SEXCYyacCtX2jr"
//     ]
//   }

const {
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
} = require("@solana/web3.js");

import axios from "axios";

export async function getBalance(publicKey: string): Promise<number> {
  const response = await axios.post(
    "https://solana-devnet.g.alchemy.com/v2/RumGArhyM_L2Jgy9WF95-c-FZgFJSVwA",
    {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey],
    }
  );
  return response.data.result.value / 1e9;
}
var tmp = getBalance("88aR7Ab2LayWCQVK5JnEj4GxjqZ8U3SEXCYyacCtX2jr");
console.log(tmp);

import { Keypair, PublicKey } from "@solana/web3.js";

type account = { keypair: Keypair; publicKey: string; privateKey: string };

export async function sendTransaction(
  account: account,
  toPublicKey: string,
  amount: number
): Promise<void> {
  const fromPublickey = new PublicKey(account.publicKey);
  const toPublickey = new PublicKey(toPublicKey);

  console.log(fromPublickey);
  console.log(toPublickey);

  let transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromPublickey,
      toPubkey: toPublicKey,
      lamports: amount * 1e9,
    })
  );
  console.log(account.keypair);
  console.log(account.keypair.secretKey);
  console.log(account.keypair.publicKey);
  console.log(toPublicKey);
  console.log(amount);
  let connection = new Connection(clusterApiUrl("devnet"));
  try {
    await sendAndConfirmTransaction(connection, transaction, [account.keypair]);
  } catch (e) {
    console.log(e);
  }

  console.log("Transaction sent");
  console.log(transaction.signatures.toString());
  console.log(transaction);
}
