import { Client } from 'pg';
const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function checkCounts() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const queries = [
      { name: 'States', sql: 'SELECT count(*) FROM states' },
      { name: 'Elections', sql: 'SELECT count(*) FROM elections' },
      { name: 'Constituencies', sql: 'SELECT count(*) FROM constituencies' },
      { name: 'Leaders', sql: 'SELECT count(*) FROM leaders' },
      { name: 'Historical Results', sql: 'SELECT count(*) FROM constituency_historical_results' },
      { name: 'Political Eras', sql: 'SELECT count(*) FROM political_eras' },
      { name: 'Political Events', sql: 'SELECT count(*) FROM political_events' }
    ];

    console.log('--- Database Stats ---');
    for (const q of queries) {
      const res = await client.query(q.sql);
      console.log(`${q.name}: ${res.rows[0].count}`);
    }
    
    // Check if Wikidata sync actually updated photos
    const photoRes = await client.query('SELECT count(*) FROM leaders WHERE photo_url IS NOT NULL');
    console.log(`Leaders with Photos: ${photoRes.rows[0].count}`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkCounts();
