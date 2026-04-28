import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, PlayCircle, Trophy, Ticket, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_CONTENT_EVENT, getManagedGames } from '../data/adminContent';
import { Game } from '../types';

const GamesPage: React.FC = () => {
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [allGames, setAllGames] = useState<Game[]>([]);

  useEffect(() => {
    const reload = () => setAllGames(getManagedGames());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  // Sort completed games newest first, and upcoming games soonest first
  const filteredGames = allGames
    .filter(game => filter === 'upcoming' ? !game.isCompleted : game.isCompleted)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (filter === 'upcoming') {
        return dateCompare === 0 ? a.time.localeCompare(b.time) : dateCompare;
      } else {
        return dateCompare === 0 ? b.time.localeCompare(a.time) : -dateCompare;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
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
              Games <span className="text-crimson-500">Hub</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl font-medium">
              Your central access point for schedules, live scores, results, and highlights in the Basketball University League.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        
        {/* ══════════════ QUICK NAVIGATION LINKS ══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link to="/games/schedule" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:border-crimson-500 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-navy-900 group-hover:text-crimson-500 transition-colors" />
              <div>
                <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider">Full Schedule</h3>
                <span className="text-xs text-gray-500">Upcoming games & tickets</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-crimson-500" />
          </Link>
          <Link to="/games/results" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:border-crimson-500 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-navy-900 group-hover:text-crimson-500 transition-colors" />
              <div>
                <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider">Game Results</h3>
                <span className="text-xs text-gray-500">Scores & box stats</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-crimson-500" />
          </Link>
          <Link to="/games/highlights" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:border-crimson-500 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-8 h-8 text-navy-900 group-hover:text-crimson-500 transition-colors" />
              <div>
                <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider">Highlights</h3>
                <span className="text-xs text-gray-500">Video replays & recap</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-crimson-500" />
          </Link>
        </div>

        {/* ══════════════ FILTER TABS ══════════════ */}
        <div className="bg-white border-b border-gray-200 flex overflow-x-auto shadow-sm rounded-t-lg">
          <button
            className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-widest transition-all outline-none ${
              filter === 'upcoming'
                ? 'text-navy-900 border-b-4 border-crimson-600 bg-gray-50/50'
                : 'text-gray-400 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
             onClick={() => setFilter('upcoming')}
          >
            Upcoming Action
          </button>
          <button
            className={`flex-1 py-4 px-6 font-bold text-sm uppercase tracking-widest transition-all outline-none ${
              filter === 'completed'
                ? 'text-navy-900 border-b-4 border-crimson-600 bg-gray-50/50'
                : 'text-gray-400 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
            onClick={() => setFilter('completed')}
          >
            Recent Results
          </button>
        </div>

        {/* ══════════════ GAMES FEED ══════════════ */}
        <div className="bg-gray-50 border-x border-b border-gray-200 rounded-b-lg p-4 sm:p-8">
          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              {filter === 'upcoming' ? <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" /> : <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
              <h3 className="text-2xl font-bold text-navy-900">No Games Found</h3>
              <p className="text-gray-500 mt-2">There are currently no {filter} games to display.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredGames.map((game, index) => {
                  const isHomeWinner = filter === 'completed' && game.homeScore !== undefined && game.awayScore !== undefined && game.homeScore > game.awayScore;
                  const isAwayWinner = filter === 'completed' && game.homeScore !== undefined && game.awayScore !== undefined && game.awayScore > game.homeScore;

                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-gray-300 transition-all flex flex-col group overflow-hidden"
                    >
                      {/* Top Bar */}
                      <div className="bg-gray-50 border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 py-2.5">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <span className={`${filter === 'completed' ? 'text-crimson-600' : 'text-navy-900'} flex items-center gap-1.5`}>
                            {filter === 'completed'
                              ? 'Final'
                              : game.status === 'live'
                                ? 'Live'
                                : <><Calendar className="w-3.5 h-3.5" /> {formatDate(game.date)}</>}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                          {filter === 'completed' && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(game.date)}</span>}
                          {filter === 'upcoming' && (
                            game.status === 'live'
                              ? <span className="text-red-600 font-black uppercase tracking-wider">Live now</span>
                              : <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-crimson-600" /> {game.time} ET</span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center">
                        
                        {/* Matchup */}
                        <div className="flex-1 flex items-center justify-between sm:justify-start gap-4 lg:gap-12 w-full md:w-auto">
                          
                          {/* Away Team */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 sm:flex-none text-center sm:text-left relative min-w-[120px]">
                            <img src={game.awayTeam.logo} alt="" className="w-14 h-14 object-contain" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Away</span>
                              <span className={`text-lg sm:text-xl font-bold truncate max-w-full ${isAwayWinner ? 'text-navy-900' : (filter === 'completed' ? 'text-gray-500' : 'text-navy-900')}`}>
                                {game.awayTeam.name}
                              </span>
                            </div>
                            {/* Score Block for Completed Games */}
                            {filter === 'completed' && (
                              <div className="sm:ml-auto">
                                <span className={`text-3xl sm:text-4xl tabular-nums block text-center ${isAwayWinner ? 'font-black text-navy-900' : 'font-bold text-gray-400'}`}>
                                  {game.awayScore}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* VS or AT Divider */}
                          <div className="flex flex-col items-center justify-center shrink-0">
                            {filter === 'upcoming' ? (
                              <span className="text-gray-300 font-black text-xl italic mx-2">@</span>
                            ) : (
                              <div className="h-full w-px bg-gray-200 mx-4" />
                            )}
                          </div>

                          {/* Home Team */}
                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-1 sm:flex-none text-center sm:text-right sm:flex-row-reverse relative min-w-[120px]">
                            <img src={game.homeTeam.logo} alt="" className="w-14 h-14 object-contain" />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Home</span>
                              <span className={`text-lg sm:text-xl font-bold truncate max-w-full ${isHomeWinner ? 'text-navy-900' : (filter === 'completed' ? 'text-gray-500' : 'text-navy-900')}`}>
                                {game.homeTeam.name}
                              </span>
                            </div>
                            {/* Score Block for Completed Games */}
                            {filter === 'completed' && (
                              <div className="sm:mr-auto">
                                <span className={`text-3xl sm:text-4xl tabular-nums block text-center ${isHomeWinner ? 'font-black text-navy-900' : 'font-bold text-gray-400'}`}>
                                  {game.homeScore}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Venue / Actions */}
                        <div className="mt-6 md:mt-0 pt-6 md:pt-0 border-t border-gray-100 md:border-t-0 md:border-l md:pl-8 flex flex-col md:items-end justify-center min-w-[180px] shrink-0">
                          <div className="flex items-start md:justify-end gap-2 text-sm text-gray-600 mb-4">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-left md:text-right font-medium">{game.venue}</span>
                          </div>
                          
                            {filter === 'upcoming' ? (
                            <Link 
                              to={`/tickets/${game.id}`}
                                className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded text-sm font-bold transition-colors ${game.status === 'live' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-crimson-600 hover:bg-crimson-700 text-white'}`}
                            >
                                <Ticket className="w-4 h-4" /> {game.status === 'live' ? 'Watch Live' : 'Tickets'}
                            </Link>
                          ) : (
                            <Link 
                              to={`/games/results`}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-navy-900 text-navy-900 px-6 py-2.5 rounded text-sm font-bold transition-colors"
                            >
                              Box Score <ArrowRightCircle className="w-4 h-4" />
                            </Link>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;