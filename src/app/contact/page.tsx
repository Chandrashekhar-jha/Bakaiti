import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, History, ArrowRight, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="py-32 bg-card border-b border-border">
        <div className="premium-container">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 text-muted-saffron text-sm font-bold uppercase tracking-widest">
              <Mail className="w-5 h-5" />
              Editorial Submission
            </div>
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              Tell <br/> your <span className="italic text-muted-saffron">Story.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-relaxed mb-16">
              &quot;Bakaiti is a living archive. If you have a political &apos;kissa&apos; that deserves to be told, our editorial team is listening.&quot;
            </p>

            <div className="p-12 bg-white border border-border border-dashed rounded-[3rem] flex items-center gap-8 mb-16">
              <div className="w-16 h-16 rounded-full bg-muted-saffron/10 flex items-center justify-center flex-shrink-0">
                <History className="w-8 h-8 text-muted-saffron" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold mb-2">Archival expansion underway.</h4>
                <p className="text-muted text-sm italic">The automated submission system is being refined. Please reach out to our team at editorial@bakaiti.com</p>
              </div>
            </div>

            <button className="px-12 py-6 bg-foreground text-background font-bold rounded-full hover:bg-muted-saffron transition-all flex items-center gap-4 group uppercase text-xs tracking-widest">
              Send an Email <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
