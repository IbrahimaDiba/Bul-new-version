import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  Target,
  Shield,
  Zap,
  Crosshair,
  TrendingUp,
  Star,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedPlayers, getManagedTeams } from '../data/adminContent';
import { Player, Team } from '../types';

// ─── Column definitions ────────────────────────────────────────────────────────
interface Column {
  key: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  accessor: (p: Player) => number;
  unit?: string;
  description: string;
}

const columns: Column[] = [
  {
    key: 'ppg',
    label: 'Points Per Game',
    shortLabel: 'PPG',
    icon: Target,
    accessor: (p) => p.stats?.ppg || 0,
    description: 'Average points scored per game',
  },
  {
    key: 'rpg',
    label: 'Rebounds Per Game',
    shortLabel: 'RPG',
    icon: Shield,
    accessor: (p) => p.stats?.rpg || 0,
    description: 'Average rebounds per game',
  },
  {
    key: 'apg',
    label: 'Assists Per Game',
    shortLabel: 'APG',
    icon: Zap,
    accessor: (p) => p.stats?.apg || 0,
    description: 'Average assists per game',
  },
  {
    key: 'spg',
    label: 'Steals Per Game',
    shortLabel: 'SPG',
    icon: Crosshair,
    accessor: (p) => p.stats?.spg || 0,
    description: 'Average steals per game',
  },
  {
    key: 'bpg',
    label: 'Blocks Per Game',
    shortLabel: 'BPG',
    icon: TrendingUp,
    accessor: (p) => p.stats?.bpg || 0,
    description: 'Average blocks per game',
  },
  {
    key: 'fgp',
    label: 'Field Goal %',
    shortLabel: 'FG%',
    icon: Star,
    accessor: (p) => p.stats?.fgp || 0,
    unit: '%',
    description: 'Field goal shooting percentage',
  },
  {
    key: 'tpp',
    label: 'Three Point %',
    shortLabel: '3P%',
    icon: Target,
    accessor: (p) => p.stats?.tpp || 0,
    unit: '%',
    description: 'Three-point shooting percentage',
  },
  {
    key: 'ftp',
    label: 'Free Throw %',
    shortLabel: 'FT%',
    icon: Star,
    accessor: (p) => p.stats?.ftp || 0,
    unit: '%',
    description: 'Free throw shooting percentage',
  },
];

type SortDir = 'asc' | 'desc';

