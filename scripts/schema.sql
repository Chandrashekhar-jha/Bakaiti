-- Bakaiti Master Schema: Political Archive 🇮🇳

-- 1. States Table
CREATE TABLE public.states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    total_assembly_seats INTEGER DEFAULT 0,
    total_lok_sabha_seats INTEGER DEFAULT 0,
    current_cm TEXT,
    quick_facts TEXT[],
    national_influence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. State Eras
CREATE TABLE public.state_eras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Parties
CREATE TABLE public.parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#666666',
    ideology TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Alliances
CREATE TABLE public.alliances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_winner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Leaders
CREATE TABLE public.leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    party_id UUID REFERENCES public.parties(id),
    state_id UUID REFERENCES public.states(id),
    era TEXT,
    thumbnail TEXT,
    summary TEXT,
    description TEXT,
    achievements TEXT[],
    controversies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Elections
CREATE TABLE public.elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    type TEXT CHECK (type IN ('State', 'National', 'Municipal', 'Local')),
    election_type TEXT DEFAULT 'assembly', -- 'assembly' or 'parliament'
    title TEXT,
    dramatic_hook TEXT,
    summary TEXT,
    background TEXT,
    campaign_strategy JSONB,
    public_mood TEXT,
    shocking_moments TEXT[],
    winner_alliance_id UUID REFERENCES public.alliances(id),
    winner_party_id UUID REFERENCES public.parties(id),
    seats_won INTEGER,
    total_seats INTEGER,
    before_power TEXT,
    after_power TEXT,
    impact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(state_id, year, type)
);

-- 7. Constituencies
CREATE TABLE public.constituencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    type TEXT,
    significance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Constituency Results
CREATE TABLE public.constituency_historical_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    constituency_id UUID REFERENCES public.constituencies(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    winner_name TEXT,
    winner_party_id UUID REFERENCES public.parties(id),
    runner_up_name TEXT,
    runner_up_party_id UUID REFERENCES public.parties(id),
    margin INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Stories
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    state_id UUID REFERENCES public.states(id),
    election_id UUID REFERENCES public.elections(id),
    thumbnail TEXT,
    excerpt TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and public read access (Dev Policy)
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON public.states FOR SELECT USING (true);
-- ... (Repeat for other tables as needed)
