import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch, { Response as FetchResponse } from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Transaction Stats Configuration
const PDA_ADDRESS = "2pf7Zx4PitoVB5rJZvGvm2jxKVH8A68uA5StujXdkiP3";
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

interface TxStats {
  totalTx: number;
  last24hTx: number;
  lastUpdated: number;
}

interface SignatureResponse {
  signature: string;
  blockTime: number;
}

interface HeliusResponse {
  jsonrpc: string;
  id: number;
  result: SignatureResponse[];
}

let cachedStats: TxStats = {
  totalTx: 0,
  last24hTx: 0,
  lastUpdated: 0,
};

// Initialize DB table
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('✅ Connected to the database.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_codes (
        wallet_address TEXT NOT NULL,
        code TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (wallet_address, code)
      );
    `);

    console.log('✅ Table "wallet_codes" ensured.');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
  } finally {
    client.release();
  }
}

interface SaveCodeRequest {
  walletAddress: string;
  code: string;
  amount: number;
}

// Transaction Stats Functions
async function fetchTxStats() {
  let allSignatures: SignatureResponse[] = [];
  let before: string | undefined = undefined;
  let keepFetching = true;
  
  while (keepFetching) {
    const sigRes: FetchResponse = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: before ? [PDA_ADDRESS, { limit: 100, before }] : [PDA_ADDRESS, { limit: 100 }],
      }),
    });
    const sigData: HeliusResponse = await sigRes.json();
    const batch: SignatureResponse[] = sigData.result || [];
    allSignatures = allSignatures.concat(batch);
    if (batch.length === 100) {
      before = batch[batch.length - 1].signature;
    } else {
      keepFetching = false;
    }
  }
  
  const nowSec = Math.floor(Date.now() / 1000);
  const startOf24h = nowSec - 86400;
  const last24hTx = allSignatures.filter(s => s.blockTime && s.blockTime >= startOf24h).length;
  
  cachedStats = {
    totalTx: allSignatures.length,
    last24hTx,
    lastUpdated: Date.now(),
  };
}

// API Routes

// Save code API
app.post('/api/save-code', async (req: Request<{}, {}, SaveCodeRequest>, res: Response) => {
  const { walletAddress, code, amount } = req.body;

  if (!walletAddress || !code || amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO wallet_codes (wallet_address, code, amount, is_used, created_at)
      VALUES ($1, $2, $3, false, NOW())
      ON CONFLICT (wallet_address, code)
      DO UPDATE SET amount = EXCLUDED.amount, is_used = false, created_at = NOW();
    `, [walletAddress, code, amount]);

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error saving code:', err);
    res.status(500).json({ error: 'Failed to save code' });
  } finally {
    client.release();
  }
});

// Get codes by wallet address
app.get('/api/get-codes/:walletAddress', async (req: Request<{ walletAddress: string }>, res: Response) => {
  const { walletAddress } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT code, amount, is_used, created_at FROM wallet_codes WHERE wallet_address = $1`,
      [walletAddress]
    );

    const codes: Record<string, any> = {};
    result.rows.forEach(row => {
      codes[row.code] = {
        value: row.code,
        amount: parseFloat(row.amount),
        is_used: row.is_used,
        created_at: row.created_at
      };
    });

    res.json({ codes });
  } catch (err) {
    console.error('❌ Error getting codes:', err);
    res.status(500).json({ error: 'Failed to get codes' });
  } finally {
    client.release();
  }
});

// Transaction stats API
app.get('/api/tx-stats', (_req: Request, res: Response) => {
  res.json(cachedStats);
});

// Pool error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Start server and initialize services
async function startServer() {
  await initializeDatabase();
  
  // Initial fetch of transaction stats
  await fetchTxStats();
  // Update transaction stats every hour
  setInterval(fetchTxStats, 60 * 60 * 1000);

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();