import { ArrowRight, Calendar, Award } from "lucide-react";
import Link from "next/link";

interface ElectionCardProps {
  election: {
    id?: string;
    _id?: string;
    year: number;
    type: string;
    title: string;
    dramaticHook: string;
    summary?: string;
    background?: string;
    winner?: string;
    outcome?: {
      winnerAllianceId?: { name: string; shortName: string };
      winnerPartyId?: { name: string; shortName: string };
    };
  };
}

export default function ElectionCard({ election }: ElectionCardProps) {
  // Use the provided 'winner' override if present, otherwise try to resolve from populated data
  const winnerName = election.winner || election.outcome?.winnerAllianceId?.name || election.outcome?.winnerPartyId?.name || "Opposition";
  const electionId = election.id || election._id;

  return (
    <Link href={`/elections/${electionId}`} className="group block">
      <div className="bg-white border border-border rounded-3xl p-8 hover:border-muted-saffron/50 transition-all hover:shadow-lg h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-foreground text-[10px] font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            {election.year}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{election.type} Election</span>
        </div>
        
        <h3 className="font-serif text-3xl font-bold mb-4 group-hover:text-muted-saffron transition-colors leading-tight">
          {election.title}
        </h3>
        
        <p className="text-foreground/90 font-medium italic mb-4">
          &quot;{election.dramaticHook}&quot;
        </p>
        
        <p className="text-sm text-muted line-clamp-3 mb-8 flex-grow">
          {election.summary || election.background}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="flex gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-muted font-bold">Winning Power</p>
              <div className="flex items-center gap-2">
                <Award className="w-3 h-3 text-deep-green" />
                <p className="text-xs font-bold text-deep-green">{winnerName}</p>
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted group-hover:text-muted-saffron group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
