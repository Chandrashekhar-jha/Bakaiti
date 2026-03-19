-- Enable Public Read for all tables 🔓

DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Public Read Access" ON public.%I FOR SELECT USING (true)', t);
    END LOOP;
END $$;
