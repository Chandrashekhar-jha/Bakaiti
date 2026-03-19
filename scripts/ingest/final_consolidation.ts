import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🛠️ Starting Robust National Archive Consolidation...");
    
    const states = await client.query("SELECT id, name, slug FROM states");
    const underscored = states.rows.filter(s => s.slug.includes('_'));
    
    for (const source of underscored) {
      const targetSlug = source.slug.replace(/_/g, '-');
      const target = states.rows.find(s => s.slug === targetSlug);
      
      if (!target) {
        console.log(`🏷️ Renaming ${source.slug} -> ${targetSlug}`);
        await client.query("UPDATE states SET slug = $1 WHERE id = $2", [targetSlug, source.id]);
        continue;
      }

      console.log(`🔗 Merging ${source.slug} -> ${target.slug}`);
      
      // 1. Leaders
      console.log("   Moving Leaders...");
      await client.query("UPDATE leaders SET state_id = $1 WHERE state_id = $2", [target.id, source.id]);
      
      // 2. Constituencies
      console.log("   Moving Constituencies...");
      // For constituencies, we might have slug conflicts.
      const srcConsts = await client.query("SELECT id, slug FROM constituencies WHERE state_id = $1", [source.id]);
      for (const c of srcConsts.rows) {
          const targetCSlug = c.slug.replace(/_/g, '-');
          try {
              await client.query("UPDATE constituencies SET state_id = $1, slug = $2 WHERE id = $3", [target.id, targetCSlug, c.id]);
          } catch (err) {
              // Duplicate slug, likely exists in target. Merge data if needed, but for now just delete duplicate
              await client.query("UPDATE constituency_historical_results SET constituency_id = (SELECT id FROM constituencies WHERE slug = $1) WHERE constituency_id = $2", [targetCSlug, c.id]);
              await client.query("DELETE FROM constituencies WHERE id = $1", [c.id]);
          }
      }

      // 3. Elections
      console.log("   Moving Elections...");
      const srcElections = await client.query("SELECT year, type FROM elections WHERE state_id = $1", [source.id]);
      for (const e of srcElections.rows) {
          try {
              await client.query("UPDATE elections SET state_id = $1 WHERE state_id = $2 AND year = $3 AND type = $4", [target.id, source.id, e.year, e.type]);
          } catch (err) {
              // Existing election in target
              await client.query("DELETE FROM elections WHERE state_id = $1 AND year = $2 AND type = $3", [source.id, e.year, e.type]);
          }
      }

      // 4. Other metadata
      const tables = ['political_eras', 'political_events', 'rivalries', 'stories'];
      for (const table of tables) {
          await client.query(`UPDATE ${table} SET state_id = $1 WHERE state_id = $2`, [target.id, source.id]);
      }

      // 5. Final Delete
      await client.query("DELETE FROM states WHERE id = $1", [source.id]);
    }

    console.log("✅ Consolidation Successful.");
  } catch (err: any) {
    console.error("Fatal Merge Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
