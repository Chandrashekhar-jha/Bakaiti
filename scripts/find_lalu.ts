import { Client } from 'pg';
const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function findLalu() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT name, slug FROM leaders WHERE name ILIKE '%Lalu Prasad%'");
    console.log('Lalu Search Results:', JSON.stringify(res.rows, null, 2));
    
    const allBiharRes = await client.query("SELECT name, slug FROM leaders WHERE state_id = (SELECT id FROM states WHERE slug = 'bihar') LIMIT 20");
    console.log('Sample Bihar Leaders:', JSON.stringify(allBiharRes.rows, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

findLalu();
