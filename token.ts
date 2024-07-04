import { getAssociatedTokenAddress } from "@solana/spl-token";
import { RPC_URL } from "./config";

const { getAccount, getMint } = require("@solana/spl-token");
const { Connection, PublicKey } = require("@solana/web3.js");

const SOLANA_CONNECTION = new Connection(RPC_URL);
const TOKEN_ADDRESS = new PublicKey(
  "Bwv8SbWgj4KDd4piN3RuMgiTdBYNYTbbMBJcRfmJTLxC"
);

async function getTokenBalanceWeb3(connection: any, tokenAccount: any) {
  const info = await connection.getTokenAccountBalance(tokenAccount);
  if (info.value.uiAmount == null) throw new Error("No balance found");
  console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
  return info.value.uiAmount;
}

getTokenBalanceWeb3(SOLANA_CONNECTION, TOKEN_ADDRESS).catch((err) =>
  console.log(err)
);

const getTokenAccount = async (mintAddress: string, address: string) => {
  const tokenAccount = await getAssociatedTokenAddress(
    new PublicKey(mintAddress),
    new PublicKey(address)
  );
  console.log("tokenAccount :>> ", tokenAccount.toBase58());
  return tokenAccount;
};

// getTokenAccount(
//   "8L4oFzS978NxjPhuaGuK2CYeSm12S9XmFFy4x5ihiYjD",
//   "8kFeCZ9Hx7oyYDBssoLKVwAxke9mXW4wt5HF7bFNQY4C"
// );
