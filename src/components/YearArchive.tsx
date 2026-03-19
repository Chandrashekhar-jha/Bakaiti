import Link from "next/link";
import { ArrowRight, Calendar, Users2, TrendingUp } from "lucide-react";

interface ElectionYear {
  year: number;
  title: string;
  desc?: string;
  status?: 'verified' | 'simplified' | 'placeholder';
  winner?: string;
  totalSeats?: number;
}

interface YearArchiveProps {
  stateName: string;
  stateSlug: string;
  electionType: 'assembly' | 'parliament';
  years: ElectionYear[];
}

export default function YearArchive({ stateName, stateSlug, electionType, years }: YearArchiveProps) {
  const typeLabel = electionType === 'assembly' ? 'Legislative Assembly' : 'Lok Sabha (Parliament)';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {years.sort((a, b) => b.year - a.year).map((item) => (
        <Link 
          key={item.year} 
          href={`/states/${stateSlug}/${electionType}/${item.year}`}
          className="group"
        >
          <div className="p-10 bg-white border border-border rounded-[3rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-border">
                <Calendar className="w-3 h-3 text-muted" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{item.year}</span>
              </div>
              {item.status === 'verified' && (
                <span className="text-[8px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                  Full Archive
                </span>
              )}
            </div>

            <h3 className="font-serif text-3xl font-bold mb-4 group-hover:text-muted-saffron transition-colors">
              {item.title || `${item.year} Mandate`}
            </h3>
            
            {item.desc && (
              <p className="text-sm text-muted mb-8 italic line-clamp-2">
                &quot;{item.desc}&quot;
              </p>
            )}

            <div className="mt-auto space-y-6">
              {item.winner && (
                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <Users2 className="w-4 h-4 text-muted-saffron" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold tracking-widest text-muted">Majority Party</span>
                    <span className="text-sm font-serif font-bold italic">{item.winner}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-saffron">
                <span>Enter Year Archive</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Decorative Year Watermark */}
            <div className="absolute -bottom-6 -right-4 font-serif text-8xl font-bold text-foreground/[0.03] italic pointer-events-none select-none">
              {item.year}
            </div>
          </div>
        </Link>
      ))}

    </div>
  );
}
