import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: leader, error } = await supabase
      .from('leaders')
      .select(`
        *,
        partyId:parties(*),
        stateId:states(*),
        relationships:leader_relationships(
          *,
          leaderId:related_leader_id(*)
        ),
        partyHistory:leader_party_history(
          *,
          partyId:parties(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error || !leader) return NextResponse.json({ error: "Leader not found" }, { status: 404 });

    return NextResponse.json(leader);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
