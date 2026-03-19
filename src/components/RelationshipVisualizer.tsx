import { motion } from "framer-motion";
import { Users, Shield, Link2, Users2, Swords, GraduationCap, GitPullRequest, Handshake } from "lucide-react";

interface RelationshipVisualizerProps {
  alliances?: any[];
  leaderRelationships?: {
    leaderId: {
      _id: string;
      name: string;
      thumbnail: string;
    };
    relationshipType?: string;
    type?: string;
    context: string;
    year?: number;
  }[];
  currentLeaderId?: string;
  parties?: Record<string, any>;
}

export default function RelationshipVisualizer({ alliances, leaderRelationships, currentLeaderId, parties }: RelationshipVisualizerProps) {
  if (leaderRelationships && currentLeaderId) {
    return <LeaderRelationshipGraph relationships={leaderRelationships} />;
  }

  return (
    <div className="w-full py-12">
      <div className="flex flex-col gap-12">
        {alliances?.map((alliance) => (
          <div key={alliance._id || alliance.id} className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alliance.isWinner ? 'bg-muted-saffron text-white' : 'bg-black/5 text-muted'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-2xl font-bold">{alliance.name}</h4>
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted">
                  {alliance.isWinner ? 'Winning Coalition' : 'Opposition Alliance'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {alliance.parties.map((partyItem: any, pIdx: number) => {
                const party = typeof partyItem === 'object' ? partyItem : (parties ? parties[partyItem] : null);
                if (!party) return null;
                return (
                  <motion.div
                    key={party._id || party.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pIdx * 0.1 }}
                    className="relative p-6 bg-white border border-border rounded-2xl hover:border-muted-saffron/50 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{party.shortName}</span>
                    </div>
                    <h5 className="font-serif text-lg font-bold leading-tight group-hover:text-muted-saffron transition-colors">
                      {party.name}
                    </h5>
                    <div className="mt-4 flex items-center gap-2">
                       <Link2 className="w-3 h-3 text-muted/30" />
                       <span className="text-[8px] font-bold text-muted/50 uppercase tracking-tighter">Connected Partner</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Visual connector line for the group */}
            <div className="absolute top-12 bottom-0 left-5 w-px bg-border -z-10" />
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-card border border-border rounded-[2rem] flex flex-col md:flex-row items-center gap-8 border-dashed">
        <div className="w-16 h-16 rounded-2xl bg-muted-saffron/10 flex items-center justify-center text-muted-saffron">
          <Users2 className="w-8 h-8" />
        </div>
        <div className="flex-grow">
          <h4 className="font-serif text-xl font-bold mb-2">The Arithmetic of Power</h4>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            In Indian politics, the "Who Supported Whom" layer is often as important as the vote share. Coalitions are built on a mix of ideological alignment, regional leverage, and post-poll necessity.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-saffron bg-muted-saffron/5 px-2 py-1 rounded">Editorial Insight</span>
        </div>
      </div>
    </div>
  );
}

function LeaderRelationshipGraph({ relationships }: { relationships: NonNullable<RelationshipVisualizerProps['leaderRelationships']> }) {
  const iconMap: Record<string, any> = {
    "Mentorship": GraduationCap,
    "Rivalry": Swords,
    "Alliance": Handshake,
    "Party Switch": GitPullRequest,
    "Coalition Partner": Users,
  };

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relationships.map((rel, idx) => {
          const leader = typeof rel.leaderId === 'object' ? rel.leaderId : null;
          const relType = rel.type || rel.relationshipType;
          const Icon = (relType && iconMap[relType]) ? iconMap[relType] : Users;
          if (!leader) return null;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-8 bg-white border border-border rounded-[2.5rem] hover:border-muted-saffron/50 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={leader.thumbnail} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="font-serif text-xl font-bold">{leader.name}</h5>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    {rel.year ? `${rel.year} • ` : ""}{relType}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/5 rounded-2xl flex items-start gap-4">
                <Icon className="w-5 h-5 text-muted-saffron mt-1 flex-shrink-0" />
                <p className="text-sm text-muted leading-relaxed italic">
                  &quot;{rel.context}&quot;
                </p>
              </div>

              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-border group-hover:bg-muted-saffron/50 transition-colors" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
