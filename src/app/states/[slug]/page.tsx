import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadershipCard from "@/components/LeadershipCard";
import ElectionCard from "@/components/ElectionCard";
import { ArrowLeft, BookOpen, Star, Zap, History, MoveRight, Users, Landmark, Globe, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Define local interfaces for the API response
interface StateData {
  state: any;
  elections: any[];
  leaders: any[];
  stories: any[];
}

import { statesData } from "@/data/indiaMapData";

async function getStateData(slug: string): Promise<StateData | any> {
  const mapState = statesData.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === slug);
  if (!mapState) return null;

  try {
    const { data: state, error: stateError } = await supabase
      .from('states')
      .select('*')
      .eq('slug', slug)
      .single();

    if (stateError || !state) {
      return {
        state: { name: mapState.name, slug, is_placeholder: true },
        elections: [], leaders: [], stories: [], eras: [], events: [], rivalries: [], constituencies: [], parties: []
      };
    }

    const { data: eras } = await supabase.from('political_eras').select('*').eq('state_id', state.id).order('start_year', { ascending: false });
    const { data: events } = await supabase.from('political_events').select('*').eq('state_id', state.id).order('year', { ascending: false });
    const { data: leaders } = await supabase.from('leaders').select('*, party:party_id(short_name, color)').eq('state_id', state.id).limit(6);
    const { data: elections } = await supabase.from('elections').select('*, outcome:winner_party_id(short_name, color)').eq('state_id', state.id).order('year', { ascending: false });
    const { data: stories } = await supabase.from('stories').select('*').eq('state_id', state.id);
    const { data: constituencies } = await supabase.from('constituencies').select('*').eq('state_id', state.id).limit(6);
    const { data: rivalries } = await supabase.from('rivalries').select('*').eq('state_id', state.id);
    const { data: parties } = await supabase.from('parties').select('*').limit(8); // Global but relevant

    return { 
      state, elections, leaders, stories, eras, events, rivalries, constituencies, parties
    };
  } catch (error) {
    console.error("Failed to fetch state data:", error);
    return null;
  }
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getStateData(slug);
  if (!data) notFound();

  const { state, elections, leaders, stories, eras, events, rivalries, constituencies, parties } = data;
  const stateName = state.name;

  const sections = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'assembly', name: 'Assembly Politics', icon: Shield },
    { id: 'parliament', name: 'Parliamentary Politics', icon: Landmark },
    { id: 'local', name: 'Local Body', icon: Globe },
    { id: 'eras', name: 'Major Eras', icon: History },
    { id: 'leaders', name: 'Influential Leaders', icon: Users },
    { id: 'parties', name: 'Major Parties', icon: Star },
    { id: 'rivalries', name: 'Alliances & Rivalries', icon: Zap },
    { id: 'constituencies', name: 'Famous Constituencies', icon: Landmark },
    { id: 'turning-points', name: 'Turning Points', icon: Zap },
    { id: 'stories', name: 'Political Stories', icon: BookOpen },
    { id: 'timeline', name: 'History Timeline', icon: History },
  ];

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />

      {/* Sticky Navigation Sidebar/Header for Deep Exploration */}
      <nav className="sticky top-20 z-50 bg-white/80 backdrop-blur-md border-b border-border py-4 overflow-x-auto no-scrollbar">
        <div className="premium-container flex gap-8 whitespace-nowrap px-4">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-colors flex items-center gap-2">
              <s.icon className="w-3 h-3" /> {s.name}
            </a>
          ))}
        </div>
      </nav>

      {/* 1. OVERVIEW SECTION */}
      <section id="overview" className="relative pt-20 pb-32 border-b border-border">
         <div className="premium-container">
            <Link href="/states" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-12 hover:tracking-[0.2em] transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Republic
            </Link>
            <h1 className="font-serif text-8xl md:text-[10rem] font-bold leading-none tracking-tighter mb-8">
               {stateName}<span className="text-muted-saffron italic">.</span>
            </h1>
            <p className="editorial-text text-3xl font-serif italic text-muted max-w-4xl leading-relaxed">
               {state.overview || `Exploring the legacy of power, social movements, and the democratic mandate in ${stateName}.`}
            </p>
         </div>
      </section>

      {/* 2 & 3. ASSEMBLY & PARLIAMENT HUB */}
      <section id="assembly" className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="p-12 bg-white border border-border rounded-[3rem] hover:shadow-xl transition-all group">
                  <header className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 bg-muted-saffron rounded-2xl flex items-center justify-center text-white">
                        <Shield className="w-6 h-6" />
                     </div>
                     <Link href={`/states/${slug}/assembly`} className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron hover:underline">Full Archive</Link>
                  </header>
                  <h2 className="font-serif text-4xl font-bold mb-4">Assembly Politics</h2>
                  <p className="text-muted mb-8 italic">&quot;The battle for the regional mandate.&quot;</p>
                  <div className="flex flex-wrap gap-3">
                     {elections.filter((e: any) => e.type === 'State').slice(0, 5).map((e: any) => (
                        <Link key={e.id} href={`/states/${slug}/assembly/${e.year}`} className="px-4 py-2 bg-muted-saffron/10 rounded-full text-xs font-bold text-muted-saffron hover:bg-muted-saffron hover:text-white transition-all">
                           {e.year}
                        </Link>
                     ))}
                  </div>
               </div>
               
               <div id="parliament" className="p-12 bg-foreground text-background border border-foreground rounded-[3rem] hover:shadow-xl transition-all group">
                  <header className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-foreground">
                        <Landmark className="w-6 h-6" />
                     </div>
                     <Link href={`/states/${slug}/parliament`} className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron hover:underline">Full Archive</Link>
                  </header>
                  <h2 className="font-serif text-4xl font-bold mb-4 text-white">Parliamentary Politics</h2>
                  <p className="text-white/60 mb-8 italic">&quot;The state&apos;s role in the national story.&quot;</p>
                  <div className="flex flex-wrap gap-3">
                     {elections.filter((e: any) => e.type === 'National').slice(0, 5).map((e: any) => (
                        <Link key={e.id} href={`/states/${slug}/parliament/${e.year}`} className="px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-white hover:bg-white hover:text-foreground transition-all">
                           {e.year}
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. MAJOR ERAS */}
      <section id="eras" className="py-24 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Political Eras</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Chronological periods of dominance</p>
            </header>
            <div className="space-y-12">
               {eras.map((era: any) => (
                  <div key={era.id} className="flex gap-8 md:gap-16 border-b border-border pb-12 last:border-0">
                     <div className="w-24 shrink-0 pt-2">
                        <span className="font-serif text-2xl font-bold text-muted-saffron">{era.start_year}{era.end_year ? `—${era.end_year}` : '+'}</span>
                     </div>
                     <div className="max-w-3xl">
                        <h3 className="font-serif text-3xl font-bold mb-4 italic">{era.title}</h3>
                        <p className="editorial-text text-xl text-muted leading-relaxed">{era.description}</p>
                     </div>
                  </div>
               ))}
               {eras.length === 0 && <p className="text-muted italic">No defined eras in current digital archive.</p>}
            </div>
         </div>
      </section>

      {/* 6. LEADERS */}
      <section id="leaders" className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <header className="mb-16 flex justify-between items-end">
               <div>
                  <h2 className="font-serif text-5xl font-bold italic mb-2">Influential Leaders</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Protagonists of the Republic</p>
               </div>
               <Link href="/leaders" className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-all flex items-center gap-2">
                 Leader Directory <MoveRight className="w-4 h-4" />
               </Link>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {leaders.map((leader: any) => (
                  <LeadershipCard key={leader.id} leader={leader} />
               ))}
            </div>
         </div>
      </section>

      {/* 10. TURNING POINTS */}
      <section id="turning-points" className="py-24 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Turning Points</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Events that redefined the narrative</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {events.map((event: any) => (
                  <div key={event.id} className="p-8 bg-card border border-border rounded-[2rem] hover:-translate-y-1 transition-all">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-4 block">{event.event_type} — {event.year}</span>
                     <h3 className="font-serif text-2xl font-bold mb-4">{event.title}</h3>
                     <p className="text-sm text-muted leading-relaxed italic">&quot;{event.description}&quot;</p>
                  </div>
               ))}
               {events.length === 0 && <p className="text-muted italic col-span-3">No major incidents recorded in this archive yet.</p>}
            </div>
         </div>
      </section>

      {/* 4. LOCAL BODY HUB */}
      <section id="local" className="py-24 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Local Body Politics</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Grassroots democratic mandates</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="p-10 border border-border rounded-[2.5rem] bg-card/50">
                  <h3 className="font-serif text-2xl font-bold mb-4">Municipal Corporations</h3>
                  <p className="text-sm text-muted mb-6 italic">Tracking the major urban hubs of {stateName}.</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron">Archive Coming Soon</span>
               </div>
               <div className="p-10 border border-border rounded-[2.5rem] bg-card/50">
                  <h3 className="font-serif text-2xl font-bold mb-4">Panchayati Raj</h3>
                  <p className="text-sm text-muted mb-6 italic">The cornerstone of rural administrative power.</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron">Archive Coming Soon</span>
               </div>
            </div>
         </div>
      </section>

      {/* 7. MAJOR PARTIES */}
      <section id="parties" className="py-24 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Major Parties</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">The vehicles of ideology and power</p>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {parties.map((party: any) => (
                  <div key={party.id} className="p-6 border border-border rounded-3xl flex flex-col items-center text-center hover:bg-card transition-colors">
                     <div className="w-16 h-16 rounded-full bg-border mb-4 flex items-center justify-center font-bold text-xl text-muted">
                        {party.short_name[0]}
                     </div>
                     <span className="font-bold text-xs uppercase tracking-widest">{party.short_name}</span>
                     <span className="text-[10px] text-muted truncate w-full">{party.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. RIVALRIES */}
      <section id="rivalries" className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Alliances & Rivalries</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">The dynamics that shift elections</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {rivalries.map((rivalry: any) => (
                  <div key={rivalry.id} className="p-10 bg-white border border-border rounded-[3rem]">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-4 block">{rivalry.rivalry_type} Rivalry</span>
                     <h3 className="font-serif text-3xl font-bold mb-4 italic">Clash of Titans</h3>
                     <p className="text-muted leading-relaxed italic">&quot;{rivalry.description}&quot;</p>
                  </div>
               ))}
               {rivalries.length === 0 && (
                  <div className="p-10 border border-dashed border-border rounded-[3rem] text-center italic text-muted">
                     Inter-party dynamics and leader rivalries are being documented...
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* 9. CONSTITUENCIES */}
      <section id="constituencies" className="py-24 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2">Iconic Constituencies</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Seats that tell a larger story</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {constituencies.map((c: any) => (
                  <div key={c.id} className="p-8 border border-border rounded-[2.5rem] hover:bg-card transition-all">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">{c.type} Seat</span>
                     <h3 className="font-serif text-2xl font-bold mb-4">{c.name}</h3>
                     <div className="flex items-center gap-2 text-xs text-muted-saffron font-bold uppercase tracking-tighter">
                        <Users className="w-3 h-3" /> Explore Micropolitics
                     </div>
                  </div>
               ))}
               {constituencies.length === 0 && <p className="text-muted italic">Identifying bastion seats for the archive...</p>}
            </div>
         </div>
      </section>

      {/* 11 & 12. STORIES & TIMELINE */}
      <section id="stories" className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <header className="mb-16 flex justify-between items-end">
               <div>
                  <h2 className="font-serif text-5xl font-bold italic mb-2">Archive Stories</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Political kisse and folklore</p>
               </div>
               <Link href="/stories" className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-all flex items-center gap-2">
                 More Kisse <MoveRight className="w-4 h-4" />
               </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {stories.map((story: any) => (
                  <Link key={story.id} href={`/stories/${story.id}`} className="group p-10 bg-white border border-border rounded-[3.5rem] flex gap-8 items-center hover:shadow-2xl transition-all">
                     <div className="w-24 h-24 bg-card rounded-3xl overflow-hidden shrink-0">
                        <img src={story.thumbnail} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                     </div>
                     <div>
                        <h4 className="font-serif text-2xl font-bold group-hover:text-muted-saffron transition-colors">{story.title}</h4>
                        <p className="text-xs text-muted line-clamp-1 italic">{story.excerpt}</p>
                     </div>
                  </Link>
               ))}
               {stories.length === 0 && <p className="text-muted italic col-span-2">Archive stories are being curated...</p>}
            </div>
         </div>
      </section>

      <section id="timeline" className="py-24 bg-foreground text-background">
         <div className="premium-container">
            <header className="mb-16">
               <h2 className="font-serif text-5xl font-bold italic mb-2 text-white">Full Political Timeline</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">From Independence to the Present</p>
            </header>
            <div className="relative border-l border-white/10 pl-16 space-y-16 py-8">
               {elections.slice(0, 10).map((e: any) => (
                  <div key={e.id} className="relative">
                     <div className="absolute -left-[4.5rem] w-4 h-4 rounded-full bg-muted-saffron border-4 border-foreground" />
                     <span className="text-2xl font-serif font-bold italic block mb-2">{e.year}</span>
                     <h4 className="text-lg font-bold uppercase tracking-widest text-white/80">{e.title}</h4>
                     <p className="text-sm text-white/40 italic">State mandate determined.</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}

