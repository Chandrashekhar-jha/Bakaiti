import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldAlert, History } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navbar />
      
      <section className="py-32 bg-card border-b border-border">
        <div className="premium-container">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 text-muted-saffron text-sm font-bold uppercase tracking-widest">
              <ShieldAlert className="w-5 h-5" />
              Legal & Privacy
            </div>
            <h1 className="font-serif text-8xl md:text-9xl font-bold mb-12 tracking-tighter leading-none">
              Trust <br/> & <span className="italic text-muted-saffron">Privacy.</span>
            </h1>
            <p className="editorial-text text-3xl text-muted font-serif italic max-w-2xl leading-relaxed mb-16">
              &quot;We take your data and privacy seriously. Our terms are designed to be as transparent as our mission.&quot;
            </p>

            <div className="p-12 bg-white border border-border border-dashed rounded-[3rem] flex items-center gap-8 mb-16">
              <div className="w-16 h-16 rounded-full bg-muted-saffron/10 flex items-center justify-center flex-shrink-0">
                <History className="w-8 h-8 text-muted-saffron" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold mb-2">Archival expansion underway.</h4>
                <p className="text-muted text-sm italic">Our legal documents are being updated for the new Supabase integration. Check back soon for the official Privacy Policy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
