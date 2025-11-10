import { PublicKey, Connection, Transaction, SystemProgram, TransactionInstruction, Keypair } from "@solana/web3.js"
import { createHash } from "crypto"
import { handleRefund } from "./refund"

// Program constants
export const PROGRAM_ID = new PublicKey("8KYeVB9iPLgy3h33BQAwUJCTWc1hvzrcpvMxSNjTXnFf")
export const PDA_ADDRESS = new PublicKey("2pf7Zx4PitoVB5rJZvGvm2jxKVH8A68uA5StujXdkiP3")
export const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHh") // Invalid memo program ID for testing refund
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

export interface DepositProgress {
  step: "sending-to-contract" | "waiting-for-pda" | "generating-code" | "writing-proof" | "refunding" | "complete"
  couponCode?: string
  message?: string
}

async function sendMemo(connection: Connection, hash: string) {
  // Create wallet from private key
  const WALLET = Keypair.fromSecretKey(getPrivateKey())

  // Format the memo as requested
  const memoString = `[BR] | ${hash} | 0`

  const memoIx = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memoString)
  })

  const transferIx = SystemProgram.transfer({
    fromPubkey: WALLET.publicKey,
    toPubkey: PDA_ADDRESS,
    lamports: 1, // Lowest possible (1 lamport = 0.000000001 SOL)
  })

  const tx = new Transaction().add(transferIx, memoIx)
  
  // Get the latest blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  tx.recentBlockhash = blockhash
  tx.feePayer = WALLET.publicKey

  // Sign and send transaction
  tx.sign(WALLET)
  const signature = await connection.sendRawTransaction(tx.serialize())
  
  // Wait for confirmation
  const confirmation = await connection.confirmTransaction(signature)
  
  if (confirmation.value.err) {
    throw new Error("Memo transaction failed")
  }

  return signature
}

// Generate a unique code for the transaction
function generateCode(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000)
  return `${timestamp}_${random}`
}

// Custom error for refund processed
export class RefundProcessedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RefundProcessedError"
  }
}

export async function handleDeposit(
  publicKey: PublicKey,
  onProgress: (progress: DepositProgress) => void
): Promise<string | null | { refundSignature: string }> {
  try {
    if (!window.phantom?.solana) {
      throw new Error("Phantom wallet not found")
    }

    // Start deposit flow
    onProgress({ step: "sending-to-contract" })

    // Create connection
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")

    // Generate a unique code for this transaction
    const code = generateCode()
    console.log("Generated code:", code)

    // Create instruction data
    // Anchor discriminator for "deposit_funds" (8 bytes)
    const discriminator = createHash("sha256")
      .update("global:deposit_funds")
      .digest()
      .slice(0, 8)

    // Amount as u64 (8 bytes)
    const amountBuffer = Buffer.alloc(8)
    amountBuffer.writeBigUInt64LE(BigInt(EXPECTED_AMOUNT), 0)

    // Code length as u32 (4 bytes)
    const codeBuffer = Buffer.from(code)
    const codeLengthBuffer = Buffer.alloc(4)
    codeLengthBuffer.writeUInt32LE(codeBuffer.length, 0)

    // Combine all data
    const data = Buffer.concat([discriminator, amountBuffer, codeLengthBuffer, codeBuffer])

    // Create transaction
    const transaction = new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: publicKey, isSigner: true, isWritable: true }, // signer
        { pubkey: PDA_ADDRESS, isSigner: false, isWritable: true }, // pdaAccount
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // systemProgram
      ],
      data
    })

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey

    // Sign and send transaction
    const signed = await window.phantom.solana.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signed.serialize())
    
    onProgress({ step: "waiting-for-pda" })
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature)
    
    if (confirmation.value.err) {
      throw new Error("Transaction failed")
    }

    // Get transaction details
    onProgress({ step: "generating-code" })
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
    })

    if (!tx?.meta?.logMessages) {
      throw new Error("No logs found in transaction")
    }

    // Find the hash log
    const hashLog = tx.meta.logMessages.find(log => 
      log.includes("Transaction hash:")
    )

    if (!hashLog) {
      throw new Error("Hash not found in transaction logs")
    }

    // Extract the hash for memo
    const hash = hashLog.split("Transaction hash: ")[1].trim()
    console.log("Extracted hash for memo:", hash)

    onProgress({ step: "writing-proof" })
    
    // Try to send memo
    try {
      await sendMemo(connection, hash)
      // If memo succeeds, return the code
      const couponCode = `${code}`
      onProgress({ step: "complete", couponCode })
      return couponCode
    } catch (memoError) {
      // If memo fails, process refund and return refund signature
      console.error("Memo transaction failed, initiating refund:", memoError)
      onProgress({ 
        step: "refunding", 
        message: "Memo failed, processing refund..."
      })
      let refundSignature = null
      await handleRefund(publicKey, (progress) => {
        if (progress.signature) refundSignature = progress.signature
        console.log("Refund progress:", progress)
      }).then(sig => { refundSignature = sig })
      return { refundSignature }
    }

  } catch (error) {
    console.error("Deposit failed:", error)
    throw error
  }
} 