import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Pool error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});