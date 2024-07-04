import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  toBigNumber,
} from "@metaplex-foundation/js";
import {
  Metadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import secret from "./key.json";
import { RPC_URL } from "./config";

const SOLANA_CONNECTION = new Connection(RPC_URL);

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
const COLLECTION_ADDRESS = "pdw2LK3tHnGV2R67M8VXyKkBkHrBr6VKjG3C7jxjUK9";
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: RPC_URL,
      timeout: 60000,
    })
  );

const CONFIG = {
  imgName: "Teddies",
  symbol: "Teddies",
  sellerFeeBasisPoints: 500, //500 bp = 5%
  creators: [{ address: WALLET.publicKey, share: 100 },{ address: new PublicKey(COLLECTION_ADDRESS), share: 0 }],
  // metadata:
  // "https://ipfs.io/ipfs/QmNk2GSSqE9Mg5hNW4gScXkj6NzQWWWZkoKn8w5j5uY8JS",
  // metadata:
  //   "https://ipfs.io/ipfs/QmQLGGPvs7RaQ4s9AbJDcBXSXHPaKNoKgzAw7413jTWaMq",
  // metadata:
  //   "https://ipfs.io/ipfs/QmNoqUJto9BRjxxEsvSJf7MdGMEXzzNUqjGkwhzvs1xAFy",
  // metadata:
  //   "https://ipfs.io/ipfs/QmSZyADKHL4ajupeRaiPtkQNwoFZk4bZfbMsi1uEavdTwT",
  metadata:
    "https://bafybeigt6xlua244zc2pzjjzlk3zztmfgu6fkzkg75lbfndb2e44s2j3im.ipfs.nftstorage.link/729.json",
  // metadata: "https://bafybeigt6xlua244zc2pzjjzlk3zztmfgu6fkzkg75lbfndb2e44s2j3im.ipfs.nftstorage.link/6963.json",
  // metadata: "https://bafybeigt6xlua244zc2pzjjzlk3zztmfgu6fkzkg75lbfndb2e44s2j3im.ipfs.nftstorage.link/1932.json",
  // metadata: "https://bafybeigt6xlua244zc2pzjjzlk3zztmfgu6fkzkg75lbfndb2e44s2j3im.ipfs.nftstorage.link/2946.json",
  // metadata: "https://bafybeigt6xlua244zc2pzjjzlk3zztmfgu6fkzkg75lbfndb2e44s2j3im.ipfs.nftstorage.link/6607.json"
};

async function mintProgrammableNft(
  metadataUri: string,
  name: string,
  sellerFee: number,
  symbol: string,
  creators: { address: PublicKey; share: number }[]
) {
  try {
    console.log(`Minting pNFT`);
    const transactionBuilder = await METAPLEX.nfts().builders().create({
      uri: metadataUri,
      name: name,
      sellerFeeBasisPoints: sellerFee,
      symbol: symbol,
      creators: creators,
      isMutable: true,
      isCollection: false,
      collection: new PublicKey(COLLECTION_ADDRESS),
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      ruleSet: null,
    });

    let { signature, confirmResponse } =
      await METAPLEX.rpc().sendAndConfirmTransaction(transactionBuilder);
    if (confirmResponse.value.err) {
      throw new Error("failed to confirm transaction");
    }
    const { mintAddress } = transactionBuilder.getContext();
    console.log(`   Success!🎉`);
    console.log(
      `   Minted NFT: https://explorer.solana.com/address/${mintAddress.toString()}?cluster=devnet`
    );
    console.log(
      `   Tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );

    // const destination = new PublicKey(
    //   "EXL7KgA8361UF98vC5eSYRnus6JZjVrQP12kj5GsN3qm"
    // ); // replace with your friend's public key
    // const transferTransactionBuilder = await METAPLEX.nfts()
    //   .builders()
    //   .transfer({
    //     nftOrSft: {
    //       address: mintAddress,
    //       tokenStandard: TokenStandard.ProgrammableNonFungible,
    //     },
    //     authority: WALLET,
    //     fromOwner: WALLET.publicKey,
    //     toOwner: destination,
    //   });
    // // Name new variables since we already have a signature and confirmResponse
    // let { signature: sig2, confirmResponse: res2 } =
    //   await METAPLEX.rpc().sendAndConfirmTransaction(
    //     transferTransactionBuilder,
    //     {
    //       commitment: "finalized",
    //     }
    //   );
    // if (res2.value.err) {
    //   throw new Error("failed to confirm transfer transaction");
    // }
    // console.log(`   Tx: https://explorer.solana.com/tx/${sig2}?cluster=devnet`);
  } catch (err) {
    console.log(err);
  }
}

mintProgrammableNft(
  CONFIG.metadata,
  CONFIG.imgName,
  CONFIG.sellerFeeBasisPoints,
  CONFIG.symbol,
  CONFIG.creators
);

const getNFTs = async () => {
  console.log("This is nft getting function");
  const creator = new PublicKey("3ZQuEN9gE14TXxYnMvWq86RBvh6wTdvtSaM1hhdXb2xQ");
  const nfts = await METAPLEX.nfts().findAllByCreator({ creator });
  console.log("nfts :>> ", nfts);
};

// getNFTs();

const fetchNFTMetadata = async (uri: string): Promise<any> => {
  const metadataRes = await fetch(uri);
  if (!metadataRes.ok) {
    throw new Error("Failed to fetch metadata from URI");
  }
  return await metadataRes.json();
};

const getNFTMetadata = async (mintAddr: string) => {
  const mintAddress = new PublicKey(mintAddr);
  // METAPLEX;
  const nft: any = await METAPLEX.nfts().findByMint({ mintAddress });
  console.log("nft :>> ", nft);
  // const res = await fetch(
  //   `https://ipfs.io/ipfs/QmQLGGPvs7RaQ4s9AbJDcBXSXHPaKNoKgzAw7413jTWaMq`
  // );
  const metadata = await fetchNFTMetadata(nft.data.uri);
  console.log("metadata :>> ", metadata);
};

// getNFTMetadata("5NRAqKLYUg7KrVcStkXJVRKs8og93e1ea7v6Sv1Dsi7p");
