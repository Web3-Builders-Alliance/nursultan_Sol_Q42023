import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from "@coral-xyz/anchor";
import { WbaVault, IDL } from "../programs/wba_vault";
import wallet from "./wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "finalized";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

// Create a random keypair
const vaultState = new PublicKey("<address>");

// Create the PDA for our enrollment account

const vaultAuthKeys = [Buffer.from("auth"), vaultState.toBuffer()];
const [vaultAuth, _bump] =
     PublicKey.findProgramAddressSync(
      vaultAuthKeys, program.programId);

// Create the vault key
// const vault = ???


const vault = [Buffer.from("vault"), vaultAuth.toBuffer()];
const [vaultKey, _bump2] =
     PublicKey.findProgramAddressSync(
      vaultAuthKeys, program.programId);


// Execute our enrollment transaction
(async () => {
  try {
    const signature = await program.methods
    .deposit(new BN(LAMPORTS_PER_SOL)    )
    .accounts({
      owner: keypair.publicKey,
      vault: vaultKey,
      vaultAuth: vaultAuth,
      vaultState:vaultState,
      systemProgram: SystemProgram.programId,
    })
    .signers([keypair]).rpc();
    console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
