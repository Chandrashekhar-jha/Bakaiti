import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, TrendingUp, History, Users, Award, ShieldCheck, Zap, BarChart, Globe } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function PartyProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // 1. Fetch Party Data
  const { data: party } = await supabase
    .from('parties')
    .select('*')
    .eq('short_name', slug.toUpperCase())
    .single();

  if (!party) {
    return (
      <main className="min-h-screen pt-20 bg-background text-foreground">
        <Navbar />
        <div className="py-40 text-center">
            <h2 className="font-serif text-6xl font-bold italic mb-8">Digitizing...</h2>
            <p className="editorial-text text-xl">The historical archive for this party is being synchronized.</p>
        </div>
        <Footer />
      </main>
    );
  }

  // 2. Fetch Prominent Leaders for this party
  const { data: leaders } = await supabase
    .from('leaders')
    .select('id, name, slug, summary')
    .eq('party_id', party.id)
    .limit(4);

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />
      
      {/* 1. PARTY HERO: The Brand Profile */}
      <section className="py-32 bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
        <div className="premium-container relative z-10">
          <div className="flex flex-col md:flex-row gap-20 items-center">
             {/* Symbol Simulation */}
             <div className="w-64 h-64 bg-stone-100 border border-border rounded-full flex items-center justify-center p-8 shrink-0 hover:rotate-12 transition-transform shadow-xl">
                <span className="font-serif text-[4rem] font-bold text-muted-saffron">{party.short_name[0]}</span>
             </div>
             
             <div className="text-center md:text-left">
                <Link href="/parties" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-16 hover:gap-4 transition-all">
                   <ArrowLeft className="w-4 h-4" /> The Political Spectrum
                </Link>
                
                <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-saffron">National Political Entity</span>
                   <div className="h-px w-24 bg-muted-saffron/20" />
                   <ShieldCheck className="w-4 h-4 text-muted-saffron" />
                </div>

                <h1 className="font-serif text-[6rem] md:text-[8rem] font-bold tracking-tighter leading-none mb-4">
                   {party.name}<span className="text-muted-saffron italic">.</span>
                </h1>
                
                <h4 className="text-2xl font-serif italic text-muted max-w-2xl mx-auto md:mx-0">
                   &quot;{party.ideology || "A defining ideological force that has shaped the regional and national democratic discourse across multiple mandates."}&quot;
                </h4>
             </div>
          </div>
        </div>
      </section>

      {/* 2. PERFORMANCE ANALYTICS DASHBOARD */}
      <section className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <header className="mb-16">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-4 italic">Performance Analytics</h3>
               <h2 className="font-serif text-5xl font-bold tracking-tighter italic text-center underline decoration-muted-saffron/20 decoration-8">Mandate History.</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="p-12 bg-white border border-border rounded-[3.5rem] text-center shadow-lg group hover:-translate-y-2 transition-transform">
                  <TrendingUp className="w-12 h-12 text-muted-saffron mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-4">Highest Seat Count</span>
                  <span className="text-6xl font-serif font-bold italic">283</span>
                  <p className="text-[10px] uppercase font-bold text-red-600 mt-4 tracking-tighter">Lok Sabha 2014</p>
               </div>
               <div className="p-12 bg-white border border-border rounded-[3.5rem] text-center shadow-lg group hover:-translate-y-2 transition-transform">
                  <History className="w-12 h-12 text-muted-saffron mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-4">Year Founded</span>
                  <span className="text-6xl font-serif font-bold italic">{party.founding_year || 1980}</span>
               </div>
               <div className="p-12 bg-white border border-border rounded-[3.5rem] text-center shadow-lg group hover:-translate-y-2 transition-transform">
                  <Users className="w-12 h-12 text-muted-saffron mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-4">Cadre Strength</span>
                  <span className="text-6xl font-serif font-bold italic">100M+</span>
               </div>
            </div>
         </div>
      </section>

      {/* 3. IDEOLOGICAL PILLARS */}
      <section className="py-32 border-b border-border bg-white overflow-hidden">
         <div className="premium-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <header>
                     <h2 className="font-serif text-6xl font-bold tracking-tighter italic">Foundational Pillars</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted">The core ideology of {party.short_name}</p>
                  </header>
                  <div className="space-y-6">
                     <div className="p-10 bg-card border border-border rounded-[3rem] hover:bg-muted-saffron hover:text-white transition-all group">
                        <Zap className="w-8 h-8 mb-4 group-hover:text-white" />
                        <h4 className="font-serif text-3xl font-bold mb-2 italic">Policy Plank 1</h4>
                        <p className="editorial-text italic leading-relaxed opacity-60 group-hover:opacity-100">Nationalist resurgence and infrastructure centralism, focusing on core development goals.</p>
                     </div>
                     <div className="p-10 bg-card border border-border rounded-[3rem] hover:bg-muted-saffron hover:text-white transition-all group">
                        <Globe className="w-8 h-8 mb-4 group-hover:text-white" />
                        <h4 className="font-serif text-3xl font-bold mb-2 italic">Policy Plank 2</h4>
                        <p className="editorial-text italic leading-relaxed opacity-60 group-hover:opacity-100">Digital governance and economic liberalization, driving regional growth stories.</p>
                     </div>
                  </div>
               </div>
               
               <div className="relative p-12 bg-card rounded-[4rem] border border-border shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-muted-saffron/10 -m-10 rounded-full blur-3xl" />
                  <header className="mb-12">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-4 italic">Prominent Faces</h3>
                     <h2 className="font-serif text-5xl font-bold tracking-tighter italic">The Board.</h2>
                  </header>
                  <div className="space-y-8">
                     {leaders && leaders.map((leader: any) => (
                        <Link key={leader.id} href={`/leaders/${leader.slug}`} className="flex items-center gap-6 group">
                           <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border border-border group-hover:border-muted-saffron transition-all grayscale group-hover:grayscale-0">
                              <span className="font-bold text-muted text-xl">{leader.name[0]}</span>
                           </div>
                           <div className="pb-4 border-b border-border/50 flex-grow">
                              <h4 className="font-serif text-2xl font-bold group-hover:text-muted-saffron transition-all">{leader.name}</h4>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted italic">Profile Active</p>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
