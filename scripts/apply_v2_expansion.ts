import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function applyExpansion() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🚀 Applying Schema Expansion (v2)...");

    const sqlPath = path.join(process.cwd(), 'scripts', 'schema_v2_expansion.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sql);
    console.log("✅ Success: Schema expansion applied to Supabase.");
  } catch (err: any) {
    console.error("❌ Migration Error:", err.message);
  } finally {
    await client.end();
  }
}

applyExpansion();
