import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Archive, History, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function ArchivePage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="py-32 bg-card border-b border-border">
        <div className="premium-container">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 text-muted-saffron text-sm font-bold uppercase tracking-widest">
              <Archive className="w-5 h-5" />
              The Central Archive
            </div>
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              Boundless <br/> <span className="italic text-muted-saffron">Memory.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-relaxed mb-16">
              &quot;Every mandate, every leader, and every political kissa in the Bakaiti repository.&quot;
            </p>

            <div className="p-12 bg-white border border-border border-dashed rounded-[3rem] flex items-center gap-8 mb-16">
              <div className="w-16 h-16 rounded-full bg-muted-saffron/10 flex items-center justify-center flex-shrink-0">
                <History className="w-8 h-8 text-muted-saffron" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold mb-2">Archival expansion underway.</h4>
                <p className="text-muted text-sm italic">The central index is being optimized for high-performance discovery. Use the Explore engine in the meantime.</p>
              </div>
            </div>

            <Link href="/explore" className="px-10 py-5 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all flex items-center gap-4 group uppercase text-xs tracking-widest w-fit">
              Use Discovery Engine <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
