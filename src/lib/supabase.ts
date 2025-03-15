import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase-types';

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://znohucbxvuitqpparsyb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpub2h1Y2J4dnVpdHFwcGFyc3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1NTMsImV4cCI6MjA1NzE5NTU1M30.YlDfCY2mxPFweLDYNvm8sWnINK1HcZC87p9-NOfUngE';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase; 