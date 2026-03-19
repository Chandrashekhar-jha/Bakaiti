import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function checkSchema() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name IN ('constituencies', 'parties', 'elections', 'leaders')
    ORDER BY table_name, ordinal_position;
  `);
  console.table(res.rows);
  await client.end();
}

checkSchema();
