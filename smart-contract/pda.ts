import { Connection, PublicKey } from '@solana/web3.js';

// Initialize Solana connection to devnet (you can change this to testnet or mainnet if needed)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// The program ID of your deployed contract (replace with your actual program ID)
const programId = new PublicKey('9qG92k2w13nXTrBcWfatknhrt5DeQNjAcUjwWDLpArF9'); // Replace with your program ID

// The seed used to derive the PDA (as in your Rust contract)
const seed = Buffer.from('fixed_amount'); // This is the same seed used in your contract

// Function to get the PDA
async function getPDA(): Promise<void> {
  try {
    const [pda, bump] = await PublicKey.findProgramAddress([seed], programId);
    console.log('PDA Address:', pda.toString());
    console.log('Bump:', bump);
  } catch (err) {
    console.error('Error deriving PDA:', err);
  }
}

// Call the function
getPDA();
