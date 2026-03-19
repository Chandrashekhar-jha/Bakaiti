import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InteractiveMap from "@/components/InteractiveMap";
import { ArrowRight, History, Zap, TrendingUp, Users2, Target, Globe, Shield, Landmark } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ContentSection from "@/components/home/ContentSection";
import StoryCard from "@/components/home/StoryCard";
import MajorCard from "@/components/home/MajorCard";
import { 
  editorialStories, 
  electionTypes, 
  rivalries, 
  turningPoints 
} from "@/data/editorialData";

async function getRecentArchiveData() {
  try {
    const { data: elections } = await supabase
      .from('elections')
      .select('*, state:states(name)')
      .order('created_at', { ascending: false })
      .limit(3);

    return { elections: elections || [] };
  } catch (error) {
    console.error("Archive Data Fetch Error:", error);
    return { elections: [] };
  }
}

export default async function Home() {
  const { elections } = await getRecentArchiveData();

  return (
    <main className="min-h-screen pt-20 bg-background overflow-x-hidden">
      <Navbar />
      
      {/* POWERFUL HERO SECTION */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
        <div className="premium-container space-y-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center">
            <div className="space-y-12 relative z-30 py-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-muted-saffron/10 border border-muted-saffron/20 text-muted-saffron text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-muted-saffron animate-pulse" />
                The Digital Archive of Indian Democracy
              </div>
              
              <h1 className="font-serif text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.85] text-foreground font-bold tracking-tighter">
                Explore the <br/> <span className="italic text-muted-saffron underline decoration-muted-saffron/10">Mandate.</span>
              </h1>
              
              <p className="editorial-text text-2xl lg:text-3xl max-w-xl font-serif italic text-muted leading-tight">
                &quot;From the corridors of the Lok Sabha to the panchayat grounds of the village — documenting the story of power since 1947.&quot;
              </p>
              
              <div className="flex flex-wrap gap-6 pt-6">
                <Link href="/states" className="px-10 py-5 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all flex items-center gap-4 group uppercase text-xs tracking-widest text-center justify-center min-w-[240px] shadow-xl">
                  Historical Archives <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/explore" className="px-10 py-5 bg-white border border-border text-foreground font-bold rounded-full hover:border-muted-saffron transition-all flex items-center gap-4 group uppercase text-xs tracking-widest text-center justify-center min-w-[200px] shadow-sm">
                  Interactive Discovery
                </Link>
              </div>
              
              <div className="pt-12 flex items-center gap-8 border-t border-border mt-12 w-fit">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Coverage</span>
                  <span className="font-serif text-2xl font-bold italic">28 States / 8 UTs</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Archived Records</span>
                  <span className="font-serif text-2xl font-bold italic">75 Years</span>
                </div>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end items-center h-full">
              <div className="relative w-full max-w-[650px] lg:scale-105 xl:scale-110">
                {/* Visual backplate */}
                <div className="absolute inset-0 bg-card/20 rounded-[4rem] border border-border/50 scale-[1.1] z-0" />
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-muted-saffron/5 rounded-full blur-[120px]" />
                <div className="relative z-10 p-8">
                  <InteractiveMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* START WITH BIHAR - The Real Hook */}
      <section className="py-40 bg-foreground text-background overflow-hidden relative border-y border-white/5">
         <div className="absolute top-0 right-0 w-[60%] h-full bg-muted-saffron/5 skew-x-12 translate-x-1/3" />
         <div className="premium-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
               <div className="lg:col-span-12 mb-16">
                  <div className="inline-flex items-center gap-3 text-muted-saffron text-[10px] font-bold uppercase tracking-[0.4em] mb-8">
                     <History className="w-4 h-4" />
                     Recommended Entry Point
                  </div>
                  <h2 className="font-serif text-8xl md:text-9xl font-bold leading-none tracking-tighter text-white mb-12">
                    Begin the Journey in <span className="text-muted-saffron italic">Bihar.</span>
                  </h2>
               </div>
               
               <div className="lg:col-span-5 space-y-10">
                  <p className="editorial-text text-3xl text-white/70 font-serif italic leading-relaxed">
                     &quot;Known as the cradle of revolutionary mandates, Bihar offers our most dense and multi-layered political archive. From social justice movements to the first non-congress earthquake.&quot;
                  </p>
                  <Link href="/states/bihar" className="px-12 py-6 bg-muted-saffron text-white font-bold rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-5 group uppercase text-xs tracking-[0.2em] w-fit shadow-2xl">
                     Enter State Archive <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
               
               <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-md group hover:bg-white/10 transition-all cursor-pointer">
                     <h4 className="text-muted-saffron font-bold text-[10px] uppercase tracking-widest mb-6">Archive Feature</h4>
                     <h3 className="font-serif text-3xl font-bold mb-6 text-white tracking-tight">The social revolution <br/> of 1990.</h3>
                     <p className="text-sm text-white/40 mb-10 italic leading-relaxed">&quot;Explore the shift that redefined the subcontinental political identity forever.&quot;</p>
                     <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/20 group-hover:text-muted-saffron transition-colors">
                        <span>Explore Mandate</span>
                        <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
                  <div className="p-12 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-md group hover:bg-white/10 transition-all cursor-pointer mt-0 md:mt-12">
                     <h4 className="text-muted-saffron font-bold text-[10px] uppercase tracking-widest mb-6">Leader Profile</h4>
                     <h3 className="font-serif text-3xl font-bold mb-6 text-white tracking-tight">Karpoori Thakur <br/> (The Architect)</h3>
                     <p className="text-sm text-white/40 mb-10 italic leading-relaxed">&quot;The socialist visionary whose reservation model still shapes the Hindi belt.&quot;</p>
                     <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/20 group-hover:text-muted-saffron transition-colors">
                        <span>View Biography</span>
                        <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* EXPLORE ELECTION TYPES - New Structure */}
      <section className="py-40 bg-white">
        <div className="premium-container">
          <header className="max-w-3xl mb-24">
            <h2 className="font-serif text-7xl font-bold mb-8 tracking-tighter">The Layers of <span className="italic text-muted-saffron">Power.</span></h2>
            <p className="editorial-text text-2xl text-muted font-serif italic">From the grand mandates of the Lok Sabha to the localized struggles of the Panchayat.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Assembly Card */}
            <Link href="/elections/state" className="group p-12 bg-card border border-border rounded-[4rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 rounded-3xl bg-muted-saffron text-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="w-8 h-8" />
               </div>
               <h3 className="font-serif text-4xl font-bold mb-6">State Assembly</h3>
               <p className="text-muted italic leading-relaxed mb-10 line-clamp-2">Exploring regional resilience and the mandates that shape our states.</p>
               <div className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron flex items-center gap-3">
                 Browse Archives <ArrowRight className="w-4 h-4" />
               </div>
            </Link>

            {/* Parliament Card */}
            <Link href="/elections/general" className="group p-12 bg-foreground text-background border border-foreground rounded-[4rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 rounded-3xl bg-white text-foreground flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-lg">
                  <Landmark className="w-8 h-8" />
               </div>
               <h3 className="font-serif text-4xl font-bold mb-6 text-white">Parliament (LS)</h3>
               <p className="text-white/50 italic leading-relaxed mb-10 line-clamp-2">The national mandate. Explore how India votes to choose its prime servant.</p>
               <div className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron flex items-center gap-3">
                 Browse Archives <ArrowRight className="w-4 h-4" />
               </div>
            </Link>

            {/* Local Body Card */}
            <Link href="/elections/municipal" className="group p-12 bg-card border border-border rounded-[4rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
               <div className="w-16 h-16 rounded-3xl bg-slate-800 text-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-lg">
                  <Globe className="w-8 h-8" />
               </div>
               <h3 className="font-serif text-4xl font-bold mb-6">Local Governance</h3>
               <p className="text-muted italic leading-relaxed mb-10 line-clamp-2">Panchayat, Municipal and Ward level power battles at the grassroots.</p>
               <div className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron flex items-center gap-3">
                 Browse Archives <ArrowRight className="w-4 h-4" />
               </div>
            </Link>
          </div>
        </div>
      </section>

      {/* POLITICAL KISSE - Selective */}
      <section className="py-40 bg-card border-y border-border overflow-hidden">
        <div className="premium-container">
          <header className="flex flex-col md:flex-row justify-between items-baseline gap-8 mb-24">
             <div className="max-w-3xl">
                <h2 className="font-serif text-7xl font-bold mb-8 tracking-tighter italic">Political Kisse (The Stories)</h2>
                <p className="editorial-text text-2xl text-muted font-serif italic max-w-xl">Curated narratives of betrayal, kingmakers, and the resort politics that defined history.</p>
             </div>
             <Link href="/stories" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-muted hover:text-muted-saffron transition-all border-b border-muted group-hover:border-muted-saffron pb-1">
                Browse Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {editorialStories.slice(0, 3).map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </div>
      </section>

      {/* THE TIMELINE ENTRY POINT */}
      <section className="py-40 bg-white">
        <div className="premium-container">
           <div className="relative group overflow-hidden rounded-[5rem] bg-stone-50 border border-border p-16 md:p-32 text-center flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-muted-saffron/20" />
              <History className="w-20 h-20 text-muted-saffron mb-10 opacity-30 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
              <h2 className="font-serif text-7xl md:text-8xl font-bold mb-10 tracking-tighter">The Turning Points.</h2>
              <p className="editorial-text text-3xl text-muted font-serif italic max-w-3xl mb-16 leading-tight">
                &quot;Chronological journey through the seismic shifts that proved Indian democracy&apos;s resilience.&quot;
              </p>
              <Link href="/timeline" className="px-12 py-6 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all flex items-center gap-5 group uppercase text-[10px] tracking-[0.3em] shadow-xl">
                 Open The Master Timeline <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              {/* Background Accents */}
              <div className="absolute top-1/2 left-20 -translate-y-1/2 font-serif text-[20rem] font-bold text-foreground/[0.02] pointer-events-none select-none italic">1947</div>
              <div className="absolute top-1/2 right-20 -translate-y-1/2 font-serif text-[20rem] font-bold text-foreground/[0.02] pointer-events-none select-none italic">2024</div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

