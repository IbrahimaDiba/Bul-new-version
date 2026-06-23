const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');
Promise.all([
  supabase.from('games').select('*'),
  supabase.from('game_player_stats').select('*')
]).then(([gamesRes, statsRes]) => {
  console.log("GAMES:", JSON.stringify(gamesRes.data, null, 2));
  console.log("STATS:", JSON.stringify(statsRes.data, null, 2));
});
