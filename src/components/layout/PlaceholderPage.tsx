"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  category?: string;
  backLink?: string;
  backText?: string;
}

export default function PlaceholderPage({ 
  title, 
  subtitle = "Archival expansion underway. This section is being digitized and verified for historical accuracy.", 
  category = "Political Archive",
  backLink = "/explore",
  backText = "Back to Explore"
}: PlaceholderPageProps) {
  return (
    <main className="min-h-screen pt-20 flex flex-col items-center justify-center bg-card">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="premium-container max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-muted-saffron/10 border border-muted-saffron/20 text-muted-saffron text-[10px] font-bold uppercase tracking-[0.2em] mb-12">
          <span className="w-2 h-2 rounded-full bg-muted-saffron animate-pulse" />
          {category}
        </div>
        
        <div className="p-16 md:p-24 border border-dashed border-border rounded-[4rem] bg-white/50 backdrop-blur-sm shadow-xl">
           <History className="w-20 h-20 text-muted-saffron mx-auto mb-10 opacity-20" />
           
           <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight">
             {title}
           </h1>
           
           <p className="editorial-text text-2xl text-muted font-serif italic max-w-2xl mx-auto leading-relaxed mb-12">
             &quot;{subtitle}&quot;
           </p>
           
           <div className="flex flex-col items-center gap-8">
             <Link href={backLink} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-saffron hover:text-black transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {backText}
             </Link>
             
             <div className="w-px h-12 bg-border/50" />
             
             <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted/30">
               Bakaiti Digital Archive
             </div>
           </div>
        </div>
      </motion.div>
      
      <Footer />
    </main>
  );
}
