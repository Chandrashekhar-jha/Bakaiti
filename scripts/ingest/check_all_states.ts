import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function audit() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("📊 Bakaiti Political Encyclopedia - State Data Audit");
    console.log("-----------------------------------------");
    
    const states = await client.query("SELECT id, name, slug FROM states ORDER BY name");
    
    console.log(`| Name | Elections | Leaders | Constituencies | Results |`);
    console.log(`|------|-----------|---------|----------------|---------|`);
    
    for (const state of states.rows) {
      const eRes = await client.query("SELECT COUNT(*) FROM elections WHERE state_id = $1", [state.id]);
      const lRes = await client.query("SELECT COUNT(*) FROM leaders WHERE state_id = $1", [state.id]);
      const cRes = await client.query("SELECT COUNT(*) FROM constituencies WHERE state_id = $1", [state.id]);
      
      // Count results for these constituencies
      const rRes = await client.query(`
        SELECT COUNT(*) FROM constituency_historical_results 
        WHERE constituency_id IN (SELECT id FROM constituencies WHERE state_id = $1)
      `, [state.id]);
      
      console.log(`| ${state.name} | ${eRes.rows[0].count} | ${lRes.rows[0].count} | ${cRes.rows[0].count} | ${rRes.rows[0].count} |`);
    }
    
    const totalE = await client.query("SELECT COUNT(*) FROM elections");
    const totalL = await client.query("SELECT COUNT(*) FROM leaders");
    const totalR = await client.query("SELECT COUNT(*) FROM constituency_historical_results");
    
    console.log("-----------------------------------------");
    console.log(`TOTALS: Elections: ${totalE.rows[0].count}, Leaders: ${totalL.rows[0].count}, Results: ${totalR.rows[0].count}`);
    
  } catch (err: any) {
    console.error("Audit Error:", err.message);
  } finally {
    await client.end();
  }
}

audit();
