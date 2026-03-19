import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// 1. Setup DB Client
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables. Check .env.local");
}

const db = createClient(supabaseUrl, supabaseServiceKey);

// 2. Data Definition
interface RawElectionData {
  State_Name: string;
  Year: number;
  Election_Type: 'Assembly' | 'Parliament';
  Party: string;
  Seats_Won: number;
  Total_Seats: number;
  Summary?: string;
}

const MOCK_TCPD_DATA: RawElectionData[] = [
  { State_Name: "Uttar Pradesh", Year: 2022, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 255, Total_Seats: 403, Summary: "A decisive victory for the Yogi Adityanath-led BJP government." },
  { State_Name: "Uttar Pradesh", Year: 2017, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 312, Total_Seats: 403, Summary: "A massive landslide that redefined UP's political trajectory." },
  { State_Name: "Maharashtra", Year: 2019, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 105, Total_Seats: 288, Summary: "The election that led to the complex 'Maha Vikas Aghadi' coalition." },
  { State_Name: "Bihar", Year: 2020, Election_Type: 'Assembly', Party: "RJD", Seats_Won: 75, Total_Seats: 243, Summary: "Tejashwi Yadav's emerge as a powerhouse, leading the single largest party." }
];

// 3. Ingestion Logic
async function main() {
  console.log("🚀 Starting Standalone Data Ingestion...");

  for (const raw of MOCK_TCPD_DATA) {
    console.log(`\nProcessing ${raw.State_Name} ${raw.Year} ${raw.Election_Type}...`);

    // Get or Create State
    const slug = raw.State_Name.toLowerCase().replace(/\s+/g, '-');
    let { data: state } = await db.from('states').select('id').eq('slug', slug).single();

    if (!state) {
      console.log(`   - State ${raw.State_Name} not found. Creating...`);
      const { data: newState, error } = await db.from('states').insert({
        name: raw.State_Name,
        slug: slug,
        total_assembly_seats: raw.Election_Type === 'Assembly' ? raw.Total_Seats : 0
      }).select().single();
      
      if (error || !newState) {
        console.error(`   ❌ Failed to create state: ${error?.message}`);
        continue;
      }
      state = newState;
    }

    // Get or Create Party
    let { data: party } = await db.from('parties').select('id').eq('short_name', raw.Party).single();
    if (!party) {
        console.log(`   - Party ${raw.Party} not found. Creating...`);
        const { data: newParty } = await db.from('parties').insert({
            name: raw.Party,
            short_name: raw.Party,
            color: "#666666"
        }).select().single();
        party = newParty;
    }

    // Upsert Election
    if (state) {
      const { error: electionError } = await db.from('elections').upsert({
        state_id: state.id,
        year: raw.Year,
        type: raw.Election_Type === 'Assembly' ? 'State' : 'National',
        title: `${raw.State_Name} ${raw.Year} ${raw.Election_Type}`,
        summary: raw.Summary,
        total_seats: raw.Total_Seats,
        seats_won: raw.Seats_Won,
        winner_party_id: party?.id
      }, { onConflict: 'state_id, year, type' });

      if (electionError) {
        console.error(`   ❌ Failed to upsert election: ${electionError.message}`);
      } else {
        console.log(`   ✅ Successfully ingested ${raw.State_Name} ${raw.Year}.`);
      }
    }
  }

  console.log("\n🏁 Standalone Ingestion Completed.");
}

main().catch(console.error);
