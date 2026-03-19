import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Users2, TrendingUp, Landmark, ShieldCheck, AlertCircle, ChevronRight, Zap, Target, Star } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// flagship data for Bihar 2020
const BIHAR_2020_DATA = {
  summary: {
    title: "The Corona Mandate",
    tagline: "A test of resilience and shift in socialist dynamics.",
    turnout: "57.05%",
    totalSeats: 243,
    majorityMark: 122,
    winner: "NDA (National Democratic Alliance)",
    status: "Verified Archive",
    description: "The 2020 Bihar Legislative Assembly election was held in three phases. It was the first major election in India to be held during the COVID-19 pandemic. The NDA returned to power with a reduced but decisive majority, while the RJD emerged as the single largest party."
  },
  powerBalance: [
    { alliance: "NDA", seats: 125, color: "bg-orange-500", parties: ["BJP: 74", "JD(U): 43", "VIP: 4", "HAM: 4"] },
    { alliance: "MGB", seats: 110, color: "bg-green-600", parties: ["RJD: 75", "INC: 19", "Left: 16"] },
    { alliance: "Others", seats: 8, color: "bg-gray-400", parties: ["AIMIM: 5", "BSP: 1", "Ind: 1", "LJP: 1"] }
  ],
  keyPlayers: [
    { name: "Nitish Kumar", role: "Incumbent CM", party: "JD(U)", image: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=200" },
    { name: "Tejashwi Yadav", role: "Challenger / LoP", party: "RJD", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=200" },
    { name: "Chirag Paswan", role: "The Lone Wolf", party: "LJP", image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?auto=format&fit=crop&q=80&w=200" }
  ],
  stories: [
    { id: 1, title: "The LJP Factor", desc: "How Chirag Paswan's decision to go solo significantly dented the JD(U) tally.", icon: AlertCircle },
    { id: 2, title: "The Employment Planks", desc: "For the first time, 10 lakh government jobs became a central election promise.", icon: Zap },
    { id: 3, title: "Silent Voter (Women)", desc: "The record participation of women voters was seen as a major factor in NDA's survival.", icon: Users2 }
  ]
};

export default async function ElectionYearPage({ params }: { params: Promise<{ slug: string, electionType: string, year: string }> }) {
  const { slug, electionType, year } = await params;
  
  // 1. Fetch State Data
  const { data: stateData } = await supabase.from('states').select('*').eq('slug', slug).single();

  // 2. Fetch Election Data with Encyclopedia Expansion
  let election: any = null;
  let constituencyResults: any[] = [];
  
  if (stateData) {
    const { data: eData } = await supabase
      .from('elections')
      .select('*, winner:winner_party_id(name, short_name, color), incumbent:incumbent_party_id(name, short_name), majority_mark, turnout_percent, major_issues, coalition_summary')
      .eq('state_id', stateData.id)
      .eq('year', parseInt(year))
      .eq('type', electionType === 'assembly' ? 'State' : 'National')
      .single();
    election = eData;

    // Fetch snapshot of constituency results for the breakdown
    const { data: rData } = await supabase
       .from('constituencies')
       .select('id, name, results:constituency_historical_results(*)')
       .eq('state_id', stateData.id);
    
    // Filter results locally for the specific year as a fallback to full detailed results table
    constituencyResults = rData?.flatMap(c => c.results.filter((r: any) => r.year === parseInt(year))) || [];
  }

  const isBihar2020 = slug === 'bihar' && electionType === 'assembly' && year === '2020';
  const stateName = stateData?.name || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const typeLabel = electionType === 'assembly' ? 'Legislative Assembly' : 'Lok Sabha';

  if (!election && !isBihar2020) {
    return (
      <main className="min-h-screen pt-20 bg-background text-foreground">
        <Navbar />
        <div className="py-40 text-center">
            <h2 className="font-serif text-6xl font-bold italic mb-8">Archival Sync in Progress</h2>
            <p className="editorial-text text-xl">The {year} {typeLabel} archive for {stateName} is being prepared.</p>
        </div>
        <Footer />
      </main>
    );
  }

  // Populate display data from Election expansion
  const displayData = {
    summary: {
      title: election?.title || (isBihar2020 ? BIHAR_2020_DATA.summary.title : `${stateName} ${year} Mandate`),
      tagline: election?.summary || (isBihar2020 ? BIHAR_2020_DATA.summary.tagline : "Historical record from the archive."),
      turnout: election?.turnout_percent ? `${election.turnout_percent}%` : (isBihar2020 ? BIHAR_2020_DATA.summary.turnout : "Pending"),
      totalSeats: election?.total_seats || (isBihar2020 ? BIHAR_2020_DATA.summary.totalSeats : 0),
      majorityMark: election?.majority_mark || (isBihar2020 ? BIHAR_2020_DATA.summary.majorityMark : 0),
      winner: election?.winner?.name || (isBihar2020 ? BIHAR_2020_DATA.summary.winner : "Opposition"),
      incumbent: election?.incumbent?.name || "Previous Administration",
      issues: election?.major_issues || [],
      coalition: election?.coalition_summary || (isBihar2020 ? "Detailed alliance dynamics documented in archive." : null),
      description: election?.summary || (isBihar2020 ? BIHAR_2020_DATA.summary.description : "Summary being prepared...")
    },
    powerBalance: isBihar2020 ? BIHAR_2020_DATA.powerBalance : [],
    keyPlayers: isBihar2020 ? BIHAR_2020_DATA.keyPlayers : [],
    stories: isBihar2020 ? BIHAR_2020_DATA.stories : []
  };

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />
      
      {/* SNAPSHOT HERO */}
      <section className="py-32 bg-white border-b border-border relative">
        <div className="premium-container">
           <Link href={`/states/${slug}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-12 hover:tracking-[0.2em] transition-all">
             <ArrowLeft className="w-4 h-4" /> State Hub
           </Link>
           
           <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-saffron">{stateName} • {year} • {typeLabel}</span>
              <div className="h-px w-24 bg-muted-saffron/20" />
           </div>

           <h1 className="font-serif text-8xl md:text-[10rem] font-bold tracking-tighter leading-none mb-12">
             {displayData.summary.title}<span className="text-muted-saffron italic">.</span>
           </h1>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-8">
                 <p className="editorial-text text-3xl font-serif italic text-muted leading-tight mb-12 max-w-3xl">
                   &quot;{displayData.summary.description}&quot;
                 </p>
              </div>
              <div className="md:col-span-4 p-8 border border-border rounded-[3rem] bg-card/30 space-y-6">
                 <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted block mb-2">Winner</span>
                    <span className="font-serif text-3xl font-bold italic text-muted-saffron">{displayData.summary.winner}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div>
                       <span className="text-[10px] uppercase font-bold tracking-widest text-muted block mb-1">Turnout</span>
                       <span className="text-2xl font-serif font-bold italic">{displayData.summary.turnout}</span>
                    </div>
                    <div>
                       <span className="text-[10px] uppercase font-bold tracking-widest text-muted block mb-1">Seats</span>
                       <span className="text-2xl font-serif font-bold italic">{displayData.summary.totalSeats}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* NEW: COALITION DYNAMICS & ISSUES */}
      <section className="py-24 border-b border-border bg-card">
         <div className="premium-container grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-12">
               <header>
                  <h2 className="font-serif text-4xl font-bold italic mb-2">Coalition Dynamics</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Alliances that shifted the mandate</p>
               </header>
               <div className="p-10 bg-white border border-border rounded-[3rem]">
                  <p className="editorial-text text-xl text-muted leading-relaxed italic">
                     {displayData.summary.coalition || "Alliance and pre-poll dynamics are being documented in the political archive."}
                  </p>
               </div>
            </div>
            
            <div className="space-y-12">
               <header>
                  <h2 className="font-serif text-4xl font-bold italic mb-2">Key Policy Issues</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">What the voters prioritized</p>
               </header>
               <div className="flex flex-wrap gap-4">
                  {displayData.summary.issues.map((issue: string, i: number) => (
                     <div key={i} className="px-8 py-4 bg-white border border-border rounded-[2rem] text-sm font-bold shadow-sm hover:border-muted-saffron transition-all">
                        {issue}
                     </div>
                  ))}
                  {displayData.summary.issues.length === 0 && (
                     <p className="text-muted italic">Identifying the core manifesto planks and social issues for this mandate...</p>
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* Flagship Bihar 2020 Seating Chart (Keep original visual) */}
      {displayData.powerBalance.length > 0 && (
         <section className="py-24 border-b border-border bg-white">
            <div className="premium-container">
               <header className="mb-16">
                  <h2 className="font-serif text-5xl font-bold italic text-center underline decoration-muted-saffron/20 decoration-8">The Mandate Breakdown.</h2>
               </header>
               <div className="space-y-12">
                  <div className="relative h-20 w-full bg-stone-100 rounded-full overflow-hidden flex border border-border">
                     {displayData.powerBalance.map((item: any, idx) => (
                       <div key={idx} className={`${item.color} h-full`} style={{ width: `${(item.seats / displayData.summary.totalSeats) * 100}%` }} />
                     ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {displayData.powerBalance.map((item: any, idx) => (
                        <div key={idx} className="p-8 border border-border rounded-[2.5rem] bg-card hover:bg-white transition-all">
                           <h4 className="font-serif text-2xl font-bold mb-4">{item.alliance} — {item.seats} Seats</h4>
                           <p className="text-xs text-muted uppercase tracking-widest">{item.parties.join(", ")}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>
      )}

      {/* STORIES LAYER */}
      <section className="py-24 bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic">Mandate Stories</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Significant insights from the ground</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {displayData.stories.map((story: any) => (
                  <div key={story.id} className="group p-10 bg-card border border-border rounded-[3.5rem] hover:bg-white transition-all hover:shadow-2xl">
                     <div className="w-12 h-12 bg-muted-saffron rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                        <story.icon className="w-6 h-6" />
                     </div>
                     <h4 className="font-serif text-3xl font-bold mb-4">{story.title}</h4>
                     <p className="text-muted italic leading-relaxed">&quot;{story.desc}&quot;</p>
                  </div>
               ))}
               {displayData.stories.length === 0 && (
                  <p className="text-muted italic col-span-3 text-center py-12 border border-dashed border-border rounded-[3rem]">
                     Political kisse and turning points for the {year} mandate are being curated.
                  </p>
               )}
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
