import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Database, History, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="py-32 bg-card border-b border-border">
        <div className="premium-container">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 text-muted-saffron text-sm font-bold uppercase tracking-widest">
              <Database className="w-5 h-5" />
              Data Methodology
            </div>
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              Precision <br/> In <span className="italic text-muted-saffron">Chaos.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-relaxed mb-16">
              "How we ingest, normalize, and tell stories with political data. Our commitment is to accuracy and context."
            </p>

            <div className="p-12 bg-white border border-border border-dashed rounded-[3rem] flex items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-muted-saffron/10 flex items-center justify-center flex-shrink-0">
                <History className="w-8 h-8 text-muted-saffron" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold mb-2">Archival expansion underway.</h4>
                <p className="text-muted text-sm italic">We are documenting our data sourcing and cleaning pipelines. The full methodology report will be live shortly.</p>
              </div>
            </div>

            <div className="mt-16 p-10 bg-muted-saffron/5 border border-muted-saffron/10 rounded-3xl">
              <h3 className="font-serif text-2xl font-bold mb-4">Our Data Sources</h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-saffron" /> Data.gov.in</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-saffron" /> TCPD Archives</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-saffron" /> Election Commission</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
