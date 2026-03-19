import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: election, error } = await supabase
      .from('elections')
      .select(`
        *,
        stateId:states(*),
        winnerAllianceId:alliances(*),
        winnerPartyId:parties(*)
      `)
      .eq('id', id)
      .single();

    if (error || !election) return NextResponse.json({ error: "Election not found" }, { status: 404 });

    // Fetch storylines related to this election
    const { data: relatedStories } = await supabase
      .from('stories')
      .select('*')
      .eq('election_id', id);

    // Fetch all alliances for this election context
    const { data: alliances } = await supabase
      .from('alliances')
      .select('*, party:alliance_parties(party_id(*))')
      .eq('id', election.winner_alliance_id);

    return NextResponse.json({ 
      election: {
        ...election,
        outcome: {
          winnerAllianceId: election.winnerAllianceId,
          winnerPartyId: election.winnerPartyId,
          seatsWon: election.seats_won,
          totalSeats: election.total_seats
        }
      }, 
      relatedStories, 
      alliances 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
