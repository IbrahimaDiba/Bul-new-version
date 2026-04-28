import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Target, Shield, Zap } from 'lucide-react';
import { Player } from '../../types';
import { teams } from '../../data/mockData';

interface PlayerStatsCardProps {
  player: Player;
}

const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({ player }) => {
  const team = teams.find(t => t.id === player.team);

  return (
    <div className="bg-white border-4 border-navy-900 shadow-2xl overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        
        {/* Player Image Section */}
        <div className="w-full md:w-2/5 h-80 md:h-auto bg-gray-100 relative overflow-hidden border-b md:border-b-0 md:border-r-4 border-navy-900">
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-navy-900 text-white px-3 py-1 font-black text-xl italic skew-x-[-12deg]">
             #{player.jerseyNumber}
          </div>
          {/* Decorative Team Logo overlay */}
          {team && (
            <div className="absolute bottom-4 left-4 w-24 h-24 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-1000 z-10">
               <img src={team.logo} alt="" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Award className="w-5 h-5 text-gold-500" />
               <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Statistical Leader</span>
            </div>

            <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-navy-900 uppercase tracking-tighter leading-none mb-2 break-words">
              {player.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-xs font-black px-3 py-1 bg-navy-900 text-white uppercase tracking-widest">
                {team?.name || 'Unknown Team'}
              </span>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {player.position} • {player.height}
              </span>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 p-2 sm:p-4">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3 text-crimson-600" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PPG</span>
                 </div>
                 <p className="text-xl sm:text-3xl font-black text-navy-900 tabular-nums">{player.stats.ppg}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 sm:p-4">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">RPG</span>
                 </div>
                 <p className="text-xl sm:text-3xl font-black text-navy-900 tabular-nums">{player.stats.rpg}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 sm:p-4">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3 text-gold-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">APG</span>
                 </div>
                 <p className="text-xl sm:text-3xl font-black text-navy-900 tabular-nums">{player.stats.apg}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 sm:p-4">
                 <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3 text-emerald-600" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">FG%</span>
                 </div>
                 <p className="text-xl sm:text-3xl font-black text-navy-900 tabular-nums">{player.stats.fgp}%</p>
              </div>
            </div>
          </div>

          {/* Action Button - Always visible, especially on mobile */}
          <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
             <div className="flex items-center gap-6">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Season Role</p>
                   <p className="text-xs font-black text-navy-900 uppercase">Starting {player.position}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hometown</p>
                   <p className="text-xs font-black text-navy-900 uppercase">{player.hometown}</p>
                </div>
             </div>
             
             <Link 
               to={`/players/${player.id}`}
               className="inline-flex items-center justify-center gap-3 bg-navy-900 hover:bg-crimson-600 text-white px-8 py-4 font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl"
             >
                View Full Detail <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;
