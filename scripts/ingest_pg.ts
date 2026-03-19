import { Client } from 'pg';

const connectionString = "postgresql://postgres:jhachandrashekhar@db.cixbptdbgxolecbqktak.supabase.co:5432/postgres";

const PRODUCTION_DATA = [
  { State_Name: "Uttar Pradesh", Year: 2022, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 255, Total_Seats: 403, Summary: "A decisive victory for the Yogi Adityanath-led BJP government." },
  { State_Name: "Uttar Pradesh", Year: 2017, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 312, Total_Seats: 403, Summary: "A massive landslide that redefined UP's political trajectory." },
  { State_Name: "Maharashtra", Year: 2019, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 105, Total_Seats: 288, Summary: "The election that led to the complex 'Maha Vikas Aghadi' coalition." },
  { State_Name: "Bihar", Year: 2020, Election_Type: 'Assembly', Party: "RJD", Seats_Won: 75, Total_Seats: 243, Summary: "Tejashwi Yadav's emerge as a powerhouse, leading the single largest party." },
  { State_Name: "Bihar", Year: 2015, Election_Type: 'Assembly', Party: "JD(U)", Seats_Won: 71, Total_Seats: 243, Summary: "The Mahagathbandhan victory led by Nitish Kumar and Lalu Yadav." }
];

async function ingest() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🚀 Starting Production Ingestion via PostgreSQL...");

    for (const raw of PRODUCTION_DATA) {
      console.log(`Processing ${raw.State_Name} ${raw.Year}...`);
      
      const slug = raw.State_Name.toLowerCase().replace(/\s+/g, '-');

      // 1. Upsert State
      const stateRes = await client.query(
        "INSERT INTO states (name, slug, total_assembly_seats) VALUES ($1, $2, $3) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        [raw.State_Name, slug, raw.Election_Type === 'Assembly' ? raw.Total_Seats : 0]
      );
      const stateId = stateRes.rows[0].id;

      // 2. Upsert Party
      const partyRes = await client.query(
        "INSERT INTO parties (name, short_name, color) VALUES ($1, $1, '#E2A03F') ON CONFLICT (short_name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        [raw.Party]
      );
      const partyId = partyRes.rows[0].id;

      // 3. Upsert Election
      await client.query(
        `INSERT INTO elections (state_id, year, type, title, summary, total_seats, seats_won, winner_party_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         ON CONFLICT (state_id, year, type) DO UPDATE SET summary = EXCLUDED.summary`,
        [
          stateId, 
          raw.Year, 
          raw.Election_Type === 'Assembly' ? 'State' : 'National', 
          `${raw.State_Name} ${raw.Year} ${raw.Election_Type}`,
          raw.Summary,
          raw.Total_Seats,
          raw.Seats_Won,
          partyId
        ]
      );
      console.log(`   ✅ Success: ${raw.State_Name} ${raw.Year}`);
    }
  } catch (err: any) {
    console.error("❌ Ingestion Error:", err.message);
  } finally {
    await client.end();
  }
}

ingest();
