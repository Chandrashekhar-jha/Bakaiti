import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function patchColumns() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🩹 Patching missing columns...");
    
    await client.query(`
      ALTER TABLE public.leaders 
      ADD COLUMN IF NOT EXISTS wikidata_id TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS photo_url TEXT;
    `);
    
    // Seed some wikidata IDs for Bihar leaders (Verified 2024-03-19)
    console.log("🌱 Seeding CORRECT test Wikidata IDs and fixing slugs...");
    const leadersToReset = ['Nitish Kumar', 'Lalu Prasad', 'Rabri Devi', 'Tejashwi', 'Sushil%Modi%'];
    await client.query("UPDATE leaders SET photo_url = NULL, description = NULL, summary = NULL WHERE name ILIKE ANY($1)", [leadersToReset.map(l => `%${l}%`)]);
    
    await client.query("UPDATE leaders SET wikidata_id = 'Q122304', slug = 'nitish-kumar' WHERE name ILIKE '%Nitish Kumar%'");
    await client.query("UPDATE leaders SET wikidata_id = 'Q561812', slug = 'lalu-prasad-yadav' WHERE name ILIKE '%Lalu Prasad%'");
    await client.query("UPDATE leaders SET wikidata_id = 'Q3503625', slug = 'rabri-devi' WHERE name ILIKE '%Rabri Devi%'");
    await client.query("UPDATE leaders SET wikidata_id = 'Q12595749', slug = 'tejashwi-yadav' WHERE name ILIKE '%Tejashwi%'");
    await client.query("UPDATE leaders SET wikidata_id = 'Q7648950', slug = 'sushil-kumar-modi' WHERE name ILIKE '%Sushil%Modi%'");
    
    console.log("✅ Column patch successful.");
  } catch (err: any) {
    console.error("❌ Patch Error:", err.message);
  } finally {
    await client.end();
  }
}

patchColumns();
