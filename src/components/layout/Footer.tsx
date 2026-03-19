import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20 py-20">
      <div className="premium-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold text-foreground">
              Bakaiti
            </Link>
            <p className="mt-4 text-muted max-w-sm leading-relaxed italic">
              &quot;Smart political storytelling for curious people. The political story of India, told like it matters.&quot;
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link href="/states" className="hover:text-foreground transition-colors">States</Link></li>
              <li><Link href="/elections" className="hover:text-foreground transition-colors">Elections</Link></li>
              <li><Link href="/stories" className="hover:text-foreground transition-colors">Political Kisse</Link></li>
              <li><Link href="/leaders" className="hover:text-foreground transition-colors">Famous Leaders</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">About</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Mission</Link></li>
              <li><Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link></li>
              <li><Link href="/archive" className="hover:text-foreground transition-colors">Archive</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Bakaiti. All rights reserved. Not affiliated with any political party.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
