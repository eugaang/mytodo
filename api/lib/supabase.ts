import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  category: 'work' | 'personal';
  date: string;
  time?: string;
  created_at: string;
}
