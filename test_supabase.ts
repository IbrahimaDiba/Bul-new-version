import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (url && key) {
  const supabase = createClient(url, key);
  async function run() {
    console.log('Querying without image...');
    const res1 = await supabase.from('products').select('id, name').limit(10);
    console.log('Result without image:', res1.data?.length, res1.error);
    
    // Also try selecting the image for the first one to see if that times out
    if (res1.data && res1.data.length > 0) {
      console.log('Querying WITH image for 1 product...');
      const res2 = await supabase.from('products').select('*').eq('id', res1.data[0].id).limit(1);
      console.log('Result with image:', res2.data?.length, res2.error);
      if (res2.data) {
         console.log('Image length:', res2.data[0].image?.length);
      }
    }
  }
  run();
} else {
  console.log('Could not parse credentials');
}
