import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

async function consolidate() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🧹 Consolidating Duplicate States...");

    const allStates = await client.query("SELECT id, name, slug FROM states");
    
    // Group by normalized slug
    const groups = new Map<string, any[]>();
    for (const s of allStates.rows) {
        const norm = s.slug.replace(/_/g, '-');
        if (!groups.has(norm)) groups.set(norm, []);
        groups.get(norm)!.push(s);
    }

    for (const [normSlug, states] of groups) {
        if (states.length > 1) {
            console.log(`🔗 Consolidating: ${normSlug} (${states.length} entries)`);
            
            // Pick the best one (usually the one with hyphen or standard name)
            const target = states.find(s => s.slug === normSlug) || states[0];
            const others = states.filter(s => s.id !== target.id);

            for (const other of others) {
                console.log(`   Merging ${other.slug} -> ${target.slug}`);
                
                // Update dependent tables
                const tables = ['elections', 'leaders', 'constituencies', 'political_eras', 'political_events', 'rivalries', 'stories'];
                for (const table of tables) {
                    await client.query(`UPDATE ${table} SET state_id = $1 WHERE state_id = $2`, [target.id, other.id]);
                }
                
                // Delete the duplicate state
                await client.query("DELETE FROM states WHERE id = $1", [other.id]);
            }
        } else if (states[0].slug.includes('_')) {
            // Just rename if it only exists with underscore
            console.log(`🏷️ Renaming: ${states[0].slug} -> ${normSlug}`);
            await client.query("UPDATE states SET slug = $1 WHERE id = $2", [normSlug, states[0].id]);
        }
    }

    console.log("✅ Consolidation complete.");
  } catch (err: any) {
    console.error("Consolidation Error:", err.message);
  } finally {
    await client.end();
  }
}

consolidate();
