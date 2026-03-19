import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query('SELECT slug FROM states');
  console.log(JSON.stringify(res.rows.map(r => r.slug)));
  await client.end();
}

run();
