import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: constituency, error } = await supabase
      .from('constituencies')
      .select(`
        *,
        stateId:states(*),
        notableLeaders:constituency_notable_leaders(
          leader:leaders(*)
        ),
        historicalResults:constituency_historical_results(
          *,
          winnerPartyId:parties!winner_party_id(*),
          runnerUpPartyId:parties!runner_up_party_id(*)
        )
      `)
      .eq('slug', slug)
      .single();

    if (error || !constituency) return NextResponse.json({ error: "Constituency not found" }, { status: 404 });

    // Map back to structure expected by frontend
    const mappedConstituency = {
      ...constituency,
      notableLeaderIds: constituency.notableLeaders?.map((nl: any) => nl.leader) || [],
      historicalResults: constituency.historicalResults || []
    };

    return NextResponse.json(mappedConstituency);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