// ─── Component ────────────────────────────────────────────────────────────────
const PlayerStatsPage: React.FC = () => {
  const [managedPlayers, setManagedPlayers] = React.useState<Player[]>([]);
  const [managedTeams, setManagedTeams] = React.useState<Team[]>([]);
  const [sortKey, setSortKey]     = useState<string>('ppg');
  const [sortDir, setSortDir]     = useState<SortDir>('desc');
  const [search, setSearch]       = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPos, setFilterPos]   = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    const reload = () => {
      setManagedPlayers(getManagedPlayers());
      setManagedTeams(getManagedTeams());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const getTeamName  = (id: string) => managedTeams.find((t) => t.id === id)?.name || '';

  const sortCol = columns.find((c) => c.key === sortKey) || columns[0];

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const positions = useMemo(() => {
    const set = new Set(managedPlayers.map((p) => p.position));
    return Array.from(set).sort();
  }, [managedPlayers]);

  const sortedPlayers = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    return [...managedPlayers]
      .filter((p) => {
        const q = search.toLowerCase();
        const matchSearch = p.name.toLowerCase().includes(q) || getTeamName(p.team).toLowerCase().includes(q);
        const matchTeam   = filterTeam === 'all' || p.team === filterTeam;
        const matchPos    = filterPos  === 'all' || p.position === filterPos;
        return matchSearch && matchTeam && matchPos;
      })
      .sort((a, b) => {
        const av = col?.accessor(a) ?? 0;
        const bv = col?.accessor(b) ?? 0;
        return sortDir === 'desc' ? bv - av : av - bv;
      });
  }, [sortKey, sortDir, search, filterTeam, filterPos, managedPlayers, getTeamName]);

  // League-wide quick stats
  const leagueAvg = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !managedPlayers.length) return 0;
    const total = managedPlayers.reduce((sum, p) => sum + col.accessor(p), 0);
    return parseFloat((total / managedPlayers.length).toFixed(1));
  }, [sortKey, managedPlayers]);

  const leagueHigh = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    return col ? Math.max(...managedPlayers.map((p) => col.accessor(p))) : 0;
  }, [sortKey, managedPlayers]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">

      {/* ══════════ HERO (Brand Navy) ══════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-4">
              <BarChart2 className="w-3 h-3 text-crimson-500" /> Season 2025–2026
            </span>
            <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              Player <span className="text-crimson-500">Statistics</span>
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-gray-300 max-w-xl font-medium leading-relaxed">
              Complete regular-season statistical database for every active player across all franchises.
            </p>
          </div>

          {/* ── Quick league stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 relative z-10">
            <div className="bg-white border-l-4 border-crimson-600 p-4 sm:p-5 shadow-sm">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Players</p>
               <p className="text-2xl sm:text-3xl font-black text-navy-900 tabular-nums leading-none">{managedPlayers.length}</p>
            </div>
            <div className="bg-white border-l-4 border-blue-600 p-4 sm:p-5 shadow-sm">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">League Avg {sortCol.shortLabel}</p>
               <p className="text-2xl sm:text-3xl font-black text-navy-900 tabular-nums leading-none">{leagueAvg}{sortCol.unit || ''}</p>
            </div>
            <div className="bg-white border-l-4 border-gold-500 p-4 sm:p-5 shadow-sm hidden md:block">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">League High {sortCol.shortLabel}</p>
               <p className="text-2xl sm:text-3xl font-black text-navy-900 tabular-nums leading-none">{leagueHigh}{sortCol.unit || ''}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ══════════ SEARCH & FILTERS ══════════ */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 mb-6 sticky top-0 z-30">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH PLAYER..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-navy-900 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all rounded-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center justify-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-sm border ${
                showFilters || filterTeam !== 'all' || filterPos !== 'all'
                  ? 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-navy-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-6 px-2 pb-2">
                  {/* Team filter */}
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Franchise</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterTeam('all')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                          filterTeam === 'all' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        All
                      </button>
                      {managedTeams.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setFilterTeam(t.id)}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            filterTeam === t.id ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {t.abbreviation}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Position filter */}
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Position</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterPos('all')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                          filterPos === 'all' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        All
                      </button>
                      {positions.map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setFilterPos(pos)}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                            filterPos === pos ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════ STATS VIEW (Desktop Table vs Mobile Cards) ══════════ */}
        
        {/* Desktop View (Table) */}
        <div className="hidden lg:block bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-900 text-white border-b-4 border-crimson-600">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center w-16">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Player Analysis</th>
                  {columns.map((col) => {
                    const isActive = sortKey === col.key;
                    return (
                      <th key={col.key} className="px-4 py-4 text-center group cursor-pointer" onClick={() => handleSort(col.key)}>
                         <div className="flex flex-col items-center justify-center gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-crimson-400 transition-colors ${isActive ? 'text-crimson-500' : 'text-white'}`}>
                              {col.shortLabel}
                            </span>
                            <div className="text-gray-500 group-hover:text-white transition-colors h-3 flex items-center justify-center">
                              {isActive ? (sortDir === 'desc' ? <ChevronDown className="w-3 h-3 text-crimson-500" /> : <ChevronUp className="w-3 h-3 text-crimson-500" />) : <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
                            </div>
                         </div>
                      </th>
                    );
                  })}
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {sortedPlayers.map((player, index) => {
                    return (
                      <motion.tr
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-center font-black text-gray-300 italic text-lg">{index + 1}</td>
                        <td className="px-6 py-4 min-w-[280px]">
                          <Link to={`/players/${player.id}`} className="flex items-center gap-4 group-hover:text-crimson-600 transition-colors">
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm overflow-hidden group-hover:border-navy-900 transition-colors p-0.5">
                                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all object-top" />
                              </div>
                            </div>
                            <div>
                               <div className="font-black text-navy-900 uppercase tracking-tight text-base leading-none group-hover:text-crimson-600 transition-colors">
                                 {player.name}
                               </div>
                               <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] font-black text-white bg-navy-900 px-1.5 py-0.5 rounded-sm uppercase tracking-widest leading-none">
                                   {player.position}
                                 </span>
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getTeamName(player.team)}</span>
                               </div>
                            </div>
                          </Link>
                        </td>
                        {columns.map((col) => {
                          const val = col.accessor(player);
                          const isActive = sortKey === col.key;
                          return (
                            <td key={col.key} className={`px-4 py-4 text-center transition-all ${isActive ? 'bg-gray-50' : ''}`}>
                               <span className={`text-sm tabular-nums ${isActive ? 'font-black text-navy-900 text-base' : 'font-bold text-gray-500'}`}>
                                 {isActive && col.key !== 'fgp' && col.key !== 'tpp' && col.key !== 'ftp' && sortDir === 'desc' && index < 3 ? (
                                    <span className="text-crimson-600 mr-0.5">🔥</span>
                                 ) : null}
                                 {val}{col.unit || ''}
                               </span>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 text-right">
                          <Link to={`/players/${player.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 group-hover:text-white group-hover:bg-crimson-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="lg:hidden space-y-4">
           {sortedPlayers.length > 0 ? (
             sortedPlayers.map((player, index) => (
                <Link 
                  key={player.id}
                  to={`/players/${player.id}`}
                  className="block bg-white border border-gray-200 shadow-sm overflow-hidden group active:border-crimson-600 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-5">
                       <div className="w-14 h-14 bg-gray-50 border border-gray-100 p-0.5 overflow-hidden shadow-sm shrink-0">
                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                             <span className="text-xl font-black text-navy-900 uppercase tracking-tight truncate">{player.name}</span>
                             <span className="text-2xl font-black text-gray-200 italic tabular-nums">#{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black bg-navy-900 text-white px-2 py-0.5 uppercase tracking-widest">{player.position}</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{getTeamName(player.team)}</span>
                          </div>
                       </div>
                    </div>

                    {/* Quick Stats Grid for Mobile Card */}
                    <div className="grid grid-cols-4 gap-2 border-t border-gray-50 pt-4">
                       {columns.slice(0, 4).map(col => (
                         <div key={col.key} className={`text-center p-2 ${sortKey === col.key ? 'bg-crimson-50 text-crimson-600' : 'bg-gray-50 text-gray-500'}`}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1">{col.shortLabel}</p>
                            <p className="font-black text-sm tabular-nums">{col.accessor(player)}{col.unit || ''}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  {/* Action Bar (Always visible button on mobile) */}
                  <div className="bg-gray-50 border-t border-gray-100 p-4 flex items-center justify-center gap-2 group-active:bg-navy-900 group-active:text-white transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy-900 group-active:text-white">View Full Details</span>
                     <ChevronRight className="w-3.5 h-3.5 text-crimson-600" />
                  </div>
                </Link>
             ))
           ) : (
             <div className="bg-white border border-gray-200 p-16 text-center shadow-sm">
                <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="font-black text-navy-900 uppercase tracking-tight text-lg mb-1">No Analysis Available</p>
                <p className="text-gray-500 text-xs font-medium">Try adjusting your filters.</p>
             </div>
           )}
        </div>
        
        {sortedPlayers.length > 0 && (
           <div className="flex justify-between items-center py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
             <span>Data source: BUL Analytics Engine</span>
             <span>Showing {sortedPlayers.length} results</span>
           </div>
        )}
      </div>

    </div>
  );
};

export default PlayerStatsPage;
