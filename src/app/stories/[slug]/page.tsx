import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MoveRight, BookOpen, Quote, Share2, ArrowLeft, Users, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { PoliticalStory } from "@/models";

async function getStoryData(identifier: string) {
  await dbConnect();
  try {
     // Check if identifier is a valid MongoDB ObjectId
     const isId = identifier.match(/^[0-9a-fA-F]{24}$/);
     const story = isId 
        ? await PoliticalStory.findById(identifier).populate('stateId').populate('leaderIds').populate('electionId')
        : await PoliticalStory.findOne({ slug: identifier }).populate('stateId').populate('leaderIds').populate('electionId');
     
     return story ? JSON.parse(JSON.stringify(story)) : null;
  } catch (error) {
     return null;
  }
}

export default async function StoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryData(slug);

  if (!story) {
    return (
      <main className="min-h-screen pt-20 flex flex-col items-center justify-center bg-card">
        <Navbar />
        <div className="text-center p-20 border border-dashed border-border rounded-[4rem]">
           <BookOpen className="w-16 h-16 text-muted-saffron mx-auto mb-8 opacity-20" />
           <h1 className="font-serif text-4xl font-bold mb-4">Kissa Not Found</h1>
           <p className="text-muted italic max-w-md">This specific political story is currently being digitized or does not exist in our central repository.</p>
           <Link href="/stories" className="inline-flex items-center gap-2 mt-8 text-sm font-bold uppercase tracking-widest text-muted-saffron hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Stories
           </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const state = story.stateId;
  const leaders = story.leaderIds || [];

  return (
    <main className="min-h-screen pt-20">
      <Navbar />

      <article className="pb-32">
        {/* Editorial Hero */}
        <header className="relative h-[80vh] flex items-center overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 opacity-30 grayscale group">
             <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent" />
          
          <div className="premium-container relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
             <Link href="/stories" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-saffron hover:text-white transition-colors mb-12 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Kisse
             </Link>
             <div className="px-6 py-2 bg-muted-saffron/20 backdrop-blur-md rounded-full text-muted-saffron text-[10px] font-bold uppercase tracking-widest mb-8 border border-muted-saffron/30">
               {story.category}
             </div>
             <h1 className="font-serif text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter mb-8 italic">{story.title}</h1>
             <p className="editorial-text text-2xl md:text-3xl font-serif max-w-4xl opacity-90 leading-tight italic">
               "{story.excerpt}"
             </p>
          </div>
        </header>

        {/* Content Layout */}
        <div className="premium-container grid grid-cols-1 lg:grid-cols-12 gap-24 mt-32">
           {/* Sidebar: Metadata & Entities */}
           <aside className="lg:col-span-3 order-2 lg:order-1 space-y-16">
              <div className="sticky top-40 space-y-16">
                 {state && (
                    <div className="p-10 bg-card border border-border rounded-[3.5rem] relative overflow-hidden group">
                       <div className="flex items-center gap-3 mb-6 text-muted-saffron">
                          <Shield className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Primary State</span>
                       </div>
                       <h4 className="font-serif text-3xl font-bold mb-6 group-hover:text-muted-saffron transition-colors">{state.name}</h4>
                       <Link href={`/states/${state.slug}`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-muted-saffron transition-colors">
                          Visit State Archive <MoveRight className="w-4 h-4" />
                       </Link>
                    </div>
                 )}

                 {leaders.length > 0 && (
                    <div className="p-10 bg-white border border-border rounded-[3.5rem] shadow-sm">
                       <div className="flex items-center gap-3 mb-8 text-muted-saffron">
                          <Users className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Featured Protagonists</span>
                       </div>
                       <div className="space-y-8">
                          {leaders.map((leader: any) => (
                             <Link key={leader._id} href={`/leaders/${leader.slug}`} className="flex items-center gap-4 group">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                   <img src={leader.thumbnail} alt={leader.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <h5 className="font-serif text-lg font-bold group-hover:text-muted-saffron transition-colors leading-tight">{leader.name}</h5>
                                   <p className="text-[8px] font-bold uppercase tracking-widest text-muted mt-1">{leader.era}</p>
                                </div>
                             </Link>
                          ))}
                       </div>
                    </div>
                 )}

                 <div className="flex flex-col gap-6">
                    <button className="flex items-center justify-center gap-3 p-6 bg-foreground text-background rounded-full font-bold uppercase tracking-widest text-xs hover:bg-muted-saffron transition-colors shadow-lg">
                       <Share2 className="w-4 h-4" /> Share This Kissa
                    </button>
                 </div>
              </div>
           </aside>

           {/* Main Editorial Text */}
           <div className="lg:col-span-9 order-1 lg:order-2">
              <div className="max-w-4xl mx-auto space-y-12">
                 <div className="flex items-center gap-6 text-muted-saffron/30 mb-12">
                    <Quote className="w-20 h-20 fill-current" />
                 </div>
                 
                 <div className="prose prose-2xl font-serif prose-p:leading-[1.8] prose-p:mb-12 text-foreground/90 first-letter:text-[12rem] first-letter:font-bold first-letter:float-left first-letter:mr-6 first-letter:text-muted-saffron first-letter:leading-[1]">
                    {story.content || "The full editorial archive for this kissa is currently being digitized. It represents a vital oral tradition in Indian politics."}
                 </div>

                 <div className="p-12 border-y-2 border-border text-center mt-32 bg-card rounded-[4rem]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4 text-center">Editor's Note</p>
                    <p className="editorial-text text-xl italic text-muted max-w-2xl mx-auto text-center">
                       "Political Kisse are the oral histories that define the heart of Indian democracy. They are stories of grit, betrayal, and the sheer audacity of power."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
