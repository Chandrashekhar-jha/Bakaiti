import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let serviceClient: any = null;

export const getSupabaseService = () => {
  if (!serviceClient) {
    if (!supabaseServiceKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Service role operations will fail.");
    }
    serviceClient = createClient(supabaseUrl, supabaseServiceKey || '');
  }
  return serviceClient;
};

// For backward compatibility while I refactor consumers
export const supabaseService = getSupabaseService();
