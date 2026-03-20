export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabaseServer";

interface RawElectionData {
  State_Name: string;
  Year: number;
  Election_Type: 'Assembly' | 'Parliament';
  Party: string;
  Seats_Won: number;
  Total_Seats: number;
  Summary?: string;
}

const PRODUCTION_DATA: RawElectionData[] = [
  { State_Name: "Uttar Pradesh", Year: 2022, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 255, Total_Seats: 403, Summary: "A decisive victory for the Yogi Adityanath-led BJP government." },
  { State_Name: "Uttar Pradesh", Year: 2017, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 312, Total_Seats: 403, Summary: "A massive landslide that redefined UP's political trajectory." },
  { State_Name: "Maharashtra", Year: 2019, Election_Type: 'Assembly', Party: "BJP", Seats_Won: 105, Total_Seats: 288, Summary: "The election that led to the complex 'Maha Vikas Aghadi' coalition." },
  { State_Name: "Bihar", Year: 2020, Election_Type: 'Assembly', Party: "RJD", Seats_Won: 75, Total_Seats: 243, Summary: "Tejashwi Yadav's emerge as a powerhouse, leading the single largest party." },
  { State_Name: "Bihar", Year: 2015, Election_Type: 'Assembly', Party: "JD(U)", Seats_Won: 71, Total_Seats: 243, Summary: "The Mahagathbandhan victory led by Nitish Kumar and Lalu Yadav." }
];

export async function GET() {
  console.log("Starting Production Ingestion...");
  try {
    const results = [];

    for (const raw of PRODUCTION_DATA) {
      console.log(`Processing ${raw.State_Name} ${raw.Year}...`);
      
      const supabaseService = getSupabaseService();
      // 1. Get or Create State
      const slug = raw.State_Name.toLowerCase().replace(/\s+/g, '-');
      let { data: state } = await supabaseService.from('states').select('id').eq('slug', slug).single();

      if (!state) {
        console.log(`Creating state: ${raw.State_Name}`);
        const { data: newState, error: stateErr } = await supabaseService.from('states').insert({
          name: raw.State_Name,
          slug: slug,
          total_assembly_seats: raw.Election_Type === 'Assembly' ? raw.Total_Seats : 0
        }).select().single();
        if (stateErr) console.error("State Create Error:", stateErr);
        state = newState;
      }

      if (!state) {
        results.push({ item: raw.State_Name, status: "Error", message: "Could not find/create state" });
        continue;
      }

      // 2. Get or Create Party
      let { data: party } = await supabaseService.from('parties').select('id').eq('short_name', raw.Party).single();
      if (!party) {
        console.log(`Creating party: ${raw.Party}`);
        const { data: newParty, error: partyErr } = await supabaseService.from('parties').insert({
          name: raw.Party,
          short_name: raw.Party,
          color: "#E2A03F" 
        }).select().single();
        if (partyErr) console.error("Party Create Error:", partyErr);
        party = newParty;
      }

      // 3. Upsert Election
      const { error: electionError } = await supabaseService.from('elections').upsert({
        state_id: state.id,
        year: raw.Year,
        type: raw.Election_Type === 'Assembly' ? 'State' : 'National',
        title: `${raw.State_Name} ${raw.Year} ${raw.Election_Type}`,
        summary: raw.Summary,
        total_seats: raw.Total_Seats,
        seats_won: raw.Seats_Won,
        winner_party_id: party?.id
      }, { onConflict: 'state_id, year, type' });

      results.push({
        item: `${raw.State_Name} ${raw.Year}`,
        status: electionError ? "Error" : "Success",
        message: electionError?.message
      });
    }

    return NextResponse.json({ 
      message: "Production Ingestion Run Completed",
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
