
import { createClient } from '@supabase/supabase-js';

// The anon key is safe to be in the client code
const supabaseUrl = 'https://otzddoohtrwhmqzbnbam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90emRkb29odHJ3aG1xemJuYmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzODg4MzAsImV4cCI6MjA1Nzk2NDgzMH0.dMZbDKJOmUB0ggVyl1O4ZfcB1H4RHDkksnzLRLyMVaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
