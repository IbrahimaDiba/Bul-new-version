import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const content = fs.readFileSync('src/config/supabase.ts', 'utf8');
const urlMatch = content.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = content.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('products').select('id, name, category, price, in_stock, featured, team_id').then(res => {
    console.log('Products without images:', res.data?.length, res.error);
    process.exit(0);
  });
}
