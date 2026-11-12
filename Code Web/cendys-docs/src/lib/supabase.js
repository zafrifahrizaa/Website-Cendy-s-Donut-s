import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function normalizeSupabaseUrl(value) {
  if (!value || !value.startsWith('http') || value.includes('your-project-id')) {
    return null;
  }
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

