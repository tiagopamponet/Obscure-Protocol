import { PublicKey, Connection, Transaction, SystemProgram, Keypair, TransactionInstruction } from "@solana/web3.js"
import { createHash } from "crypto"
import bs58 from "bs58"
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Debug log to verify environment variables
console.log('Environment variables loaded:', {
  hasPrivateKey: !!process.env.NEXT_PUBLIC_PRIVATE_KEY,
  privateKeyLength: process.env.NEXT_PUBLIC_PRIVATE_KEY?.split(',').length
})

// Program constants
export const PROGRAM_ID = new PublicKey("8KYeVB9iPLgy3h33BQAwUJCTWc1hvzrcpvMxSNjTXnFf")
export const PDA_ADDRESS = new PublicKey("2pf7Zx4PitoVB5rJZvGvm2jxKVH8A68uA5StujXdkiP3")
export const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
export const PROGRAM_AUTHORITY = new PublicKey("B2nDe6bnnhEjS6a7AG7X2dY6eMVWXyzhTZKpZtwv7tfE")

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

// Hashing method as in Solana contract
function hashCode(code: string) {
  const data = Buffer.from("SOLANA TEST" + code)
  const hash = createHash('sha256').update(data).digest()
  return bs58.encode(Buffer.from(hash))
}

export interface WithdrawProgress {
  step: "verifying-code" | "checking-memo" | "withdrawing" | "complete"
  message?: string
}

async function checkMemoAndRedeem(connection: Connection, code: string): Promise<boolean> {
  const hash = hashCode(code)
  const targetPrefix = `[BR] | ${hash} |`
  const signatures = await connection.getSignaturesForAddress(PROGRAM_AUTHORITY, { limit: 30 })

  for (const sigInfo of signatures) {
    const tx = await connection.getTransaction(sigInfo.signature, {
      maxSupportedTransactionVersion: 0
    })

    if (!tx?.meta?.logMessages) continue

    for (const log of tx.meta.logMessages) {
      if (log.includes(targetPrefix)) {
        const parts = log.match(/\[BR\] \| .*? \| (\d)/)
        const status = parts?.[1]

        if (status === "0") {
          console.log("✅ Found valid unredeemed memo")
          return true
        } else if (status === "1") {
          console.log("⚠️ Code already redeemed")
          throw new Error("This code has already been redeemed")
        }
      }
    }
  }

  console.log("❌ No matching memo found for this code")
  return false
}


async function withdrawFunds(connection: Connection, recipient: PublicKey, code: string): Promise<string> {
  // Create wallet from private key
  const WALLET = Keypair.fromSecretKey(getPrivateKey())

  // Verify the wallet is the program authority
  if (!WALLET.publicKey.equals(PROGRAM_AUTHORITY)) {
    throw new Error("Wallet is not the program authority")
  }

  // Log balances before withdrawal
  const pdaBalance = await connection.getBalance(PDA_ADDRESS)
  const recipientBalance = await connection.getBalance(recipient)
  console.log("PDA Balance before:", pdaBalance)
  console.log("Recipient Balance before:", recipientBalance)

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
    throw new Error("Withdrawal transaction failed")
  }

  // Log balances after withdrawal
  const newPdaBalance = await connection.getBalance(PDA_ADDRESS)
  const newRecipientBalance = await connection.getBalance(recipient)
  console.log("PDA Balance after:", newPdaBalance)
  console.log("Recipient Balance after:", newRecipientBalance)
  console.log("Balance difference:", newRecipientBalance - recipientBalance)

  // Send memo to PDA after successful withdrawal
  const hash = hashCode(code)
  const memoString = `[BR] | ${hash} | 1`
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

  const memoTx = new Transaction().add(transferIx, memoIx)
  
  // Get the latest blockhash for memo transaction
  const { blockhash: memoBlockhash } = await connection.getLatestBlockhash()
  memoTx.recentBlockhash = memoBlockhash
  memoTx.feePayer = WALLET.publicKey

  // Sign and send memo transaction
  memoTx.sign(WALLET)
  const memoSignature = await connection.sendRawTransaction(memoTx.serialize())
  
  // Wait for memo confirmation
  const memoConfirmation = await connection.confirmTransaction(memoSignature)
  
  if (memoConfirmation.value.err) {
    console.warn("Memo transaction failed, but withdrawal was successful")
  } else {
    console.log("Withdrawal memo sent successfully")
  }

  return signature
}

async function sendMemo(connection: Connection, memoText: string): Promise<string> {
  const WALLET = Keypair.fromSecretKey(getPrivateKey())

  const instruction = {
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memoText)
  }

  const transaction = new Transaction().add(instruction)
  transaction.feePayer = WALLET.publicKey
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash

  transaction.sign(WALLET)

  const signature = await connection.sendRawTransaction(transaction.serialize())
  await connection.confirmTransaction(signature, "confirmed")

  return signature
}

export async function handleWithdraw(
  code: string,
  recipient: PublicKey,
  onProgress: (progress: WithdrawProgress) => void
): Promise<string> {
  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")

    onProgress({ step: "verifying-code", message: "Verifying code format..." })
    if (!code) {
      throw new Error("Code cannot be empty")
    }

    const timestamp = code

    onProgress({ step: "checking-memo", message: "Checking memo on chain..." })
    const isValid = await checkMemoAndRedeem(connection, timestamp)
    if (!isValid) {
      throw new Error("No valid memo found for this code")
    }

    onProgress({ step: "withdrawing", message: "Withdrawing funds..." })
    const signature = await withdrawFunds(connection, recipient, code)

    onProgress({ step: "complete", message: "Withdrawal completed successfully!" })
    return signature

  } catch (error) {
    console.error("Withdrawal failed:", error)
    throw error
  }
}
