import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function applyRLS() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🐘 Connected to PostgreSQL for RLS update...");

    const rlsPath = path.resolve(process.cwd(), 'scripts', 'enable_rls.sql');
    const sql = fs.readFileSync(rlsPath, 'utf8');

    await client.query(sql);
    console.log("🔓 Public Read Access enabled for all tables.");

  } catch (err: any) {
    console.error("❌ RLS Policy Update Failed:", err.message);
  } finally {
    await client.end();
  }
}

applyRLS();
