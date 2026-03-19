import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: state, error: stateError } = await supabase
      .from('states')
      .select('*, state_eras(*)')
      .eq('slug', slug)
      .single();

    if (stateError || !state) return NextResponse.json({ error: "State not found" }, { status: 404 });

    // Fetch related data for the state page
    const { data: elections } = await supabase
      .from('elections')
      .select('*, outcome:winner_party_id(short_name, color)')
      .eq('state_id', state.id)
      .order('year', { ascending: false });

    const { data: leaders } = await supabase
      .from('leaders')
      .select('*, party:party_id(short_name, color)')
      .eq('state_id', state.id);

    const { data: stories } = await supabase
      .from('stories')
      .select('*')
      .eq('state_id', state.id);

    return NextResponse.json({ 
      state: {
        ...state,
        eras: state.state_eras // Map state_eras to eras for frontend compatibility
      }, 
      elections: elections?.map(e => ({
        ...e,
        outcome: { winnerPartyId: e.outcome } // Map back to structure expected by frontend
      })), 
      leaders, 
      stories 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
