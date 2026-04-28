import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedTeams } from '../data/adminContent';
import { Team } from '../types';

const StandingsPage: React.FC = () => {
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  useEffect(() => {
    const reload = () => setAllTeams(getManagedTeams());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const filteredTeams = allTeams
    .filter(team => team.conference === activeConference)
    .sort((a, b) => a.standing - b.standing);

  // Calculate additional statistics
  const teamsWithStats = filteredTeams.map(team => {
    const [wins, losses] = team.record.split('-').map(Number);
    const totalGames = wins + losses;
    const winPercentage = totalGames > 0 ? wins / totalGames : 0;
    const gamesBehind = team.standing === 1 ? 0 : 
      (filteredTeams[0].standing === 1 ? 
        (Number(filteredTeams[0].record.split('-')[0]) - wins) / 2 + 
        (losses - Number(filteredTeams[0].record.split('-')[1])) / 2 : 0);
    
    // Using mock data for stats if available, otherwise simulating
    const stats = team.stats || {
      homeRecord: `${Math.floor(wins * 0.6)}-${Math.floor(losses * 0.4)}`,
      awayRecord: `${wins - Math.floor(wins * 0.6)}-${losses - Math.floor(losses * 0.4)}`,
      lastTenGames: `${Math.floor(Math.random() * 6) + 5}-${Math.floor(Math.random() * 5)}`,
      streak: Math.random() > 0.5 ? `W${Math.floor(Math.random() * 5) + 1}` : `L${Math.floor(Math.random() * 3) + 1}`,
      pointsFor: 1800,
      pointsAgainst: 1600
    };

    return {
      ...team,
      winPercentage,
      gamesBehind,
      homeRecord: stats.homeRecord,
      awayRecord: stats.awayRecord,
      last10: stats.lastTenGames,
      streak: stats.streak
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-4">
              Official Rankings
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              League <span className="text-crimson-500">Standings</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Live updates of team standings, division records, and playoff pictures for the Basketball University League.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-6">
        
        {/* ══════════════ DIVISION SELECTOR ══════════════ */}
        <div className="bg-white border border-gray-200 rounded-lg flex overflow-x-auto scrollbar-none mb-8 max-w-2xl">
          <button
            type="button"
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap outline-none flex-1 sm:flex-none justify-center border-b-4 ${
              activeConference === 'East'
                ? 'text-navy-900 border-crimson-600 bg-gray-50/50'
                : 'text-gray-500 border-transparent hover:text-navy-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveConference('East')}
          >
            Division 1 <span className="hidden sm:inline">(East)</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap outline-none flex-1 sm:flex-none justify-center border-b-4 ${
              activeConference === 'West'
                ? 'text-navy-900 border-crimson-600 bg-gray-50/50'
                : 'text-gray-500 border-transparent hover:text-navy-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveConference('West')}
          >
            Division 2 <span className="hidden sm:inline">(West)</span>
          </button>
        </div>

        {/* ══════════════ STANDINGS TABLE ══════════════ */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white border-b-4 border-crimson-600">
                  <th className="px-4 sm:px-5 py-3 sm:py-4 w-8 sm:w-12 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">Rank</th>
                  <th className="px-4 sm:px-4 py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">Team</th>
                  <th className="px-4 sm:px-4 py-3 sm:py-4 w-12 sm:w-20 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">W-L</th>
                  <th className="px-4 sm:px-4 py-3 sm:py-4 w-12 sm:w-20 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest whitespace-nowrap">Win %</th>
                  <th className="px-4 sm:px-4 py-3 sm:py-4 w-10 sm:w-16 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest whitespace-nowrap">GB</th>
                  <th className="px-4 py-4 w-20 text-center text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Home</th>
                  <th className="px-4 py-4 w-20 text-center text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Away</th>
                  <th className="px-4 py-4 w-20 text-center text-[10px] font-black uppercase tracking-widest whitespace-nowrap">L10</th>
                  <th className="px-4 py-4 w-20 text-center text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamsWithStats.map((team, index) => {
                  const isPlayoffBound = index < 2; // Assuming top 2 make playoffs
                  
                  return (
                    <motion.tr 
                      key={team.id} 
                      className={`hover:bg-gray-50 transition-colors group ${isPlayoffBound ? 'bg-white' : 'bg-gray-50/30'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-4 sm:px-5 py-3 sm:py-4 relative text-center">
                        {isPlayoffBound && (
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" title="Playoff Position" />
                        )}
                        <span className={`font-black italic ${isPlayoffBound ? 'text-navy-900 text-sm sm:text-lg' : 'text-gray-400 text-xs sm:text-base'}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                        <Link to={`/teams/${team.id}`} className="flex items-center gap-2 sm:gap-4">
                          <img 
                            src={team.logo} 
                            alt={team.name} 
                            className="w-7 h-7 sm:w-10 sm:h-10 object-contain shrink-0 mix-blend-multiply"
                          />
                          <div>
                            <div className="font-black text-navy-900 uppercase tracking-tight group-hover:text-crimson-600 transition-colors text-xs sm:text-base hidden sm:block">
                              {team.name}
                            </div>
                            <div className="font-black text-navy-900 uppercase tracking-tight group-hover:text-crimson-600 transition-colors text-[11px] block sm:hidden">
                              {team.abbreviation}
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                              {team.abbreviation}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 sm:px-4 py-3 sm:py-4 text-center font-black text-navy-900 tabular-nums text-[10px] sm:text-base">
                        {team.record}
                      </td>
                      <td className="px-4 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 bg-gray-100 font-bold tabular-nums text-[10px] sm:text-sm text-navy-900 border border-gray-200">
                          {team.winPercentage.toFixed(3).substring(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-4 py-3 sm:py-4 text-center font-bold text-gray-500 tabular-nums text-[10px] sm:text-base whitespace-nowrap">
                        {team.gamesBehind === 0 ? '-' : team.gamesBehind}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-500 tabular-nums text-sm whitespace-nowrap">
                        {team.homeRecord}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-gray-500 tabular-nums text-sm whitespace-nowrap">
                        {team.awayRecord}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-gray-600 tabular-nums text-sm whitespace-nowrap">
                        {team.last10}
                      </td>
                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-black uppercase tracking-wider ${
                          team.streak.startsWith('W') 
                          ? 'text-green-700 bg-green-50 border border-green-200' 
                          : team.streak.startsWith('L') 
                            ? 'text-red-700 bg-red-50 border border-red-200'
                            : 'text-gray-700 bg-gray-100 border border-gray-200'
                        }`}>
                          {team.streak.startsWith('W') ? <ArrowUp className="w-3 h-3" /> : team.streak.startsWith('L') ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          {team.streak}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════ DIRECTORY & LEGEND ══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-gray-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-500" /> Playoff Scenario
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              The top 2 teams from each division will qualify for the post-season championship tournament. Teams with identical records are seeded based on head-to-head match results, followed by overall point differential.
            </p>
            <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clinched Playoff Berth</span>
            </div>
          </div>

          <div className="md:col-span-1 bg-white border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Legend</h3>
            <ul className="space-y-3 text-xs font-semibold text-gray-500">
              <li className="flex justify-between">
                <span className="text-navy-900 w-12 uppercase">W-L</span> <span>Win-Loss Record</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-900 w-12 uppercase">Win %</span> <span>Winning Percentage</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-900 w-12 uppercase">GB</span> <span>Games Behind Leader</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-900 w-12 uppercase">L10</span> <span>Record in Last 10</span>
              </li>
              <li className="flex justify-between">
                <span className="text-navy-900 w-12 uppercase">Strk</span> <span>Current Streak</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StandingsPage;