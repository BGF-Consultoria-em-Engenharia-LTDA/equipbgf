// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://otzddoohtrwhmqzbnbam.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emRkb29odHJ3aG1xemJuYmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODg4MzAsImV4cCI6MjA1Nzk2NDgzMH0.dMZbDKJOmUB0ggVyl1O4ZfcB1H4RHDkksnzLRLyMVaA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);