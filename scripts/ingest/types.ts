export interface RawElectionResult {
  State_Name: string;
  Constituency_Name: string;
  Year: number;
  Election_Type: 'Assembly' | 'Parliament';
  Candidate: string;
  Party: string;
  Votes: number;
  Total_Votes: number;
  Position: number;
  Winner: boolean;
  Margin: number;
}

export interface PoliticianProfile {
  name: string;
  slug: string;
  state: string;
  party: string;
  positions: string[];
  summary: string;
  achievements: string[];
  controversies: string[];
  era?: string;
  thumbnail?: string;
}

export interface StateMetadata {
  name: string;
  slug: string;
  overview: string;
  formation_year: number;
  total_seats: number;
}
