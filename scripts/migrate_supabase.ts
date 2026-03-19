import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Connection String provided by the user
const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function migrate() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log("🐘 Connecting to Supabase PostgreSQL...");
    await client.connect();
    console.log("✅ Connected.");

    const schemaPath = path.resolve(process.cwd(), 'scripts', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log("🏙️ Executing Master Schema Migration...");
    await client.query(sql);
    console.log("🎉 Migration Successful! Tables created.");

  } catch (err: any) {
    console.error("❌ Migration Failed:", err.message);
  } finally {
    await client.end();
  }
}

migrate();
