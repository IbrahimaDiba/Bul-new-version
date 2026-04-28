import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Ticket } from 'lucide-react';
import { Game } from '../../types';
import { ADMIN_CONTENT_EVENT, getManagedGames } from '../../data/adminContent';

const UpcomingGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const reload = () => setGames(getManagedGames());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const upcomingGames = games.filter(game => !game.isCompleted).slice(0, 4);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).toUpperCase();
  };

  if (upcomingGames.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
          <div>
            <span className="text-crimson-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">Match Center</span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 uppercase tracking-tight leading-none">Upcoming Games</h2>
          </div>
          <Link 
            to="/games/schedule" 
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-navy-900 hover:text-crimson-600 transition-colors shrink-0"
          >
            Full Schedule
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingGames.map((game) => (
            <div 
              key={game.id} 
              className="bg-white border border-gray-200 shadow-sm flex flex-col group hover:border-crimson-600 transition-colors relative overflow-hidden"
            >
              {/* Date Header */}
              <div className="bg-gray-50 border-b border-gray-100 p-3 text-center flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {formatDate(game.date)}
                </span>
                {game.status === 'live' ? (
                  <span className="text-[10px] font-black text-red-600 tracking-widest uppercase">Live</span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {game.time}
                  </span>
                )}
              </div>

              {/* Teams VS Block */}
              <div className="p-6 flex flex-col gap-6 flex-1">
                
                {/* Away Team */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 shrink-0">
                       <img src={game.awayTeam.logo} alt="" className="w-full h-full object-contain transition-all" />
                     </div>
                     <span className="font-black text-navy-900 uppercase tracking-tight text-lg leading-none">{game.awayTeam.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400">{game.awayTeam.record}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-gray-100 flex-1"></div>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">VS</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* Home Team */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 shrink-0">
                       <img src={game.homeTeam.logo} alt="" className="w-full h-full object-contain transition-all" />
                     </div>
                     <span className="font-black text-navy-900 uppercase tracking-tight text-lg leading-none">{game.homeTeam.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400">{game.homeTeam.record}</span>
                </div>

                {game.status === 'live' && (
                  <div className="flex items-center justify-center gap-3 text-sm font-black text-navy-900">
                    <span>{game.awayScore ?? 0}</span>
                    <span className="text-red-600 text-xs uppercase tracking-widest">Live</span>
                    <span>{game.homeScore ?? 0}</span>
                  </div>
                )}
              </div>

              {/* Footer / Match Info Context */}
              <div className="bg-gray-50/50 border-t border-gray-100 p-4">
                 <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                   <MapPin className="w-3 h-3 mr-1.5 text-crimson-600 shrink-0" />
                   <span className="truncate">{game.venue}</span>
                 </div>
                 
                 <Link
                   to={`/tickets/${game.id}`}
                   className="flex items-center justify-center gap-2 w-full bg-navy-900 hover:bg-crimson-600 text-white p-3 text-xs font-black uppercase tracking-widest transition-colors shadow-sm"
                 >
                   <Ticket className="w-3.5 h-3.5" />
                   Tickets
                 </Link>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-crimson-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingGames;