import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, ArrowRight, Star, History } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Simple utility if not already present, but usually we use a cn utility
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { statesData } from "@/data/indiaMapData";

async function getStates() {
  const { data: dbStates } = await supabase.from('states').select('*').order('name');
  
  // Create a base list from our map data to ensure all regions are present
  const allStates = statesData.map(s => {
    const slug = s.name.toLowerCase().replace(/\s+/g, '-');
    const existing = dbStates?.find(db => db.slug === slug);
    
    return existing || {
      id: s.id,
      name: s.name,
      slug: slug,
      national_influence: "Archival history for this region is currently being synthesized.",
      is_placeholder: true
    };
  });

  // Sort by name
  return allStates.sort((a, b) => a.name.localeCompare(b.name));
}

export default async function StatesPage() {
  const states = await getStates();
  const bihar = states.find(s => s.slug === 'bihar');
  const otherStates = states.filter(s => s.slug !== 'bihar');

  return (
    <main className="min-h-screen pt-20 bg-background">
      <Navbar />
      
      <section className="py-32 bg-white border-b border-border relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
             
        <div className="premium-container relative z-10">
          <div className="max-w-4xl">
            <nav className="flex gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-saffron mb-10 items-center">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-muted">Regional Archives</span>
            </nav>
            <h1 className="font-serif text-8xl md:text-[10rem] font-bold mb-10 tracking-tighter leading-[0.85]">
              The Republic <br/> of <span className="italic text-muted-saffron underline decoration-muted-saffron/10">States.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-3xl leading-tight">
              &quot;Exploring the cartography of power across the subcontinent. From the Hindi heartland to the southern peninsulas — every region tells a story of the mandate.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Featured State: Bihar */}
      {bihar && (
        <section className="py-24 bg-card border-b border-border">
          <div className="premium-container">
             <div className="flex items-center gap-4 mb-12">
                <Star className="w-6 h-6 text-muted-saffron fill-muted-saffron" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Featured Archive</h2>
             </div>
             
             <Link href={`/states/bihar`} className="group block">
                <div className="relative overflow-hidden rounded-[4rem] bg-foreground text-background p-16 md:p-24 shadow-2xl transition-all duration-700 hover:scale-[1.01]">
                   {/* Background Image Overlay */}
                   <div className="absolute inset-0 opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <img 
                        src="https://images.unsplash.com/photo-1599424423751-6872583870f7?auto=format&fit=crop&q=80&w=2000" 
                        alt="Bihar Politics" 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
                   
                   <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                         <span className="text-muted-saffron font-serif italic text-3xl mb-4 block">The Most Complete Archive</span>
                         <h3 className="font-serif text-7xl md:text-8xl font-bold mb-8 tracking-tighter text-white">Bihar.</h3>
                         <p className="text-white/60 text-xl font-serif italic leading-relaxed max-w-md mb-12">
                           &quot;The land where Mandal met Kamandal. Bihar offers our most complex, verified, and multi-layered political history.&quot;
                         </p>
                         <div className="inline-flex items-center gap-4 px-8 py-4 bg-muted-saffron text-white rounded-full font-bold uppercase text-[10px] tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                            Enter Bihar Deep-Dive <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                         </div>
                      </div>
                      <div className="hidden lg:grid grid-cols-2 gap-8 opacity-40 group-hover:opacity-100 transition-opacity">
                         <div className="p-8 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <span className="text-[9px] block mb-2 uppercase tracking-widest text-muted-saffron">Latest Update</span>
                            <span className="text-xl font-serif font-bold text-white italic">2020 Mandate</span>
                         </div>
                         <div className="p-8 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <span className="text-[9px] block mb-2 uppercase tracking-widest text-muted-saffron">Archived Leaders</span>
                            <span className="text-xl font-serif font-bold text-white italic">120+ Profiles</span>
                         </div>
                         <div className="p-8 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <span className="text-[9px] block mb-2 uppercase tracking-widest text-muted-saffron">Constituencies</span>
                            <span className="text-xl font-serif font-bold text-white italic">243 Verified</span>
                         </div>
                         <div className="p-8 border border-white/10 rounded-3xl backdrop-blur-sm">
                            <span className="text-[9px] block mb-2 uppercase tracking-widest text-muted-saffron">Status</span>
                            <span className="text-xl font-serif font-bold text-white italic">Full Sync</span>
                         </div>
                      </div>
                   </div>
                </div>
             </Link>
          </div>
        </section>
      )}

      {/* States List */}
      <section className="py-32">
        <div className="premium-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {otherStates.map((state: any) => (
              <Link key={state.id} href={`/states/${state.slug}`} className="group">
                <div className="p-12 bg-white border border-border rounded-[4rem] hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full hover:-translate-y-2 duration-500">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-muted-saffron/5 flex items-center justify-center text-muted-saffron group-hover:bg-muted-saffron group-hover:text-white transition-all shadow-sm">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <span className={clsx(
                      "text-[9px] font-bold uppercase tracking-widest border px-4 py-1.5 rounded-full transition-colors",
                      state.slug === 'uttar-pradesh' || state.slug === 'bihar' 
                        ? "text-muted-saffron border-muted-saffron/20 bg-muted-saffron/5 group-hover:bg-white" 
                        : "text-muted border-border bg-card group-hover:bg-white"
                    )}>
                      {state.slug === 'uttar-pradesh' || state.slug === 'bihar' ? 'Archive High-Depth' : 'Archive Synchronizing'}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-5xl font-bold mb-6 group-hover:text-muted-saffron transition-colors tracking-tighter line-clamp-1">
                    {state.name}
                  </h3>
                  
                  <p className="editorial-text text-lg text-muted mb-10 line-clamp-2 italic leading-snug">
                    {state.national_influence || `Documenting the political story of ${state.name}.`}
                  </p>
                  
                  <div className="mt-auto pt-8 border-t border-border flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-saffron group-hover:gap-5 transition-all">
                    {state.is_placeholder ? 'Begin Archive Sync' : 'Enter Archive'} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

