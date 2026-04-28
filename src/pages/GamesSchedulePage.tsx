import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Radio, ChevronRight, Search, Ticket, ArrowRightCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getManagedGames, getManagedTeams, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import type { Game, Team } from '../types';

function groupGamesByDate(gameList: Game[]): Map<string, Game[]> {
  const map = new Map<string, Game[]>();
  const sorted = [...gameList].sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    if (d !== 0) return d;
    return a.time.localeCompare(b.time);
  });
  for (const game of sorted) {
    const list = map.get(game.date) ?? [];
    list.push(game);
    map.set(game.date, list);
  }
  return map;
}

const GamesSchedulePage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  React.useEffect(() => {
    const reload = () => {
      setAllGames(getManagedGames());
      setAllTeams(getManagedTeams());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const scheduledGames = useMemo(() => {
    return allGames.filter((g) => !g.isCompleted);
  }, [allGames]);

  const filteredGames = useMemo(() => {
    return scheduledGames.filter((g) => {
      // Team filter
      const matchesTeam = teamFilter === 'all' || g.homeTeam.id === teamFilter || g.awayTeam.id === teamFilter;
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = g.homeTeam.name.toLowerCase().includes(searchLower) || 
                            g.awayTeam.name.toLowerCase().includes(searchLower) ||
                            g.venue.toLowerCase().includes(searchLower);
      
      return matchesTeam && matchesSearch;
    });
  }, [scheduledGames, teamFilter, searchQuery]);

  const byDate = useMemo(() => groupGamesByDate(filteredGames), [filteredGames]);

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
              Season <span className="text-crimson-500">Schedule</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl font-medium">
              Upcoming matches, venues, and tip-off times for the Basketball University League.
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
                placeholder="Search schedule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-10 pr-4 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider bg-gray-50 px-4 py-2 rounded-md border border-gray-100 hidden md:block">
            {filteredGames.length} Scheduled Game{filteredGames.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ══════════════ SCHEDULE FEED ══════════════ */}
        {filteredGames.length === 0 ? (
          <div className="bg-white border text-center border-gray-200 rounded-lg p-16 shadow-sm">
            <Calendar className="mx-auto h-16 w-16 text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-navy-900">No Upcoming Games</h3>
            <p className="mt-2 text-gray-500 text-lg">Adjust your search or check back later for new fixtures.</p>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b-2 border-gray-200 pb-2">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest relative">
                    <span className="absolute -bottom-[10px] left-0 w-2/3 h-[2px] bg-crimson-600"></span>
                    {formatSectionDate(dateKey)}
                  </h2>
                </div>

                {/* Schedule Items */}
                <div className="space-y-4">
                  {dayGames.map((game) => (
                    <div key={game.id} className="bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                      
                      {/* Top Bar with Time & Broadcast */}
                      <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-crimson-600" />
                          <span className="text-navy-900">{game.time} ET</span>
                        </div>
                        {game.broadcast && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Radio className="w-4 h-4" />
                            {game.broadcast.network}
                          </div>
                        )}
                        {game.status === 'postponed' && <span className="text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded">Postponed</span>}
                        {game.status === 'cancelled' && <span className="text-red-600 border border-red-200 bg-red-50 px-2 py-0.5 rounded">Cancelled</span>}
                      </div>

                      <div className="flex flex-col md:flex-row p-5 md:items-center">
                        
                        {/* The Matchup */}
                        <div className="flex items-center flex-1 justify-between sm:justify-start gap-4 lg:gap-12 w-full md:w-auto">
                          {/* Away Team */}
                          <Link to={`/teams/${game.awayTeam.id}`} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity flex-1 sm:flex-none text-center sm:text-left">
                            <div className="w-14 h-14 bg-gray-50 p-2 rounded-sm border border-gray-100 flex-shrink-0">
                              <img src={game.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Away</span>
                              <span className="text-lg font-bold text-navy-900">{game.awayTeam.name}</span>
                            </div>
                          </Link>

                          <span className="text-gray-300 font-black text-xl italic px-2">@</span>

                          {/* Home Team */}
                          <Link to={`/teams/${game.homeTeam.id}`} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity flex-1 sm:flex-none text-center sm:text-right sm:flex-row-reverse">
                            <div className="w-14 h-14 bg-gray-50 p-2 rounded-sm border border-gray-100 flex-shrink-0">
                              <img src={game.homeTeam.logo} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Home</span>
                              <span className="text-lg font-bold text-navy-900">{game.homeTeam.name}</span>
                            </div>
                          </Link>
                        </div>

                        {/* Venue & Tickets */}
                        <div className="mt-6 md:mt-0 pt-6 md:pt-0 border-t border-gray-100 md:border-t-0 md:border-l md:pl-6 flex flex-col md:items-end justify-center min-w-[200px]">
                          <div className="flex items-start md:justify-end gap-2 text-sm text-gray-600 mb-4">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-left md:text-right font-medium">{game.venue}</span>
                          </div>
                          
                          {game.status !== 'postponed' && game.status !== 'cancelled' ? (
                            <Link 
                              to={`/tickets/${game.id}`}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-2.5 rounded text-sm font-bold transition-colors"
                            >
                              <Ticket className="w-4 h-4" /> Get Tickets
                            </Link>
                          ) : (
                            <button disabled className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-5 py-2.5 rounded text-sm font-bold cursor-not-allowed">
                              Unavailable
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* ══════════════ QUICK NAVIGATION ══════════════ */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/games/results" className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:border-crimson-600 hover:shadow-md transition-all group">
            <div>
              <h4 className="text-navy-900 font-bold text-lg mb-1">Game Results</h4>
              <p className="text-gray-500 text-sm">See the final scores from past matches</p>
            </div>
            <ArrowRightCircle className="text-gray-300 group-hover:text-crimson-600 w-8 h-8 transition-colors" />
          </Link>
          <Link to="/teams/standings" className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:border-navy-900 hover:shadow-md transition-all group">
            <div>
              <h4 className="text-navy-900 font-bold text-lg mb-1">League Standings</h4>
              <p className="text-gray-500 text-sm">Track team rankings & playoff picture</p>
            </div>
            <ArrowRightCircle className="text-gray-300 group-hover:text-navy-900 w-8 h-8 transition-colors" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default GamesSchedulePage;
