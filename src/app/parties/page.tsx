import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Filter, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function PartiesPage() {
  const { data: parties } = await supabase
    .from('parties')
    .select('*')
    .order('name', { ascending: true });

  return (
    <main className="min-h-screen pt-20 bg-background text-foreground">
      <Navbar />
      
      <section className="py-32 bg-white border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
        <div className="premium-container relative z-10">
          <div className="max-w-4xl">
            <nav className="flex gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-saffron mb-10 items-center">
              <Link href="/" className="hover:text-black">Home</Link>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-muted">Archives</span>
            </nav>
            <h1 className="font-serif text-8xl md:text-[10rem] font-bold mb-10 tracking-tighter leading-[0.85]">
              The <br/> <span className="italic text-muted-saffron underline decoration-muted-saffron/10">Architecture.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-3xl leading-tight">
              &quot;The ideological vehicles that define Indian democracy. From legacy national parties to the regional forces of the federalist spirit.&quot;
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mt-16 max-w-2xl">
               <div className="flex-grow relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-saffron w-5 h-5 group-hover:scale-110 transition-transform" />
                  <input 
                    type="text" 
                    placeholder="Search by name, symbol, or ideology..." 
                    className="w-full pl-16 pr-8 py-5 bg-stone-100 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-muted-saffron/20 font-serif italic"
                  />
               </div>
               <button className="px-10 py-5 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest shadow-xl">
                  <Filter className="w-4 h-4" /> Filter Archive
               </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="premium-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {parties?.map((party) => (
              <Link key={party.id} href={`/parties/${party.short_name.toLowerCase()}`} className="group">
                  <div className="p-10 bg-white border border-border rounded-[3.5rem] hover:shadow-2xl transition-all hover:bg-card flex flex-col h-full">
                     <div className="w-20 h-20 rounded-full bg-stone-100 border border-border mb-8 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <span className="font-serif text-3xl font-bold text-muted-saffron">{party.short_name[0]}</span>
                     </div>
                     <div className="flex items-center gap-3 mb-4">
                        <h4 className="font-serif text-3xl font-bold group-hover:text-muted-saffron transition-colors">{party.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-muted-saffron/30" />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-8 italic">{party.short_name} • Founded {party.founding_year || "Unknown"}</p>
                     <div className="mt-auto pt-8 border-t border-border flex justify-between items-center">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-muted-saffron">Detailed History</span>
                        <Zap className="w-4 h-4 text-muted-saffron/20 group-hover:text-muted-saffron transition-colors" />
                     </div>
                  </div>
              </Link>
            ))}
            
            <div className="p-12 border-2 border-border border-dashed rounded-[4rem] bg-card/40 flex flex-col items-center justify-center text-center opacity-70 group hover:bg-white transition-all">
               <h4 className="font-serif text-3xl font-bold text-muted mb-4 tracking-tight">Party Archive Syncing</h4>
               <p className="text-[10px] text-muted uppercase tracking-[0.3em] font-bold max-w-[200px] leading-relaxed">Mapping ideological shifts and historical symbols</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
