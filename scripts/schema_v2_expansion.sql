-- Bakaiti Schema Expansion v2: Encyclopedia Depth 🏛️🇮🇳

-- 1. Expanded Elections Fields
ALTER TABLE public.elections 
ADD COLUMN IF NOT EXISTS majority_mark INTEGER,
ADD COLUMN IF NOT EXISTS turnout_percent DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS incumbent_party_id UUID REFERENCES public.parties(id),
ADD COLUMN IF NOT EXISTS major_issues TEXT[],
ADD COLUMN IF NOT EXISTS coalition_summary TEXT;

-- 2. Expanded Leaders Fields
ALTER TABLE public.leaders
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS career_highlights TEXT[],
ADD COLUMN IF NOT EXISTS party_switching_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS positions_held JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS wikidata_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 3. Political Eras Table
CREATE TABLE IF NOT EXISTS public.political_eras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    start_year INTEGER NOT NULL,
    end_year INTEGER, -- NULL if ongoing
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Political Turning Points / Events
CREATE TABLE IF NOT EXISTS public.political_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK (event_type IN ('Turning Point', 'Rebellion', 'Collapse', 'Crisis', 'Movement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Rivalries Table (Leader-Leader or Party-Party)
CREATE TABLE IF NOT EXISTS public.rivalries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    entity_a_id UUID NOT NULL, -- References leaders or parties
    entity_b_id UUID NOT NULL,
    rivalry_type TEXT CHECK (rivalry_type IN ('Leader', 'Party')),
    description TEXT,
    significance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Mentorships / Legacy Links
CREATE TABLE IF NOT EXISTS public.mentorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID REFERENCES public.leaders(id) ON DELETE CASCADE,
    protege_id UUID REFERENCES public.leaders(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(mentor_id, protege_id)
);

-- 7. Election Alliances (Specific to an election)
CREATE TABLE IF NOT EXISTS public.election_alliances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    party_id UUID REFERENCES public.parties(id) ON DELETE CASCADE,
    alliance_name TEXT NOT NULL, -- e.g., 'NDA', 'UPA', 'Mahagathbandhan'
    is_pre_poll BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(election_id, party_id)
);
-- 9. Constraints
ALTER TABLE public.constituency_historical_results
ADD CONSTRAINT unique_constituency_year UNIQUE (constituency_id, year);

-- 8. Enhanced Constituencies
ALTER TABLE public.constituencies
ADD COLUMN IF NOT EXISTS is_bastion BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS associated_leader_id UUID REFERENCES public.leaders(id);

-- Enable RLS for new tables
ALTER TABLE public.political_eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.political_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rivalries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_alliances ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Eras" ON public.political_eras FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.political_events FOR SELECT USING (true);
CREATE POLICY "Public Read Rivalries" ON public.rivalries FOR SELECT USING (true);
CREATE POLICY "Public Read Mentorships" ON public.mentorships FOR SELECT USING (true);
CREATE POLICY "Public Read Alliances" ON public.election_alliances FOR SELECT USING (true);
