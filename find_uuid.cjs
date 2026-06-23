const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');

async function find() {
  const uuid = 'ef45c207-92b9-48aa-be28-b6b8122419c5';
  
  const tables = ['players', 'teams', 'games', 'game_player_stats', 'player_season_stats'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').eq(table === 'game_player_stats' || table === 'player_season_stats' ? 'player_id' : 'id', uuid);
    if (data && data.length > 0) {
      console.log(`Trouvé dans la table ${table} !`);
      console.log(JSON.stringify(data, null, 2));
      return;
    }
    
    if (table === 'games') {
      const { data: d2 } = await supabase.from('games').select('*').or(`home_team_id.eq.${uuid},away_team_id.eq.${uuid}`);
      if (d2 && d2.length > 0) {
        console.log(`C'est un TEAM ID dans un game !`);
        return;
      }
    }
  }
  console.log("UUID non trouvé.");
}
find();
