import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, ChevronRight, Trophy, ArrowRightCircle, BarChart2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getManagedGames, getManagedTeams, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import type { Game, PlayerGameStats, Team } from '../types';

function groupGamesByDateNewestFirst(gameList: Game[]): Map<string, Game[]> {
  const sorted = [...gameList].sort((a, b) => {
    const d = b.date.localeCompare(a.date);
    if (d !== 0) return d;
    return b.time.localeCompare(a.time);
  });
  const map = new Map<string, Game[]>();
  for (const game of sorted) {
    const list = map.get(game.date) ?? [];
    list.push(game);
    map.set(game.date, list);
  }
  return map;
}

function getWinner(game: Game): 'home' | 'away' | 'tie' | null {
  const h = game.homeScore;
  const a = game.awayScore;
  if (h === undefined || a === undefined) return null;
  if (h > a) return 'home';
  if (a > h) return 'away';
  return 'tie';
}

const GamesResultsPage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedStatsGame, setSelectedStatsGame] = useState<Game | null>(null);

  React.useEffect(() => {
    const loadGames = () => {
      setAllGames(getManagedGames());
      setAllTeams(getManagedTeams());
    };
    loadGames();
    window.addEventListener('storage', loadGames);
    window.addEventListener(ADMIN_CONTENT_EVENT, loadGames);
    return () => {
      window.removeEventListener('storage', loadGames);
      window.removeEventListener(ADMIN_CONTENT_EVENT, loadGames);
    };
  }, []);

  const completedGames = useMemo(() => {
    return allGames.filter((g) => g.isCompleted);
  }, [allGames]);

  const filteredGames = useMemo(() => {
    return completedGames.filter((g) => {
      // Team filter
      const matchesTeam = teamFilter === 'all' || g.homeTeam.id === teamFilter || g.awayTeam.id === teamFilter;
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = g.homeTeam.name.toLowerCase().includes(searchLower) || 
                            g.awayTeam.name.toLowerCase().includes(searchLower) ||
                            g.venue.toLowerCase().includes(searchLower);
      
      return matchesTeam && matchesSearch;
    });
  }, [completedGames, teamFilter, searchQuery]);

  const byDate = useMemo(() => groupGamesByDateNewestFirst(filteredGames), [filteredGames]);

  // Formats date nicely e.g. "FRIDAY, NOV 24"
  const formatSectionDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase">
              Game <span className="text-crimson-500">Results</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl font-medium">
              Official scores, recaps, and final statistics from the Basketball University League.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        
        {/* ══════════════ FILTER DESK & SEARCH ══════════════ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Team Dropdown */}
            <div className="relative">
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full sm:w-64 appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="all">All Teams</option>
                {allTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-10 pr-4 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider bg-gray-50 px-4 py-2 rounded-md border border-gray-100 hidden md:block">
            {filteredGames.length} Game{filteredGames.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ══════════════ SCOREBOARD FEED ══════════════ */}
        {filteredGames.length === 0 ? (
          <div className="bg-white border text-center border-gray-200 rounded-lg p-16 shadow-sm">
            <Trophy className="mx-auto h-16 w-16 text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-navy-900">No results found</h3>
            <p className="mt-2 text-gray-500 text-lg">Adjust your search or team filter to find completed games.</p>
            <button 
              onClick={() => {setTeamFilter('all'); setSearchQuery('');}}
              className="mt-6 px-6 py-2.5 bg-navy-900 text-white rounded-md font-semibold hover:bg-navy-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Array.from(byDate.entries()).map(([dateKey, dayGames]) => (
              <motion.div 
                key={dateKey}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
              >
                {/* Section Header */}
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b-2 border-crimson-600 pb-2 mb-6 inline-block">
                  {formatSectionDate(dateKey)}
                </h2>

                {/* Scoreboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dayGames.map((game) => {
                    const winner = getWinner(game);
                    const hs = game.homeScore ?? 0;
                    const as = game.awayScore ?? 0;
                    
                    const isHomeWinner = winner === 'home';
                    const isAwayWinner = winner === 'away';

                    return (
                      <div key={game.id} className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                        
                        {/* Game Status Bar */}
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                          <span className="text-crimson-600">Final</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {game.time}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {game.venue}</span>
                          </div>
                        </div>

                        {/* Middle Content - The Teams */}
                        <div className="p-5 flex-1 relative">
                          <div className="space-y-4">
                            
                            {/* Home Team Row */}
                            <div className="flex items-center justify-between">
                              <Link to={`/teams/${game.homeTeam.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                                <div className="w-12 h-12 bg-gray-50 p-1.5 rounded-sm border border-gray-100 flex-shrink-0">
                                  <img src={game.homeTeam.logo} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Home</span>
                                  <span className={`text-xl font-bold truncate ${isHomeWinner ? 'text-navy-900' : 'text-gray-500'}`}>
                                    {game.homeTeam.name}
                                  </span>
                                </div>
                              </Link>
                              
                              <div className="flex items-center gap-3">
                                {isHomeWinner && <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-crimson-600 border-b-[6px] border-b-transparent"></div>}
                                <span className={`text-3xl tabular-nums w-12 text-right ${isHomeWinner ? 'font-black text-navy-900' : 'font-bold text-gray-400'}`}>
                                  {hs}
                                </span>
                              </div>
                            </div>

                            {/* Divider Line */}
                            <div className="h-px w-full bg-gray-100"></div>

                            {/* Away Team Row */}
                            <div className="flex items-center justify-between">
                              <Link to={`/teams/${game.awayTeam.id}`} className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
                                <div className="w-12 h-12 bg-gray-50 p-1.5 rounded-sm border border-gray-100 flex-shrink-0">
                                  <img src={game.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Away</span>
                                  <span className={`text-xl font-bold truncate ${isAwayWinner ? 'text-navy-900' : 'text-gray-500'}`}>
                                    {game.awayTeam.name}
                                  </span>
                                </div>
                              </Link>
                              
                              <div className="flex items-center gap-3">
                                {isAwayWinner && <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-crimson-600 border-b-[6px] border-b-transparent"></div>}
                                <span className={`text-3xl tabular-nums w-12 text-right ${isAwayWinner ? 'font-black text-navy-900' : 'font-bold text-gray-400'}`}>
                                  {as}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="bg-white border-t border-gray-100 p-0 flex">
                           <Link 
                            to={`/teams/${game.homeTeam.id}`} 
                            className="flex-1 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-navy-900 transition-colors border-r border-gray-100"
                           >
                            View Home Team
                           </Link>
                           <button 
                            onClick={() => setSelectedStatsGame(game)}
                            className="flex-1 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-navy-900 transition-colors border-r border-gray-100 flex items-center justify-center gap-2"
                           >
                            <BarChart2 className="w-4 h-4" /> Box Score
                           </button>
                           <Link 
                            to={`/teams/${game.awayTeam.id}`} 
                            className="flex-1 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 hover:text-navy-900 transition-colors"
                           >
                            View Away Team
                           </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* ══════════════ QUICK NAVIGATION ══════════════ */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/games/schedule" className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:border-crimson-600 hover:shadow-md transition-all group">
            <div>
              <h4 className="text-navy-900 font-bold text-lg mb-1">Upcoming Games</h4>
              <p className="text-gray-500 text-sm">See the full season schedule & buy tickets</p>
            </div>
            <ArrowRightCircle className="text-gray-300 group-hover:text-crimson-600 w-8 h-8 transition-colors" />
          </Link>
          <Link to="/teams/standings" className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:border-navy-900 hover:shadow-md transition-all group">
            <div>
              <h4 className="text-navy-900 font-bold text-lg mb-1">League Standings</h4>
              <p className="text-gray-500 text-sm">See who is leading the championship</p>
            </div>
            <ArrowRightCircle className="text-gray-300 group-hover:text-navy-900 w-8 h-8 transition-colors" />
          </Link>
        </div>

        {/* ══════════════ MODAL: BOX SCORE ══════════════ */}
        <AnimatePresence>
          {selectedStatsGame && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b flex justify-between items-center bg-navy-900 text-white">
                  <div>
                    <h2 className="text-2xl font-black">Box Score</h2>
                    <p className="text-gray-300 text-sm mt-1">{selectedStatsGame.homeTeam.name} vs {selectedStatsGame.awayTeam.name}</p>
                  </div>
                  <button onClick={() => setSelectedStatsGame(null)} className="text-white hover:text-crimson-400 p-2"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                  {(!selectedStatsGame.stats?.playerStats?.home?.length && !selectedStatsGame.stats?.playerStats?.away?.length) ? (
                    <div className="text-center py-10">
                      <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Les statistiques détaillées ne sont pas encore disponibles pour ce match.</p>
                    </div>
                  ) : (
                    <>
                      {/* HOME TEAM STATS */}
                      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-gray-100 px-4 py-3 font-bold text-navy-900 border-b flex items-center gap-3">
                          <img src={selectedStatsGame.homeTeam.logo} alt="" className="w-6 h-6" /> {selectedStatsGame.homeTeam.name}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-white text-gray-500 text-xs uppercase border-b">
                              <tr>
                                <th className="px-4 py-2">Joueur</th>
                                <th className="px-3 py-2 text-center">MIN</th>
                                <th className="px-3 py-2 text-center font-bold text-navy-900">PTS</th>
                                <th className="px-3 py-2 text-center">REB</th>
                                <th className="px-3 py-2 text-center">AST</th>
                                <th className="px-3 py-2 text-center">STL</th>
                                <th className="px-3 py-2 text-center">BLK</th>
                                <th className="px-3 py-2 text-center">TO</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {selectedStatsGame.stats.playerStats.home.map(ps => (
                                <tr key={ps.playerId} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-bold whitespace-nowrap">{ps.name}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.minutes}</td>
                                  <td className="px-3 py-2 text-center font-bold text-navy-900">{ps.points}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.rebounds}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.assists}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.steals}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.blocks}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.turnovers}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* AWAY TEAM STATS */}
                      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-gray-100 px-4 py-3 font-bold text-navy-900 border-b flex items-center gap-3">
                          <img src={selectedStatsGame.awayTeam.logo} alt="" className="w-6 h-6" /> {selectedStatsGame.awayTeam.name}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-white text-gray-500 text-xs uppercase border-b">
                              <tr>
                                <th className="px-4 py-2">Joueur</th>
                                <th className="px-3 py-2 text-center">MIN</th>
                                <th className="px-3 py-2 text-center font-bold text-navy-900">PTS</th>
                                <th className="px-3 py-2 text-center">REB</th>
                                <th className="px-3 py-2 text-center">AST</th>
                                <th className="px-3 py-2 text-center">STL</th>
                                <th className="px-3 py-2 text-center">BLK</th>
                                <th className="px-3 py-2 text-center">TO</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {selectedStatsGame.stats.playerStats.away.map(ps => (
                                <tr key={ps.playerId} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-bold whitespace-nowrap">{ps.name}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.minutes}</td>
                                  <td className="px-3 py-2 text-center font-bold text-navy-900">{ps.points}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.rebounds}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.assists}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.steals}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.blocks}</td>
                                  <td className="px-3 py-2 text-center text-gray-600">{ps.turnovers}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GamesResultsPage;
