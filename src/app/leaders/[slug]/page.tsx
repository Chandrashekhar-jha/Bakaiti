import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Star, TrendingUp, History, ShieldCheck, Award, Users, Zap, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function LeaderProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // 1. Fetch Leader Data from expanded schema
  const { data: leader } = await supabase
    .from('leaders')
    .select('*, party:party_id(name, short_name, color)')
    .eq('slug', slug)
    .single();

  if (!leader) {
    return (
      <main className="min-h-screen pt-20 bg-background text-foreground">
        <Navbar />
        <div className="py-40 text-center">
            <h2 className="font-serif text-6xl font-bold italic mb-8">Digitizing...</h2>
            <p className="editorial-text text-xl">The political profile for this leader is being synchronized from the archives.</p>
        </div>
        <Footer />
      </main>
    );
  }

  // 2. Fetch Mentorships & Rivalries
  const { data: mentorships } = await supabase.from('mentorships').select('*').or(`mentor_id.eq.${leader.id},protege_id.eq.${leader.id}`);
  const { data: rivalries } = await supabase.from('rivalries').select('*').or(`leader_1_id.eq.${leader.id},leader_2_id.eq.${leader.id}`);

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />
      
      {/* 1. LEAD HERO: The Kundli Intro */}
      <section className="py-32 bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
        <div className="premium-container relative z-10">
          <div className="flex flex-col md:flex-row gap-20 items-end">
             {/* Portrait Simulation */}
             <div className="w-80 h-[500px] bg-stone-100 border border-border rounded-[4rem] overflow-hidden transition-all shadow-2xl shrink-0 group relative">
                {leader.photo_url ? (
                   <img 
                      src={leader.photo_url} 
                      alt={leader.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                   />
                ) : (
                   <div className="w-full h-full bg-foreground flex items-center justify-center text-background">
                      <User className="w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                   </div>
                )}
             </div>
             
             <div className="flex-grow pb-8">
                <Link href="/leaders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-16 hover:gap-4 transition-all">
                   <ArrowLeft className="w-4 h-4" /> Back to Board of Leaders
                </Link>
                
                <div className="flex items-center gap-4 mb-8">
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-saffron">{leader.party?.short_name || 'Independent'}</span>
                   <div className="h-px w-24 bg-muted-saffron/20" />
                   <ShieldCheck className="w-4 h-4 text-muted-saffron" />
                </div>

                <h1 className="font-serif text-[7rem] md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-12">
                   {leader.name}<span className="text-muted-saffron italic">.</span>
                </h1>
                
                <p className="editorial-text text-3xl font-serif italic text-muted leading-tight max-w-3xl">
                   &quot;{leader.summary || "A defining force in the state&apos;s political history, whose career arc influenced the regional mandate across decades."}&quot;
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & CAREER DASHBOARD */}
      <section className="py-24 border-b border-border bg-card">
         <div className="premium-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="p-10 bg-white border border-border rounded-[3rem] text-center">
                  <Award className="w-8 h-8 text-muted-saffron mx-auto mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">Wins</span>
                  <span className="text-5xl font-serif font-bold italic">7</span>
               </div>
               <div className="p-10 bg-white border border-border rounded-[3rem] text-center">
                  <History className="w-8 h-8 text-muted-saffron mx-auto mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">Years Active</span>
                  <span className="text-5xl font-serif font-bold italic">35+</span>
               </div>
               <div className="p-10 bg-white border border-border rounded-[3rem] text-center">
                  <TrendingUp className="w-8 h-8 text-muted-saffron mx-auto mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">Avg Margin</span>
                  <span className="text-5xl font-serif font-bold italic">18%</span>
               </div>
               <div className="p-10 bg-white border border-border rounded-[3rem] text-center">
                  <Star className="w-8 h-8 text-muted-saffron mx-auto mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">Legacy Index</span>
                  <span className="text-5xl font-serif font-bold italic">9.4</span>
               </div>
            </div>
         </div>
      </section>

      {/* 3. THE CAREER TIMELINE */}
      <section className="py-32 border-b border-border bg-white">
         <div className="premium-container">
            <header className="mb-24 flex justify-between items-end">
               <div>
                  <h2 className="font-serif text-6xl font-bold tracking-tighter italic">Political Trajectory</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">The ascent of {leader.name.split(' ')[0]}</p>
               </div>
               <div className="h-px flex-grow mx-16 bg-border mb-4 opacity-50" />
               <Briefcase className="w-12 h-12 text-muted-saffron opacity-20" />
            </header>

            <div className="space-y-12">
               {/* Career Item Simulation */}
               {[
                  { year: "1985", role: "First Assembly Entry", constituency: "Regional Hub", desc: "Won as a breakthrough candidate against incumbent." },
                  { year: "1995", role: "Cabinet Appointment", constituency: "State Level", desc: "Headed the Ministry of Irrigation, implementing major reforms." },
                  { year: "2010", role: "Chief Ministerial Tenure", constituency: "Universal Mandate", desc: "Leading the state through a period of double-digit growth." }
               ].map((item, idx) => (
                  <div key={idx} className="flex gap-12 group">
                     <div className="w-32 shrink-0">
                        <span className="font-serif text-3xl font-bold italic text-muted-saffron opacity-40 group-hover:opacity-100 transition-opacity">{item.year}</span>
                     </div>
                     <div className="flex-grow p-10 bg-card/10 border border-border/50 rounded-[3rem] hover:bg-card hover:border-border transition-all">
                        <h4 className="font-serif text-3xl font-bold mb-2">{item.role}</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">{item.constituency}</p>
                        <p className="editorial-text text-lg text-muted italic leading-relaxed">&quot;{item.desc}&quot;</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. NETWORKS: Mentors & Rivals */}
      <section className="py-32 bg-stone-50 overflow-hidden">
         <div className="premium-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-8 italic">Lineage & Mentorship</h3>
                  <div className="space-y-8">
                     {mentorships && mentorships.length > 0 ? mentorships.map((m: any, idx: number) => (
                        <div key={idx} className="p-8 bg-white border border-border rounded-[2.5rem] flex items-center gap-6">
                           <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center"><User className="w-6 h-6 text-muted" /></div>
                           <div>
                              <h4 className="font-serif text-2xl font-bold">Historical Figure</h4>
                              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-saffron">The Mentor</p>
                           </div>
                        </div>
                     )) : (
                        <p className="text-muted italic">Political lineage and mentorship ties are currently being mapped...</p>
                     )}
                  </div>
               </div>
               
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-8 italic">Clash of Ambitions</h3>
                  <div className="space-y-8">
                     {rivalries && rivalries.length > 0 ? rivalries.map((r: any, idx: number) => (
                        <div key={idx} className="p-8 bg-white border border-border rounded-[2.5rem] flex items-center justify-center gap-8 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center"><User className="w-6 h-6 text-muted" /></div>
                              <span className="text-[8px] font-bold mt-2 uppercase tracking-tighter">{leader.name.split(' ')[0]}</span>
                           </div>
                           <Zap className="w-8 h-8 text-muted-saffron animate-pulse" />
                           <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center"><User className="w-6 h-6 text-muted" /></div>
                              <span className="text-[8px] font-bold mt-2 uppercase tracking-tighter">The Rival</span>
                           </div>
                        </div>
                     )) : (
                        <p className="text-muted italic">Identifying the primary ideological and individual rivalries for this profile...</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}
