import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Shield, Crosshair, ArrowUpDown } from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedTeams } from '../data/adminContent';
import { Team } from '../types';
import { Link } from 'react-router-dom';

type SortKey = 'name' | 'winPercentage' | 'pointsFor' | 'pointsAgainst' | 'pointDiff';

const TeamStatsPage: React.FC = () => {
  const [sortKey, setSortKey] = useState<SortKey>('winPercentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const [allTeams, setAllTeams] = useState<Team[]>([]);

  React.useEffect(() => {
    const reload = () => setAllTeams(getManagedTeams());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const enhancedTeams = allTeams.map((team) => {
    return {
      ...team,
      pointDiff: (team.stats?.pointsFor || 0) - (team.stats?.pointsAgainst || 0)
    };
  });

  const sortedTeams = [...enhancedTeams].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'winPercentage':
        comparison = (a.stats?.winPercentage || 0) - (b.stats?.winPercentage || 0);
        break;
      case 'pointsFor':
        comparison = (a.stats?.pointsFor || 0) - (b.stats?.pointsFor || 0);
        break;
      case 'pointsAgainst':
        comparison = (a.stats?.pointsAgainst || 0) - (b.stats?.pointsAgainst || 0);
        break;
      case 'pointDiff':
        comparison = a.pointDiff - b.pointDiff;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
              <TrendingUp className="h-3 w-3 text-crimson-500" /> Advanced Analytics
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              Team <span className="text-crimson-500">Statistics</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Comprehensive team performance metrics, offensive efficiency, and defensive rankings across the league.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ══════════════ STATS HIGHLIGHTS ══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {enhancedTeams.length > 0 && (
            <>
              <div className="bg-white border border-gray-200 p-6 shadow-sm group hover:border-crimson-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-crimson-50">
                    <Crosshair className="w-5 h-5 text-crimson-600" />
                  </div>
                  <h3 className="font-bold text-navy-900 uppercase tracking-wider text-sm">Best Offense</h3>
                </div>
                <div className="flex items-center gap-4">
                  <img src={enhancedTeams.sort((a,b)=>(b.stats?.pointsFor || 0) - (a.stats?.pointsFor || 0))[0].logo} className="w-12 h-12 object-contain" alt="" />
                  <div>
                    <div className="font-black text-2xl text-navy-900 uppercase tracking-tight">
                      {enhancedTeams.sort((a,b)=>(b.stats?.pointsFor || 0) - (a.stats?.pointsFor || 0))[0].name}
                    </div>
                    <div className="text-sm font-bold text-gray-400">
                      {enhancedTeams.sort((a,b)=>(b.stats?.pointsFor || 0) - (a.stats?.pointsFor || 0))[0].stats?.pointsFor || 0} PTS
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 shadow-sm group hover:border-navy-400 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-navy-50">
                    <Shield className="w-5 h-5 text-navy-900" />
                  </div>
                  <h3 className="font-bold text-navy-900 uppercase tracking-wider text-sm">Best Defense</h3>
                </div>
                <div className="flex items-center gap-4">
                  <img src={enhancedTeams.sort((a,b)=>(a.stats?.pointsAgainst || 0) - (b.stats?.pointsAgainst || 0))[0].logo} className="w-12 h-12 object-contain" alt="" />
                  <div>
                    <div className="font-black text-2xl text-navy-900 uppercase tracking-tight">
                      {enhancedTeams.sort((a,b)=>(a.stats?.pointsAgainst || 0) - (b.stats?.pointsAgainst || 0))[0].name}
                    </div>
                    <div className="text-sm font-bold text-gray-400">
                      {enhancedTeams.sort((a,b)=>(a.stats?.pointsAgainst || 0) - (b.stats?.pointsAgainst || 0))[0].stats?.pointsAgainst || 0} PA
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 shadow-sm group hover:border-gold-400 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-yellow-50">
                    <TrendingUp className="w-5 h-5 text-gold-500" />
                  </div>
                  <h3 className="font-bold text-navy-900 uppercase tracking-wider text-sm">Best Diff</h3>
                </div>
                <div className="flex items-center gap-4">
                  <img src={enhancedTeams.sort((a,b)=>b.pointDiff - a.pointDiff)[0].logo} className="w-12 h-12 object-contain" alt="" />
                  <div>
                    <div className="font-black text-2xl text-navy-900 uppercase tracking-tight">
                      {enhancedTeams.sort((a,b)=>b.pointDiff - a.pointDiff)[0].name}
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      +{enhancedTeams.sort((a,b)=>b.pointDiff - a.pointDiff)[0].pointDiff} DIFF
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ══════════════ STATS TABLE ══════════════ */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white border-b-2 border-crimson-600">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer whitespace-nowrap" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2 hover:text-crimson-400">
                      Team <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center cursor-pointer" onClick={() => handleSort('winPercentage')}>
                     <div className="flex items-center justify-center gap-2 hover:text-crimson-400">
                      Win % <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center cursor-pointer" onClick={() => handleSort('pointsFor')}>
                     <div className="flex items-center justify-center gap-2 hover:text-crimson-400">
                      PTS For <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center cursor-pointer" onClick={() => handleSort('pointsAgainst')}>
                     <div className="flex items-center justify-center gap-2 hover:text-crimson-400">
                      PTS Agnst <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center cursor-pointer" onClick={() => handleSort('pointDiff')}>
                     <div className="flex items-center justify-center gap-2 hover:text-crimson-400">
                      DIFF <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center hidden md:table-cell">Home</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center hidden md:table-cell">Away</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center hidden lg:table-cell">L10</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center hidden lg:table-cell">STRK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedTeams.map((team, index) => (
                  <motion.tr 
                    key={team.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/teams/${team.id}`} className="flex items-center gap-4">
                        <span className="text-gray-400 font-bold italic text-sm w-4">{index + 1}</span>
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-sm p-1 shadow-sm group-hover:border-navy-900 transition-colors">
                          <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="font-black text-navy-900 uppercase tracking-tight text-lg group-hover:text-crimson-600 transition-colors">
                          {team.name}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center bg-navy-50 text-navy-900 px-3 py-1 font-bold rounded-sm border border-navy-100">
                        {((team.stats?.winPercentage || 0) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700 tabular-nums">
                      {(team.stats?.pointsFor || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700 tabular-nums">
                      {(team.stats?.pointsAgainst || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-black tabular-nums">
                      <span className={team.pointDiff > 0 ? 'text-green-600' : team.pointDiff < 0 ? 'text-red-500' : 'text-gray-500'}>
                        {team.pointDiff > 0 ? '+' : ''}{team.pointDiff}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-500 text-sm hidden md:table-cell">
                      {team.stats?.homeRecord || '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-500 text-sm hidden md:table-cell">
                      {team.stats?.awayRecord || '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-500 text-sm hidden lg:table-cell">
                      {team.stats?.lastTenGames || '-'}
                    </td>
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${
                        (team.stats?.streak || '').startsWith('W') ? 'bg-green-100 text-green-700' : (team.stats?.streak || '').startsWith('L') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {team.stats?.streak || '-'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamStatsPage;
