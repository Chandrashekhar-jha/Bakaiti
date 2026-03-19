import axios from 'axios';
import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function fetchWikidata(wikidataId: string) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&format=json&props=claims|descriptions`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Bakaiti/1.0 (https://bakaiti.org; contact@bakaiti.org) axios/1.x'
    }
  });
  const entity = response.data.entities[wikidataId];
  
  let photo = null;
  // P18 is the property for image in Wikidata
  if (entity.claims.P18) {
    const fileName = entity.claims.P18[0].mainsnak.datavalue.value;
    photo = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=500`;
  }

  const bio = entity.descriptions?.en?.value || null;

  return { photo, bio };
}

export async function syncWikidata() {
  console.log("🔍 Syncing Leader Media from Wikidata...");
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // 1. Get leaders with wikidata_id but no photo/description
    const res = await client.query("SELECT id, name, wikidata_id FROM leaders WHERE wikidata_id IS NOT NULL AND (photo_url IS NULL OR description IS NULL)");
    
    for (const leader of res.rows) {
      console.log(`📡 Fetching Wikidata for: ${leader.name} (${leader.wikidata_id})`);
      try {
        const { photo, bio } = await fetchWikidata(leader.wikidata_id);
        
        await client.query(
          "UPDATE leaders SET photo_url = $1, summary = COALESCE(summary, $2), description = COALESCE(description, $2) WHERE id = $3",
          [photo, bio, leader.id]
        );
        console.log(`✅ Updated ${leader.name}`);
      } catch (err: any) {
        console.error(`❌ Wikidata Fetch Failed for ${leader.name}:`, err.message);
      }
    }
    
    console.log("✨ Wikidata Sync Complete.");
  } catch (err: any) {
    console.error("❌ Database Connection Error:", err.message);
  } finally {
    await client.end();
  }
}

// If run directly
if (require.main === module) {
  syncWikidata();
}
