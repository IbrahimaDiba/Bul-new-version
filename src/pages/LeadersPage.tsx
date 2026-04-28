import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Shield, Zap, Crosshair, Star, TrendingUp, ChevronRight, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getManagedPlayers, getManagedTeams, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import { Player, Team } from '../types';

type StatCategory = 'ppg' | 'rpg' | 'apg' | 'spg' | 'bpg' | 'fgp';

interface Category {
  key: StatCategory;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  unit?: string;
}

const categories: Category[] = [
  { key: 'ppg', label: 'Points Per Game', shortLabel: 'Points', icon: Target },
  { key: 'rpg', label: 'Rebounds Per Game', shortLabel: 'Rebounds', icon: Shield },
  { key: 'apg', label: 'Assists Per Game', shortLabel: 'Assists', icon: Zap },
  { key: 'spg', label: 'Steals Per Game', shortLabel: 'Steals', icon: Crosshair },
  { key: 'bpg', label: 'Blocks Per Game', shortLabel: 'Blocks', icon: TrendingUp },
  { key: 'fgp', label: 'Field Goal %', shortLabel: 'FG%', icon: Star, unit: '%' },
];

const LeadersPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<StatCategory>('ppg');

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  React.useEffect(() => {
    const reload = () => {
      setAllPlayers(getManagedPlayers());
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

  const getTeamName = (teamId: string) => allTeams.find((t) => t.id === teamId)?.name || '';
  const getTeamLogo = (teamId: string) => allTeams.find((t) => t.id === teamId)?.logo || '';

  const currentCategory = categories.find((c) => c.key === activeCategory)!;

  const sortedPlayers = [...allPlayers]
    .sort((a, b) => (Number(b.stats?.[activeCategory]) || 0) - (Number(a.stats?.[activeCategory]) || 0))
    .slice(0, 5);

  const maxValue = Number(sortedPlayers[0]?.stats?.[activeCategory]) || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
              <Medal className="h-3 w-3 text-gold-500" /> Season 2025–2026
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              League <span className="text-crimson-500">Leaders</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Track the top statistical performers dominating the court in the Basketball University League.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ══════════════ STAT CATEGORY TABS ══════════════ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-10">
          <div className="flex overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center justify-center gap-2 flex-1 min-w-[120px] px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-4 ${
                    isActive
                      ? 'text-navy-900 border-crimson-600 bg-gray-50'
                      : 'text-gray-400 border-transparent hover:text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-crimson-600' : 'text-gray-400'}`} />
                  {cat.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════ LEADERBOARD ══════════════ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-200">
              <h2 className="text-2xl font-black text-navy-900 uppercase tracking-tight">{currentCategory.label}</h2>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Top 5</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {sortedPlayers.map((player, index) => {
                  const statValue = Number(player.stats?.[activeCategory]) || 0;
                  const pct = (statValue / maxValue) * 100;
                  const isFirst = index === 0;

                  return (
                    <motion.div key={player.id} variants={itemVariants}>
                      <Link to={`/players/${player.id}`} className="block group">
                        <div className={`relative bg-white border shadow-sm transition-all duration-300 overflow-hidden ${
                          isFirst ? 'border-crimson-300 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-gray-400 group-hover:shadow-md'
                        }`}>
                          
                          {/* Accent Color Line */}
                          <div className={`absolute left-0 top-0 bottom-0 w-2 ${isFirst ? 'bg-crimson-600' : 'bg-gray-200 group-hover:bg-navy-900 transition-colors'}`} />

                          <div className={`flex items-center p-4 sm:p-6 pl-6 sm:pl-8 ${isFirst ? 'py-6 sm:py-8' : ''}`}>
                            
                            {/* Rank */}
                            <div className={`shrink-0 w-8 sm:w-12 text-center font-black italic mr-4 ${isFirst ? 'text-4xl text-gray-200' : 'text-2xl text-gray-200 group-hover:text-gray-300'}`}>
                              #{index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="relative shrink-0 mr-4 sm:mr-6">
                              <div className={`rounded-sm overflow-hidden bg-gray-100 ${isFirst ? 'w-20 h-20 sm:w-24 sm:h-24 border-2 border-crimson-600' : 'w-16 h-16 border border-gray-200 group-hover:border-navy-900'}`}>
                                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 object-top" />
                              </div>
                              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-sm flex items-center justify-center p-1 shadow-sm">
                                <img src={getTeamLogo(player.team)} alt="" className="w-full h-full object-contain" />
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-black text-navy-900 truncate uppercase tracking-tight group-hover:text-crimson-600 transition-colors ${isFirst ? 'text-2xl sm:text-3xl mb-1' : 'text-lg sm:text-xl'}`}>
                                {player.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{getTeamName(player.team)}</span>
                                <span className="text-gray-300 mx-1">•</span>
                                <span className="text-gray-400 text-xs font-semibold">{player.position}</span>
                              </div>
                            </div>

                            {/* Stat Value */}
                            <div className="shrink-0 text-right ml-4">
                              <div className={`font-black tabular-nums tracking-tighter ${isFirst ? 'text-4xl sm:text-5xl text-crimson-600' : 'text-3xl text-navy-900'}`}>
                                {statValue}{currentCategory.unit || ''}
                              </div>
                            </div>

                          </div>
                          
                          {/* Progress bar line for visual scale */}
                          <div className="absolute bottom-0 left-2 right-0 h-1 bg-gray-50">
                            <motion.div
                              className={`h-full ${isFirst ? 'bg-crimson-600' : 'bg-navy-900'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: 'easeOut' }}
                            />
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 shadow-sm p-6 sticky top-24">
              <h3 className="font-black text-navy-900 uppercase tracking-widest text-sm mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold-500" /> League Best
              </h3>
              
              <div className="space-y-6">
                {categories.map((cat) => {
                  const leader = [...allPlayers].sort((a, b) => (Number(b.stats?.[cat.key]) || 0) - (Number(a.stats?.[cat.key]) || 0))[0];
                  
                  return (
                    <div key={cat.key} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.label}</span>
                      </div>
                      <button 
                        onClick={() => setActiveCategory(cat.key)} 
                        className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 p-3 rounded-sm hover:border-crimson-300 hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={leader?.avatar} alt="" className="w-10 h-10 rounded-sm object-cover grayscale group-hover:grayscale-0" />
                          <div className="text-left">
                            <div className="font-bold text-navy-900 text-sm group-hover:text-crimson-600 transition-colors uppercase tracking-tight">{leader?.name}</div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase">{getTeamName(leader?.team)}</div>
                          </div>
                        </div>
                        <div className="text-xl font-black text-navy-900 tabular-nums">
                          {Number(leader?.stats?.[cat.key]) || 0}{cat.unit}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeadersPage;
