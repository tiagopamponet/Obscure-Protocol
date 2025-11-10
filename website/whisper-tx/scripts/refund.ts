import { PublicKey, Connection, Transaction, SystemProgram, Keypair } from "@solana/web3.js"
import { createHash } from "crypto"
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Program constants
export const PROGRAM_ID = new PublicKey("8KYeVB9iPLgy3h33BQAwUJCTWc1hvzrcpvMxSNjTXnFf")
export const PDA_ADDRESS = new PublicKey("2pf7Zx4PitoVB5rJZvGvm2jxKVH8A68uA5StujXdkiP3")
export const PROGRAM_AUTHORITY = new PublicKey("B2nDe6bnnhEjS6a7AG7X2dY6eMVWXyzhTZKpZtwv7tfE")
export const EXPECTED_AMOUNT = 1_000_000 // 0.001 SOL in lamports

// Get private key from environment variable
const getPrivateKey = () => {
  const privateKeyStr = process.env.NEXT_PUBLIC_PRIVATE_KEY
  if (!privateKeyStr) {
    throw new Error("NEXT_PUBLIC_PRIVATE_KEY not found in environment variables. Please check your .env.local file.")
  }
  try {
    return new Uint8Array(privateKeyStr.split(',').map(Number))
  } catch (error) {
    throw new Error("Invalid NEXT_PUBLIC_PRIVATE_KEY format in .env.local file. Should be comma-separated numbers.")
  }
}

export interface RefundProgress {
  step: "initiating-refund" | "processing-refund" | "complete"
  message?: string
  signature?: string
}

async function processRefund(
  connection: Connection,
  recipient: PublicKey,
  onProgress: (progress: RefundProgress) => void
): Promise<string> {
  // Create wallet from private key
  const WALLET = Keypair.fromSecretKey(getPrivateKey())

  // Verify the wallet is the program authority
  if (!WALLET.publicKey.equals(PROGRAM_AUTHORITY)) {
    throw new Error("Wallet is not the program authority")
  }

  // Log balances before refund
  const pdaBalance = await connection.getBalance(PDA_ADDRESS)
  const recipientBalance = await connection.getBalance(recipient)
  console.log("PDA Balance before refund:", pdaBalance)
  console.log("Recipient Balance before refund:", recipientBalance)

  // Create instruction data for withdraw_funds
  const discriminator = createHash("sha256")
    .update("global:withdraw_funds")
    .digest()
    .slice(0, 8)

  // Create transaction
  const transaction = new Transaction().add({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: WALLET.publicKey, isSigner: true, isWritable: true }, // program authority
      { pubkey: PDA_ADDRESS, isSigner: false, isWritable: true }, // pda account
      { pubkey: recipient, isSigner: false, isWritable: true }, // recipient
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system program
    ],
    data: discriminator
  })

  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = WALLET.publicKey

  // Sign and send transaction
  transaction.sign(WALLET)
  const signature = await connection.sendRawTransaction(transaction.serialize())
  
  // Wait for confirmation
  const confirmation = await connection.confirmTransaction(signature)
  
  if (confirmation.value.err) {
    throw new Error("Refund transaction failed")
  }

  // Log balances after refund
  const newPdaBalance = await connection.getBalance(PDA_ADDRESS)
  const newRecipientBalance = await connection.getBalance(recipient)
  console.log("PDA Balance after refund:", newPdaBalance)
  console.log("Recipient Balance after refund:", newRecipientBalance)
  console.log("Refund amount:", newRecipientBalance - recipientBalance)

  // Pass signature to progress
  onProgress({ step: "complete", message: "Refund completed successfully!", signature })
  return signature
}

export async function handleRefund(
  recipient: PublicKey,
  onProgress: (progress: RefundProgress) => void
): Promise<string> {
  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")

    onProgress({ step: "initiating-refund", message: "Initiating refund process..." })

    onProgress({ step: "processing-refund", message: "Processing refund..." })
    const signature = await processRefund(connection, recipient, onProgress)

    onProgress({ step: "complete", message: "Refund completed successfully!" })
    return signature

  } catch (error) {
    console.error("Refund failed:", error)
    throw error
  }
} 