import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🗑️ Aggressive Wipe of All Underscore Slugs...");
    
    // 1. Cascade delete or move data
    // To be safe and simple: just delete the states with underscores.
    // The master_sync will recreate the hyphenated ones and the missing data.
    const res = await client.query("DELETE FROM states WHERE slug LIKE '%_%' AND slug NOT LIKE '%-%'");
    // Wait, some have both? No, let's just use regex for "contains underscore"
    const res2 = await client.query("DELETE FROM states WHERE slug ~ '_'");
    
    console.log(`✅ Deleted legacy states. Initial sync will now recalibrate.`);
    
    const remaining = await client.query("SELECT slug FROM states");
    console.log("Remaining Slugs:", remaining.rows.map(r => r.slug));

  } catch (err: any) {
    console.error("Cleanup Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
