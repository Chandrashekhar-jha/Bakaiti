import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RelationshipVisualizer from "@/components/RelationshipVisualizer";
import { ArrowLeft, Zap, Target, History, Trophy, Users, Shield, MessageSquare, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getElectionData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/elections/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch election data:", error);
    return null;
  }
}

export default async function ElectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const election = await getElectionData(id);

  if (!election) {
     return (
        <main className="min-h-screen pt-20 flex flex-col items-center justify-center bg-card">
           <Navbar />
           <div className="text-center p-20 border border-dashed border-border rounded-[4rem]">
              <History className="w-16 h-16 text-muted-saffron mx-auto mb-8 opacity-20" />
              <h1 className="font-serif text-4xl font-bold mb-4">Election Archive Not Found</h1>
              <p className="text-muted italic max-w-md">The specific digital record for this election could not be retrieved from the central database.</p>
              <Link href="/explore" className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-widest text-muted-saffron hover:text-black transition-colors">
                 <ArrowLeft className="w-4 h-4" /> Back to Explore
              </Link>
           </div>
           <Footer />
        </main>
     );
  }

  const winnerName = election.outcome.winnerAllianceId?.name || election.outcome.winnerPartyId?.name || "Opposition";

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="py-32 border-b border-border bg-card">
        <div className="premium-container">
          <Link href={`/states/${election.stateId?.slug}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-colors mb-20 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {election.stateId?.name} Archive
          </Link>

          <header className="max-w-5xl">
             <div className="flex items-center gap-3 mb-6 text-muted-saffron text-sm font-bold uppercase tracking-widest">
                <Target className="w-4 h-4" />
                Documentary Episode {election.year}
             </div>
             <h1 className="font-serif text-[10rem] font-bold leading-none tracking-tighter mb-12">{election.title}</h1>
             <p className="editorial-text text-4xl font-serif italic text-muted leading-tight border-l-8 border-muted-saffron/30 pl-12 py-4">
                &quot;{election.dramaticHook}&quot;
             </p>
          </header>
        </div>
      </section>

      {/* Documentary Content */}
      <section className="py-32 bg-white">
        <div className="premium-container grid grid-cols-1 lg:grid-cols-12 gap-24">
          <div className="lg:col-span-8 space-y-32">
             {/* Context Section */}
             <div>
                <h2 className="font-serif text-5xl font-bold mb-10 flex items-center gap-4">
                   <History className="w-8 h-8 text-muted-saffron" />
                   The Context
                </h2>
                <div className="prose prose-xl font-serif leading-relaxed text-foreground/80 first-letter:text-8xl first-letter:font-bold first-letter:float-left first-letter:mr-4 first-letter:text-muted-saffron">
                   {election.summary}
                </div>
                <div className="mt-12 p-12 bg-card rounded-[3rem] border border-border shadow-sm italic text-xl">
                   {election.background}
                </div>
             </div>

             {/* Campaign Strategy */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-12 bg-muted-saffron/5 border border-muted-saffron/20 rounded-[4rem]">
                   <h3 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-muted-saffron" />
                      Digital Strategy
                   </h3>
                   <p className="text-lg leading-relaxed text-muted line-clamp-6">{election.campaignStrategy?.digital}</p>
                </div>
                <div className="p-12 bg-deep-green/5 border border-deep-green/20 rounded-[4rem]">
                   <h3 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
                      <Users className="w-6 h-6 text-deep-green" />
                      Ground Campaign
                   </h3>
                   <p className="text-lg leading-relaxed text-muted line-clamp-6">{election.campaignStrategy?.ground}</p>
                </div>
             </div>

             {/* Alliances & Relationship Visualizer */}
             <div>
                <h2 className="font-serif text-5xl font-bold mb-4 flex items-center gap-4">
                   <Shield className="w-8 h-8 text-muted-saffron" />
                   The Grid of Support
                </h2>
                <p className="text-muted text-sm font-bold uppercase tracking-widest mb-12 ml-12">Who supported whom during the {election.year} mandate</p>
                <RelationshipVisualizer 
                   alliances={election.outcome.winnerAllianceId ? [election.outcome.winnerAllianceId] : []}
                />
             </div>

             {/* Shocking Moments & Controversies */}
             <div className="space-y-12">
                <h2 className="font-serif text-5xl font-bold mb-4 flex items-center gap-4">
                   <AlertTriangle className="w-8 h-8 text-muted-saffron" />
                   Shock & Controversy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {election.shockingMoments?.map((m: string, i: number) => (
                      <div key={i} className="p-10 bg-black text-white rounded-[3rem] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 text-muted-saffron opacity-20 group-hover:opacity-100 transition-opacity">
                            <Zap className="w-12 h-12" />
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-4">Shocking Moment</p>
                         <p className="text-lg font-serif italic mb-0 relative z-10 leading-relaxed">&quot;{m}&quot;</p>
                      </div>
                   ))}
                   {election.controversies?.map((c: string, i: number) => (
                      <div key={i} className="p-10 bg-white border border-border rounded-[3rem] group">
                         <div className="flex items-center gap-3 mb-4 text-muted">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Controversy</span>
                         </div>
                          <p className="text-lg italic leading-relaxed text-foreground/80">&quot;{c}&quot;</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <aside className="lg:col-span-4">
             <div className="sticky top-40 space-y-12">
                <div className="p-10 bg-white border border-border rounded-[3.5rem] shadow-2xl">
                   <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
                      <Trophy className="w-8 h-8 text-muted-saffron" />
                      <div>
                         <h4 className="font-serif text-2xl font-bold">The Verdict</h4>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{election.year} Mandate</p>
                      </div>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="flex flex-col gap-2">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Winner</p>
                         <p className="font-serif text-3xl font-bold text-muted-saffron">{winnerName}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Power Balance</p>
                         <div className="flex justify-between items-end">
                            <span className="text-5xl font-serif font-bold italic">{election.outcome?.seatsWon}</span>
                            <span className="text-muted text-sm pb-1">/ {election.outcome?.totalSeats} Seats</span>
                         </div>
                      </div>
                      
                      <div className="pt-8 border-t border-border space-y-6">
                         <div className="flex justify-between items-center opacity-60">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Before Power</span>
                            <span className="text-xs font-bold leading-tight text-right w-1/2">{election.outcome?.beforePower}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron">After Power</span>
                            <span className="text-xs font-bold leading-tight text-right w-1/2">{election.outcome?.afterPower}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-card border border-border rounded-[3rem]">
                   <h4 className="font-serif text-xl font-bold mb-6 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-muted-saffron" />
                      Public Mood
                   </h4>
                   <p className="editorial-text text-lg italic text-muted leading-relaxed">
                      &quot;{election.publicMood}&quot;
                   </p>
                </div>
             </div>
          </aside>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-40 bg-foreground text-background relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-muted-saffron" />
         <div className="premium-container relative z-10">
            <div className="max-w-4xl">
               <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron mb-8">Long-term Political Impact</h2>
               <p className="font-serif text-5xl leading-tight mb-16 italic">
                   &quot;{election.impact}&quot;
               </p>
               <Link href={`/states/${election.stateId?.slug}`} className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-saffron hover:text-white transition-colors group">
                   Continue {election.stateId?.name}&apos;s Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
         </div>
         <div className="absolute bottom-0 right-0 p-20 opacity-10">
            <Trophy className="w-[400px] h-[400px]" />
         </div>
      </section>

      <Footer />
    </main>
  );
}
