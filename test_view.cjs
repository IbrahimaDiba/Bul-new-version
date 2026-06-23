const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://mdwbliwwtumqkwlbyukq.supabase.co', 'sb_publishable_QDm9pmWVNE643OqIQsKYGg_4oj772tu');

// Simule exactement ce que la vue SQL va calculer
async function simulateView() {
  const [gamesRes, statsRes] = await Promise.all([
    supabase.from('games').select('id, status'),
    supabase.from('game_player_stats').select('*')
  ]);

  const completedGameIds = new Set(
    (gamesRes.data || []).filter(g => g.status === 'completed').map(g => g.id)
  );

  const stats = (statsRes.data || []).filter(s => completedGameIds.has(s.game_id));

  // Group by player_id
  const byPlayer = {};
  stats.forEach(s => {
    if (!byPlayer[s.player_id]) byPlayer[s.player_id] = [];
    byPlayer[s.player_id].push(s);
  });

  const results = Object.entries(byPlayer).map(([playerId, rows]) => {
    const n = rows.length;
    const sum = (key) => rows.reduce((acc, r) => acc + (r[key] || 0), 0);
    const avg = (key) => parseFloat((sum(key) / n).toFixed(1));
    const pct = (made, att) => sum(att) > 0 ? parseFloat(((sum(made) / sum(att)) * 100).toFixed(1)) : 0;
    return {
      player_id: playerId,
      games_played: new Set(rows.map(r => r.game_id)).size,
      ppg: avg('points'), rpg: avg('rebounds'), apg: avg('assists'),
      spg: avg('steals'), bpg: avg('blocks'),
      fgp: pct('fgm','fga'), tpp: pct('tpm','tpa'), ftp: pct('ftm','fta'),
      raw_pts: sum('points') / n
    };
  });

  // Add ranks
  const rank = (key) => {
    const sorted = [...results].sort((a,b) => b[key] - a[key]);
    results.forEach(r => { r[key+'_rank'] = sorted.findIndex(s => s.player_id === r.player_id) + 1; });
  };
  rank('ppg'); rank('rpg'); rank('apg'); rank('spg'); rank('bpg');
  rank('fgp'); rank('tpp'); rank('ftp');

  results.forEach(r => { delete r.raw_pts; });
  console.log('Résultats simulés:', JSON.stringify(results, null, 2));
  console.log('\nNombre de joueurs avec des stats:', results.length);
  console.log('Matchs completés:', completedGameIds.size);
}

simulateView().catch(console.error);
