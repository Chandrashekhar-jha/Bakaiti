import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function inspectSchema() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'leaders'
      ORDER BY column_name
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err: any) {
    console.error("❌ Inspection Error:", err.message);
  } finally {
    await client.end();
  }
}

inspectSchema();
