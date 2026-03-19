import { Client } from 'pg';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import * as zlib from 'zlib';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

// Official TCPD Data Archive URL (1962-2023)
const TCPD_IED_URL = "https://github.com/tcpd/tcpd-ld-data-archive/raw/main/downloads/All_States/All_States_AE.csv.gz";

function escapeSql(str: string) {
  return str.replace(/'/g, "''");
}

export async function syncTCPD(stateSlug?: string) {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🚀 Starting TRUE TURBO TCPD Sync (Bulk SQL)...");

    const response = await axios.get(TCPD_IED_URL, { responseType: 'arraybuffer' });
    const decompressed = zlib.gunzipSync(response.data);
    const records = parse(decompressed.toString(), { columns: true, skip_empty_lines: true, trim: true }) as any[];

    const winners = records.filter(r => parseInt(r.Position) === 1 && (!stateSlug || r.State_Name.toLowerCase().replace(/[\s_]+/g, '-') === stateSlug));
    console.log(`🏆 Winners to sync: ${winners.length}`);

    const stateCache = new Map<string, number>();
    const partyCache = new Map<string, number>();
    const states = await client.query("SELECT id, slug FROM states");
    states.rows.forEach(r => stateCache.set(r.slug, r.id));
    const parties = await client.query("SELECT id, short_name FROM parties");
    parties.rows.forEach(r => partyCache.set(r.short_name, r.id));

    let count = 0;
    const batchSize = 500; // Optimal for multi-row inserts

    for (let i = 0; i < winners.length; i += batchSize) {
      const batch = winners.slice(i, i + batchSize);
      
      // 1. Bulk Ensure Parties
      const uniqueParties = Array.from(new Set(batch.map(r => r.Party))).filter(p => !partyCache.has(p));
      for (const p of uniqueParties) {
        const res = await client.query("INSERT INTO parties (short_name, name) VALUES ($1, $1) ON CONFLICT (short_name) DO UPDATE SET name = EXCLUDED.name RETURNING id", [p]);
        partyCache.set(p, res.rows[0].id);
      }

      // 2. Prepare Bulk Data (Uniquified)
      const electionMap = new Map<string, string>();
      const constMap = new Map<string, string>();
      const leaderMap = new Map<string, string>();

      for (const r of batch) {
        const sSlug = r.State_Name.toLowerCase().replace(/[\s_]+/g, '-');
        const stateId = stateCache.get(sSlug);
        if (!stateId) continue;
        const partyId = partyCache.get(r.Party)!;
        const year = parseInt(r.Year);
        const constSlug = `${sSlug}-${r.Constituency_Name.toLowerCase().replace(/\s+/g, '-')}`;
        const leaderSlug = r.Candidate.toLowerCase().replace(/\s+/g, '-');

        const eKey = `${stateId}-${year}-State`;
        electionMap.set(eKey, `('${stateId}', ${year}, 'State', 'assembly', '${escapeSql(r.State_Name)} ${year} Assembly', '${partyId}')`);
        constMap.set(constSlug, `('${escapeSql(r.Constituency_Name)}', '${escapeSql(constSlug)}', '${stateId}', 'Assembly')`);
        leaderMap.set(leaderSlug, `('${escapeSql(r.Candidate)}', '${escapeSql(leaderSlug)}', '${partyId}', '${stateId}')`);
      }

      // 3. Execute Bulk Inserts
      await client.query('BEGIN');
      try {
        if (electionMap.size > 0) {
          await client.query(`INSERT INTO elections (state_id, year, type, election_type, title, winner_party_id) VALUES ${Array.from(electionMap.values()).join(',')} ON CONFLICT (state_id, year, type) DO UPDATE SET winner_party_id = EXCLUDED.winner_party_id`);
        }
        if (constMap.size > 0) {
          await client.query(`INSERT INTO constituencies (name, slug, state_id, type) VALUES ${Array.from(constMap.values()).join(',')} ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`);
        }
        if (leaderMap.size > 0) {
          await client.query(`INSERT INTO leaders (name, slug, party_id, state_id) VALUES ${Array.from(leaderMap.values()).join(',')} ON CONFLICT (slug) DO UPDATE SET party_id = EXCLUDED.party_id, state_id = EXCLUDED.state_id`);
        }
        
        // Final pass for results
        const currentBatchSlugs = Array.from(constMap.keys());
        const cIdMap = new Map<string, number>();
        const cRes = await client.query(`SELECT id, slug FROM constituencies WHERE slug = ANY($1)`, [currentBatchSlugs]);
        cRes.rows.forEach(r => cIdMap.set(r.slug, r.id));

        const resultMap = new Map<string, string>();
        for (const r of batch) {
            const slug = `${r.State_Name.toLowerCase().replace(/[\s_]+/g, '-')}-${r.Constituency_Name.toLowerCase().replace(/[\s_]+/g, '-')}`;
            const cId = cIdMap.get(slug);
            if (!cId) continue;
            const pId = partyCache.get(r.Party);
            if (!pId) continue;
            const rKey = `${cId}-${r.Year}`;
            resultMap.set(rKey, `('${cId}', ${parseInt(r.Year)}, '${escapeSql(r.Candidate)}', '${pId}')`);
        }

        if (resultMap.size > 0) {
            await client.query(`INSERT INTO constituency_historical_results (constituency_id, year, winner_name, winner_party_id) VALUES ${Array.from(resultMap.values()).join(',')} ON CONFLICT DO NOTHING`);
        }

        await client.query('COMMIT');
        count += batch.length;
        console.log(`🚀 TRUE TURBO: ${count} / ${winners.length} synced.`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ True Turbo Batch Error:", err);
      }
    }

    console.log(`🏁 TRUE TURBO Sync Complete. Total: ${count}`);
  } catch (err: any) {
    console.error("❌ TRUE TURBO Sync Fatal Error:", err.message);
  } finally {
    await client.end();
  }
}
