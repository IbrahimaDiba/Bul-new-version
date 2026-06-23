const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');

async function check() {
  const { data, error } = await supabase.from('games').select('*');
  console.log("Games in Supabase:", data ? data.length : 0);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
    const gameWithStats = data.find(g => g.player_stats != null);
    if (gameWithStats) {
      console.log("Found game with player_stats column!");
    } else {
      console.log("No player_stats column or all are null.");
    }
  }
}
check();
