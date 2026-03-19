import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadershipCard from "@/components/LeadershipCard";
import { Search, UserPlus, Filter } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const FEATURED_LEADERS = [
  { name: "Nitish Kumar", role: "Chief Minister (JDU)", state: "Bihar", stats: "7-time CM", image: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=200", slug: "nitish-kumar" },
  { name: "Lalu Prasad Yadav", role: "Mass Leader (RJD)", state: "Bihar", stats: "Social Reformer", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=200", slug: "lalu-prasad" },
  { name: "Jayaprakash Narayan", role: "Revolutionary", state: "Bihar", stats: "JP Movement", image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?auto=format&fit=crop&q=80&w=200", slug: "jayaprakash-narayan" },
  { name: "Yogi Adityanath", role: "Chief Minister (BJP)", state: "Uttar Pradesh", stats: "Hindutva Icon", image: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=200", slug: "yogi-adityanath" },
  { name: "Mamata Banerjee", role: "Chief Minister (TMC)", state: "West Bengal", stats: "Grassroots Fighter", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=200", slug: "mamata-banerjee" },
  { name: "M.K. Stalin", role: "Chief Minister (DMK)", state: "Tamil Nadu", stats: "Dravidian Legacy", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=200", slug: "mk-stalin" }
];

export default async function LeadersPage() {
  const { data: leaders } = await supabase
    .from('leaders')
    .select('*, party:party_id(name, short_name, color), state:state_id(name)')
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
              The <br/> <span className="italic text-muted-saffron underline decoration-muted-saffron/10">Protagonists.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-3xl leading-tight">
              &quot;The biographical history of the republic. From the architects of independence to the regional titans of the digital era.&quot;
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mt-16 max-w-2xl">
               <div className="flex-grow relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-saffron w-5 h-5 group-hover:scale-110 transition-transform" />
                  <input 
                    type="text" 
                    placeholder="Search by name, state, or ideology..." 
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
            {leaders?.map((leader: any) => (
              <LeadershipCard 
                key={leader.id}
                leader={{
                    id: leader.id,
                    name: leader.name,
                    thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=200",
                    era: (leader.state as any)?.name || "Bihar Political Era",
                    summary: leader.summary || "Historical profile in the Bakaiti archive.",
                    partyId: leader.party // LeadershipCard expects an object for partyId if it's populated
                }} 
              />
            ))}
            
            <div className="p-12 border-2 border-border border-dashed rounded-[4rem] bg-card/40 flex flex-col items-center justify-center text-center opacity-70 group hover:bg-white transition-all">
               <div className="w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <UserPlus className="w-10 h-10 text-muted-saffron/20" />
               </div>
               <h4 className="font-serif text-3xl font-bold text-muted mb-4 tracking-tight">Digitized Biography</h4>
               <p className="text-[10px] text-muted uppercase tracking-[0.3em] font-bold max-w-[200px] leading-relaxed">Collecting historical metadata for the master index</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

