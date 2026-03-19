import { Landmark, Globe, Shield, Gavel, Zap, Users2, Target, TrendingUp, AlertTriangle, ShieldAlert } from "lucide-react";

export const editorialStories = [
  {
    id: "betrayal-1",
    category: "Betrayal",
    title: "The Midnight Coup",
    excerpt: "How a silent alliance shift at 2:00 AM changed the course of a state's history.",
    thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=800",
    slug: "midnight-coup"
  },
  {
    id: "kingmaker-1",
    category: "Kingmaker",
    title: "The Third Force",
    excerpt: "When 5 seats decided the fate of a 243-member assembly.",
    thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800",
    slug: "third-force"
  },
  {
    id: "rebellion-1",
    category: "Rebellion",
    title: "The Grassroots Revolt",
    excerpt: "A young leader's journey from a loyalist to the face of a regional defiance.",
    thumbnail: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?auto=format&fit=crop&q=80&w=800",
    slug: "grassroots-revolt"
  },
  {
    id: "resort-1",
    category: "Resort Politics",
    title: "The Golden Cage",
    excerpt: "Inside the luxury confinement that kept a coalition from crumbling.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    slug: "golden-cage"
  },
  {
    id: "alliance-1",
    category: "Alliance Drama",
    title: "The Unnatural Pact",
    excerpt: "Ideological rivals shook hands to survive. It lasted exactly 14 months.",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
    slug: "unnatural-pact"
  },
  {
    id: "irony-1",
    category: "Political Irony",
    title: "The Defeated Winner",
    excerpt: "Winning the popular vote but losing the chair through a technical loophole.",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    slug: "defeated-winner"
  }
];

export const biharArchive = {
  state: {
    id: "bihar",
    name: "Bihar",
    title: "The Crucible of Justice",
    description: "The land where Mandal met Kamandal, and where every election is a social revolution.",
    image: "https://images.unsplash.com/photo-1599424423751-6872583870f7?auto=format&fit=crop&q=80&w=1200",
    slug: "/states/bihar"
  },
  elections: [
    { year: 2015, title: "The Grand Alliance", desc: "A historic coming together of traditional rivals." },
    { year: 2005, title: "End of an Era", desc: "The shift that redefined the development narrative." }
  ],
  leaders: [
    { name: "The Socialist Giant", role: "JP Movement Legacy", slug: "/leaders/jp" },
    { name: "The Modern Reformer", role: "Sushasan Era", slug: "/leaders/nitish" }
  ]
};

export const electionTypes = [
  { label: "General", icon: Globe, desc: "National Mandates", color: "bg-foreground", slug: "/elections/general" },
  { label: "State", icon: Shield, desc: "Regional Resilience", color: "bg-muted-saffron", slug: "/elections/state" },
  { label: "Municipal", icon: Landmark, desc: "Urban Aspirations", color: "bg-slate-800", slug: "/elections/municipal" },
  { label: "Panchayat", icon: Gavel, desc: "Grassroots Grit", color: "bg-foreground/60", slug: "/elections/panchayat" },
  { label: "Ward", icon: Zap, desc: "Hyper-local Power", color: "bg-muted-saffron/80", slug: "/elections/ward" }
];

export const rivalries = [
  {
    id: "riv-1",
    title: "The Dynasts vs The Outsider",
    state: "Uttar Pradesh",
    desc: "A decade-long battle between established clans and a rising grassroots force.",
    icon: Users2
  },
  {
    id: "riv-2",
    title: "Ideological Titans",
    state: "West Bengal",
    desc: "The transition from decades of red dominance to a new regional identity.",
    icon: Target
  },
  {
    id: "riv-3",
    title: "The Battle of Thrones",
    state: "Maharashtra",
    desc: "High-octane family drama involving split parties and resort politics.",
    icon: Landmark
  }
];

export const turningPoints = [
  {
    id: "tp-1",
    year: "1977",
    title: "The First Non-Congress Govt",
    excerpt: "The post-Emergency earthquake that proved Indian democracy's resilience.",
    image: "https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "tp-2",
    year: "1991",
    title: "The Coalition Era Begins",
    excerpt: "When the era of single-party dominance ended and regional kings emerged.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800"
  }
];
