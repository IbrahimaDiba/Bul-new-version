const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');
supabase.from('game_player_stats').select('*').limit(1).then(res => {
  if (res.error) console.error(res.error);
  else console.log(JSON.stringify(res.data));
});
