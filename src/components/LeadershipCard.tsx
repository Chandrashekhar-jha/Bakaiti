import Link from "next/link";

interface LeadershipCardProps {
  leader: {
    id?: string;
    _id?: string;
    name: string;
    thumbnail: string;
    era: string;
    summary: string;
    partyId?: any; // Keep as any for now due to complex population or id
  };
}

export default function LeadershipCard({ leader }: LeadershipCardProps) {
  // Handle both ID and populated object for party
  const party = typeof leader.partyId === 'object' ? leader.partyId : null;
  const leaderId = leader.id || leader._id;

  return (
    <Link href={`/leaders/${leaderId}`} className="group block h-full">
      <div className="bg-white border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all h-full">
        <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
          <img src={leader.thumbnail} alt={leader.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party?.color || '#ccc' }} />
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron">{party?.shortName || "Independent"}</span>
          </div>
          <h3 className="font-serif text-2xl font-bold group-hover:text-muted-saffron transition-colors">{leader.name}</h3>
          <p className="text-[10px] text-muted uppercase tracking-tighter mt-1">{leader.era}</p>
          <p className="text-sm text-foreground/80 mt-4 line-clamp-3 italic leading-relaxed">
            &quot;{leader.summary}&quot;
          </p>
        </div>
      </div>
    </Link>
  );
}
