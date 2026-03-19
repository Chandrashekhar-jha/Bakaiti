import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, MapPin, Users, History, TrendingUp, Info, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getConstituencyData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/constituencies/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch constituency data:", error);
    return null;
  }
}

export default async function ConstituencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mapping 'id' params to 'slug' because the API route uses slug
  const constituency = await getConstituencyData(id);

  if (!constituency) {
    return (
      <main className="min-h-screen pt-20 flex flex-col items-center justify-center bg-card">
         <Navbar />
         <div className="text-center p-20 border border-dashed border-border rounded-[4rem]">
            <MapPin className="w-16 h-16 text-muted-saffron mx-auto mb-8 opacity-20" />
            <h1 className="font-serif text-4xl font-bold mb-4">Constituency Not Found</h1>
            <p className="text-muted italic max-w-md">Our digital electorate records do not contain a profile for this specific constituency.</p>
            <Link href="/explore" className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-widest text-muted-saffron hover:text-black transition-colors">
               <ArrowLeft className="w-4 h-4" /> Back to Explore
            </Link>
         </div>
         <Footer />
      </main>
    );
  }

  const state = constituency.stateId;
  const notableLeaders = constituency.notableLeaderIds || [];

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <section className="py-24 border-b border-border bg-card">
        <div className="premium-container">
          <Link href={`/states/${state?.slug}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-colors mb-20 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {state?.name} Archive
          </Link>

          <header className="max-w-4xl">
             <div className="flex items-center gap-3 mb-6 text-muted-saffron text-sm font-bold uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                Constituency Documentary Profile
             </div>
             <h1 className="font-serif text-8xl font-bold mb-8">{constituency.name}</h1>
             <p className="editorial-text text-2xl italic text-muted max-w-2xl border-l-4 border-muted-saffron/30 pl-8">
               &quot;{constituency.significance}&quot;
             </p>
          </header>
        </div>
      </section>

      <section className="py-32">
        <div className="premium-container grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-24">
             {/* Historical Results Table */}
             <div>
                <h2 className="font-serif text-5xl font-bold mb-10 flex items-center gap-4">
                   <History className="w-8 h-8 text-muted-saffron" />
                   Electoral History
                </h2>
                <div className="bg-white border border-border rounded-[3rem] overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-black/5">
                            <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-muted">Year</th>
                            <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-muted">Winner</th>
                            <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-muted">Margin</th>
                            <th className="p-8 text-[10px] font-bold uppercase tracking-widest text-muted text-right">Runner Up</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {constituency.historicalResults?.map((result: any, i: number) => {
                           const winnerParty = result.winnerPartyId;
                           const runnerUpParty = result.runnerUpPartyId;
                           return (
                            <tr key={i} className="hover:bg-muted-saffron/5 transition-colors group">
                               <td className="p-8 font-serif text-xl font-bold">{result.year}</td>
                               <td className="p-8">
                                  <div className="flex items-center gap-3 mb-1">
                                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: winnerParty?.color || '#ccc' }} />
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{winnerParty?.shortName}</span>
                                  </div>
                                  <p className="text-lg font-bold group-hover:text-muted-saffron transition-colors">{result.winnerName}</p>
                               </td>
                               <td className="p-8 text-muted font-mono text-sm">{result.margin?.toLocaleString()} Votes</td>
                               <td className="p-8 text-right">
                                  <div className="flex items-center justify-end gap-3 mb-1">
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{runnerUpParty?.shortName}</span>
                                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: runnerUpParty?.color || '#ccc' }} />
                                  </div>
                                  <p className="text-sm font-bold text-muted/80">{result.runnerUpName}</p>
                               </td>
                            </tr>
                         )})}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Vote Trends / Visualization Placeholder */}
             <div>
                <h2 className="font-serif text-5xl font-bold mb-10 flex items-center gap-4">
                   <TrendingUp className="w-8 h-8 text-muted-saffron" />
                   Vote Share Trends
                </h2>
                <div className="p-12 bg-card border border-border rounded-[3rem] border-dashed text-center">
                   <div className="flex flex-col items-center gap-6">
                      <div className="flex items-end gap-4 h-48">
                         <div className="w-12 bg-muted-saffron h-[80%] rounded-t-xl" />
                         <div className="w-12 bg-deep-green h-[60%] rounded-t-xl" />
                         <div className="w-12 bg-parliamentary-blue h-[30%] rounded-t-xl" />
                      </div>
                      <p className="text-sm text-muted italic">Historical vote share visualization being digitized. <br/> Reflecting trends from the last {constituency.historicalResults?.length} cycles.</p>
                   </div>
                </div>
             </div>

             {/* Famous Contests */}
             <div>
                <h2 className="font-serif text-5xl font-bold mb-10 flex items-center gap-4">
                   <Star className="w-8 h-8 text-muted-saffron" />
                   Famous Contests
                </h2>
                <div className="space-y-8">
                   {constituency.famousContests?.map((contest: any, i: number) => (
                      <div key={i} className="p-12 bg-white border border-border rounded-[3rem] hover:shadow-xl transition-all">
                         <div className="flex justify-between items-start mb-6">
                            <span className="px-4 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest">{contest.year}</span>
                            <Star className="w-5 h-5 text-muted-saffron fill-current" />
                         </div>
                         <h3 className="font-serif text-3xl font-bold mb-4">{contest.title}</h3>
                         <p className="editorial-text text-lg italic text-muted leading-relaxed">
                            &quot;{contest.description}&quot;
                         </p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
             <div className="p-10 bg-white border border-border rounded-[3rem] shadow-xl">
                <h4 className="font-serif text-xl font-bold mb-8 uppercase tracking-tighter border-b border-border pb-4">Notable Protagonists</h4>
                <div className="space-y-6">
                   {notableLeaders.map((leader: any) => (
                     <Link key={leader._id} href={`/leaders/${leader._id}`} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                           <img src={leader.thumbnail} alt={leader.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h5 className="font-serif text-lg font-bold group-hover:text-muted-saffron transition-colors">{leader.name}</h5>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{leader.era}</p>
                        </div>
                     </Link>
                   ))}
                </div>
             </div>

             <div className="p-10 bg-muted-saffron/10 border border-muted-saffron/20 rounded-[3rem]">
                <div className="flex gap-4 mb-6">
                   <Info className="w-8 h-8 text-muted-saffron flex-shrink-0" />
                   <div>
                       <h4 className="font-serif text-xl font-bold">Political DNA</h4>
                       <p className="text-sm text-muted mt-2 leading-relaxed">
                         The constituency's identity is shaped by a high degree of political literacy and a history of decisive mandates.
                       </p>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
