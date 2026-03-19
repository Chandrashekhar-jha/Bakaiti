import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import YearArchive from "@/components/YearArchive";
import { ArrowLeft, Landmark, History } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

async function getStateAssemblyData(slug: string) {
  const { data: state } = await supabase.from('states').select('*').eq('slug', slug).single();
  if (!state) return { state: null, years: [] };

  const { data: elections } = await supabase
    .from('elections')
    .select('*, outcome:winner_party_id(short_name)')
    .eq('state_id', state.id)
    .eq('election_type', 'assembly')
    .order('year', { ascending: false });
  
  return {
    state,
    years: elections?.map(e => ({
      year: e.year,
      title: e.title || `${e.year} Assembly Mandate`,
      winner: e.outcome?.short_name || "Opposition",
      status: "verified", // We consider DB records as verified
      desc: e.summary || ""
    })) || []
  };
}

export default async function StateAssemblyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { state, years } = await getStateAssemblyData(slug);

  if (!state) return <div>State not found</div>;

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />
      
      {/* Editorial Header */}
      <section className="py-32 bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
        <div className="premium-container relative z-10">
          <div className="max-w-4xl">
            <Link 
              href={`/states/${slug}`}
              className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-saffron mb-12 hover:gap-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {state.name} Hub
            </Link>
            
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-muted-saffron text-white flex items-center justify-center shadow-lg">
                  <Landmark className="w-6 h-6" />
               </div>
               <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Archival Archive</h2>
            </div>
            
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-10 tracking-tighter leading-none">
              Legislative <br/> <span className="italic text-muted-saffron">Assembly.</span>
            </h1>
            
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-tight">
              &quot;Exploring the mandates that shaped the local destiny of {state.name}. From the first assembly of the republic to the modern digital mandate.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Year Grid Section */}
      <section className="py-32">
        <div className="premium-container">
           {years.length > 0 ? (
             <div className="space-y-24">
               <header className="flex justify-between items-end border-b border-border pb-12">
                  <div className="flex items-center gap-3">
                     <History className="w-5 h-5 text-muted-saffron" />
                     <h3 className="font-serif text-4xl font-bold tracking-tight italic">Chronological Records</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Showing {years.length} verified mandates
                  </span>
               </header>
               <YearArchive stateName={state.name} stateSlug={slug} electionType="assembly" years={years as any} />
             </div>
           ) : (
             <div className="py-40 text-center flex flex-col items-center max-w-2xl mx-auto">
                <div className="w-24 h-24 rounded-full bg-card/40 border-2 border-border border-dashed flex items-center justify-center mb-10 opacity-30">
                   <Landmark className="w-10 h-10 text-muted-saffron" />
                </div>
                <h2 className="font-serif text-5xl font-bold mb-8 tracking-tighter italic text-muted">Archival Digitization.</h2>
                <p className="editorial-text text-xl text-muted/60 font-serif italic leading-relaxed">
                  We are currently synchronizing the {state.name} assembly records with our master database. 
                </p>
                <Link href={`/states/${slug}`} className="mt-12 px-10 py-4 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all uppercase text-[10px] tracking-widest shadow-lg flex items-center gap-3">
                   Return to Hub <ArrowLeft className="w-4 h-4 -scale-x-100" />
                </Link>
             </div>
           )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
