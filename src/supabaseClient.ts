import { createClient } from '@supabase/supabase-js';

// Utilise exactement l'URL et la clé copiées depuis Supabase > Project Settings > API
const supabaseUrl = 'https://casxhdzyhddhupkltakw.supabase.co'; // Ne pas ajouter d'espace ou de guillemets en trop
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhc3hoZHp5aGRkaHVwa2x0YWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDQzMzYsImV4cCI6MjA2NTkyMDMzNn0.2uG2QmuXkl2YG9-zaVXbyL8z3iFBPPKVFhye8C0WyHc'; // Ne pas couper la clé, ni ajouter de retour à la ligne

if (!supabaseUrl.startsWith('https://') || !supabaseUrl.endsWith('.supabase.co')) {
  // Affiche une erreur claire dans la console si l'URL est mal formée
  console.error('Supabase URL is invalid:', supabaseUrl);
}
if (!supabaseKey || supabaseKey.length < 60) {
  // Affiche une erreur claire si la clé semble trop courte
  console.error('Supabase Key is invalid or missing:', supabaseKey);
}

export const supabase = createClient(supabaseUrl, supabaseKey);