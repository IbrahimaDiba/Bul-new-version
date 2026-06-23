const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');
try {
  const query = supabase.from('game_player_stats').select('*');
  console.log("Has catch?", typeof query.catch === 'function');
} catch (e) {
  console.log(e);
}
