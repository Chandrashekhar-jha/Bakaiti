import { syncTCPD } from './sources/tcpd_ied';
import { syncECI } from './sources/eci';
import { syncECIArchivist } from './sources/eci_archivist';
import { syncWikidata } from './sources/wikidata';
import { seedStates } from './sources/states_seed';
import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function masterSync() {
  console.log("🏛️ Starting Bakaiti Political Encyclopedia Master Sync...");
  
  try {
    // 1. Foundation: Seed States
    await seedStates();

    // 2. Initial Metadata Sync (Eras, Turning Points)
    await seedEncyclopediaMetadata();

    // 3. Historical Result Sync (TCPD 1962-Present)
    await syncTCPD();

    // 4. Early Archive Sync (ECI 1951-1961)
    await syncECIArchivist();

    // 3. Official Metric Normalization (ECI)
    await syncECI();

    // 4. Biographical Media Enrichment (Wikidata)
    await syncWikidata();

    console.log("🏁 Master Sync Completed successfully.");
  } catch (err: any) {
    console.error("🚨 Master Sync Fatal Error:", err.message);
  }
}

async function seedEncyclopediaMetadata() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🌱 Seeding Encyclopedia Metadata (Eras, Events)...");

    // Sample Bihar 2020 Turning Points
    const biharSlug = 'bihar';
    const stateRes = await client.query("SELECT id FROM states WHERE slug = $1", [biharSlug]);
    if (stateRes.rows.length > 0) {
      const stateId = stateRes.rows[0].id;

      // Seed Eras
      await client.query(
        `INSERT INTO political_eras (state_id, start_year, end_year, title, description) 
         VALUES ($1, 1990, 2005, 'The Social Justice Era', 'The rise of regional socialist forces led by Lalu Prasad Yadav, focusing on Dalit and OBC empowerment.')
         ON CONFLICT DO NOTHING`,
        [stateId]
      );

      // Seed Events
      await client.query(
        `INSERT INTO political_events (state_id, year, title, description, event_type) 
         VALUES ($1, 2005, 'The End of Jungle Raj', 'Nitish Kumar takes oath as CM, marking a shift towards "Sushasan" (Good Governance).', 'Turning Point')
         ON CONFLICT DO NOTHING`,
        [stateId]
      );
    }

    console.log("✅ Metadata seeding complete.");
  } catch (err: any) {
    console.error("❌ Metadata Sync Error:", err.message);
  } finally {
    await client.end();
  }
}

masterSync();
