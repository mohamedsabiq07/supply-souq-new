import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eorbgqrrjoojwikqgeek.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SdXBs-3LSBFTCyQO1rd1Xw_nwsNGHSL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
