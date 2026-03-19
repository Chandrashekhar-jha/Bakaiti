import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoryCard from "@/components/home/StoryCard";
import { Search, BookOpen, PenTool } from "lucide-react";
import Link from "next/link";
import { editorialStories } from "@/data/editorialData";

export default function StoriesPage() {
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
              <span className="text-muted">Editorial</span>
            </nav>
            <h1 className="font-serif text-8xl md:text-[10rem] font-bold mb-10 tracking-tighter leading-[0.85]">
              Political <br/> <span className="italic text-muted-saffron underline decoration-muted-saffron/10">Kisse.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-3xl leading-tight">
              &quot;Betrayals, kingmakers, and resort politics. Long-form narratives of the seismic shifts that defined subcontinental history.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="premium-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {editorialStories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
            
            <div className="p-12 border-2 border-border border-dashed rounded-[4rem] bg-card/40 flex flex-col items-center justify-center text-center opacity-70 group hover:bg-white transition-all text-muted">
               <div className="w-20 h-20 rounded-full bg-white border border-border flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <PenTool className="w-10 h-10 text-muted-saffron/20" />
               </div>
               <h4 className="font-serif text-3xl font-bold mb-4 tracking-tight">The Write-up Layer</h4>
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold max-w-[200px] leading-relaxed">Collaborating with archival researchers to document regional histories</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

