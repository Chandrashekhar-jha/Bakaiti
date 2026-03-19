import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // 1. CLEAR EXISTING DATA (Caution: Use only for development)
    // Note: In Postgres, order matters due to foreign keys.
    await supabase.from('story_leaders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('constituency_historical_results').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('constituency_notable_leaders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('constituencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('elections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('alliance_parties').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('alliances').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leader_relationships').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leader_party_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('leaders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('parties').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('state_eras').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('national_event_impacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('national_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('states').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. SEED STATES
    const { data: states, error: stateError } = await supabase.from('states').insert([
      {
        name: "Bihar",
        slug: "bihar",
        total_assembly_seats: 243,
        total_lok_sabha_seats: 40,
        current_cm: "Nitish Kumar",
        quick_facts: ["Social Justice Hub", "Land of Mandate Politics", "Second Largest Bloc"],
        national_influence: "Bihar's 40 Lok Sabha seats make it a critical kingmaker in New Delhi.",
      }
    ]).select();

    if (stateError || !states) throw stateError;
    const bihar = states[0];

    // Seed State Eras
    await supabase.from('state_eras').insert([
      { state_id: bihar.id, year: "1947 - 1989", title: "The Congress Foundation", description: "The early decades dominated by the single-party system." },
      { state_id: bihar.id, year: "1990 - 2005", title: "The Rise of Social Justice", description: "A seismic shift in power led by Lalu Prasad Yadav." },
      { state_id: bihar.id, year: "2005 - Present", title: "The Coalition Era", description: "The tactical genius of Nitish Kumar and complex alliances." },
    ]);

    // 3. SEED PARTIES
    const { data: seededParties, error: partyError } = await supabase.from('parties').insert([
      { name: "Bharatiya Janata Party", short_name: "BJP", color: "#E2A03F", ideology: "Nationalism" },
      { name: "Indian National Congress", short_name: "INC", color: "#1E3A8A", ideology: "Centrism" },
      { name: "Janata Dal (United)", short_name: "JD(U)", color: "#2D5A27", ideology: "Socialism" },
      { name: "Rashtriya Janata Dal", short_name: "RJD", color: "#22C55E", ideology: "Social Justice" },
      { name: "Lok Janshakti Party", short_name: "LJP", color: "#800000", ideology: "Dalit Rights" },
    ]).select();

    if (partyError || !seededParties) throw partyError;
    const findParty = (short: string) => seededParties.find(p => p.short_name === short);

    // 4. SEED LEADERS
    const { data: seededLeaders, error: leaderError } = await supabase.from('leaders').insert([
      {
        name: "Nitish Kumar",
        slug: "nitish-kumar",
        party_id: findParty("JD(U)")?.id,
        state_id: bihar.id,
        era: "2005 - Present",
        thumbnail: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400",
        summary: "The engineer of modern Bihar's administration.",
        description: "Nitish Kumar, known as 'Sushasan Babu', has defined Bihar's development narrative for nearly two decades through complex alliance-building.",
        achievements: ["Sushasan narrative", "Infrastructure push"],
        controversies: ["Flip-flops"]
      },
      {
        name: "Lalu Prasad Yadav",
        slug: "lalu-prasad-yadav",
        party_id: findParty("RJD")?.id,
        state_id: bihar.id,
        era: "1990 - 2005",
        thumbnail: "https://images.unsplash.com/photo-1541829070764-84a7d30dee62?q=80&w=400",
        summary: "Relentless voice for social justice.",
        description: "Lalu's rise in the 90s signaled a tectonic shift in Hindi Heartland politics, empowering backward classes.",
        achievements: ["OBC empowerment"],
        controversies: ["Fodder scam"]
      }
    ]).select();

    if (leaderError || !seededLeaders) throw leaderError;
    const nitish = seededLeaders.find(l => l.slug === 'nitish-kumar');
    const lalu = seededLeaders.find(l => l.slug === 'lalu-prasad-yadav');

    // Relationships
    if (nitish && lalu) {
      await supabase.from('leader_relationships').insert([
        { leader_id: nitish.id, related_leader_id: lalu.id, relationship_type: "Rivalry", context: "Long-standing contest for Bihar's soul." },
        { leader_id: nitish.id, related_leader_id: lalu.id, relationship_type: "Alliance", context: "Mahagathbandhan 2015", year: 2015 }
      ]);
    }

    // 5. SEED ELECTION
    const { data: allseededAlliances, error: allianceError } = await supabase.from('alliances').insert([
      { name: "NDA", is_winner: true }
    ]).select();
    if (allianceError || !allseededAlliances) throw allianceError;

    const { data: seededElections, error: electionError } = await supabase.from('elections').insert([
      {
        state_id: bihar.id,
        year: 2020,
        type: "State",
        title: "The Battle of Resilience: Bihar 2020",
        dramatic_hook: "A pandemic, a new leader, and an old alliance tested to its limits.",
        summary: "In a closely fought battle, the NDA retained power while the RJD emerged as the single largest party.",
        background: "Bihar 2020 was the first major election during the COVID-19 pandemic.",
        campaign_strategy: {
          digital: "Hyper-local WhatsApp groups and virtual rallies.",
          ground: "Nitish's focus on women voters vs Tejashwi's '10 Lakh Jobs' promise.",
        },
        public_mood: "Anti-incumbency vs trust in Modi.",
        shocking_moments: ["The RJD emerging as single largest party with 75 seats.", "The BJP overtaking JDU significantly within the alliance."],
        winner_alliance_id: allseededAlliances[0].id,
        winner_party_id: find_party_id("BJP", seededParties),
        seats_won: 125,
        total_seats: 243,
        before_power: "NDA (JDU Major)",
        after_power: "NDA (BJP Major)",
        impact: "Shifted the power balance within the ruling alliance.",
      }
    ]).select();

    if (electionError || !seededElections) throw electionError;

    // 6. SEED CONSTITUENCIES
    const { data: seededConsts, error: constError } = await supabase.from('constituencies').insert([
      {
        name: "Raghopur",
        slug: "raghopur",
        state_id: bihar.id,
        type: "State",
        significance: "The Yadav family fortress.",
      }
    ]).select();

    if (constError || !seededConsts) throw constError;
    const raghopur = seededConsts[0];

    // Notable Leaders
    if (lalu) {
      await supabase.from('constituency_notable_leaders').insert([
        { constituency_id: raghopur.id, leader_id: lalu.id }
      ]);
    }

    // Historical Results
    await supabase.from('constituency_historical_results').insert([
      {
        constituency_id: raghopur.id,
        year: 2020,
        winner_name: "Tejashwi Yadav",
        winner_party_id: find_party_id("RJD", seededParties),
        runner_up_name: "Satish Kumar",
        runner_up_party_id: find_party_id("BJP", seededParties),
        margin: 38174
      }
    ]);

    return NextResponse.json({ message: "Supabase Database Seeded Successfully with Bihar Data" });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message || "Failed to seed database" }, { status: 500 });
  }
}

function find_party_id(short: string, parties: any[]) {
  return parties.find(p => p.short_name === short)?.id;
}
