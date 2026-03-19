import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  subtitle: string;
  viewAllLink?: string;
  viewAllText?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export default function ContentSection({
  title,
  subtitle,
  viewAllLink,
  viewAllText = "View Archive",
  children,
  className = "",
  dark = false
}: ContentSectionProps) {
  return (
    <section className={`py-32 ${dark ? "bg-foreground text-background" : "bg-background"} ${className}`}>
      <div className="premium-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className={`font-serif text-5xl md:text-6xl font-bold tracking-tight ${dark ? "text-background" : "text-foreground"}`}>
              {title}
            </h2>
            <p className={`text-xl md:text-2xl font-serif italic max-w-2xl ${dark ? "text-background/60" : "text-muted"}`}>
              {subtitle}
            </p>
          </div>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className={`text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:gap-5 ${
                dark ? "text-muted-saffron border-b border-muted-saffron/20 pb-1" : "text-muted-saffron"
              }`}
            >
              {viewAllText} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
