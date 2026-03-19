import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, History, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="py-32 bg-card border-b border-border">
        <div className="premium-container">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 text-muted-saffron text-sm font-bold uppercase tracking-widest">
              <BookOpen className="w-5 h-5" />
              Our Mission
            </div>
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              Documenting <br/> the <span className="italic text-muted-saffron">Republic.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-relaxed mb-16">
              "Bakaiti is a digital archive of Indian democracy. We believe that the stories of our elections are the stories of our people."
            </p>

            <div className="p-12 bg-white border border-border border-dashed rounded-[3rem] flex items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-muted-saffron/10 flex items-center justify-center flex-shrink-0">
                <History className="w-8 h-8 text-muted-saffron" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold mb-2">Archival expansion underway.</h4>
                <p className="text-muted text-sm italic">Our editorial team is busy documenting the mission and history of Bakaiti. Check back soon for the full story.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <Link href="/explore" className="p-8 bg-white border border-border rounded-3xl hover:shadow-xl transition-all group">
                <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-muted-saffron transition-colors">Explore the Data</h3>
                <p className="text-xs text-muted mb-4">Dive into the mandates that shaped the map of India.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-muted-saffron">
                  Go to Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
              <Link href="/stories" className="p-8 bg-white border border-border rounded-3xl hover:shadow-xl transition-all group">
                <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-muted-saffron transition-colors">Read the Stories</h3>
                <p className="text-xs text-muted mb-4">The betrayal, the kingmakers, and the resort politics.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-muted-saffron">
                  Go to Stories <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
