import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Star,
  Shield,
  Zap,
  Medal,
  Award,
  Calendar,
  ChevronRight,
  Crown,
  Flame,
  Target,
} from 'lucide-react';
import { players, teams } from '../data/mockData';

// ─── Award definitions ───────────────────────────────────────────────
interface AwardEntry {
  id: string;
  awardName: string;
  category: 'season' | 'weekly' | 'record' | 'rookie' | 'defense';
  icon: React.ElementType;
  accentColor: string;
  season: string;
  winner: {
    playerId: string;
    note?: string;
  };
  description: string;
  criteria: string;
}

const awards: AwardEntry[] = [
  {
    id: 'poty',
    awardName: 'Player of the Year',
    category: 'season',
    icon: Crown,
    accentColor: '#eab308', // gold-500
    season: '2025–2026',
    winner: { playerId: '7', note: 'Unanimous selection' },
    description: 'Awarded to the most outstanding player of the entire season.',
    criteria: '29.5 PPG · 11.2 RPG · League-best efficiency rating',
  },
  {
    id: 'scoring',
    awardName: 'Scoring Champion',
    category: 'season',
    icon: Flame,
    accentColor: '#dc2626', // crimson-600
    season: '2025–2026',
    winner: { playerId: '7', note: 'Led league for 3rd consecutive year' },
    description: 'Highest points-per-game average over the full regular season.',
    criteria: '29.5 PPG across 23 games',
  },
  {
    id: 'rookie',
    awardName: 'Rookie of the Year',
    category: 'rookie',
    icon: Star,
    accentColor: '#16a34a', // emerald-600
    season: '2025–2026',
    winner: { playerId: '6', note: 'First-year sensation' },
    description: 'Recognizing the best first-year player in the league.',
    criteria: '28.1 PPG · 8.4 RPG · 9.2 APG',
  },
  {
    id: 'dpoty',
    awardName: 'Defensive POTY',
    category: 'defense',
    icon: Shield,
    accentColor: '#2563eb', // blue-600
    season: '2025–2026',
    winner: { playerId: '4', note: 'Anchored the league\'s best defense' },
    description: 'Awarded to the player with the most dominant defensive impact.',
    criteria: '1.3 SPG · 1.3 BPG · +12 Net Rating',
  },
  {
    id: 'mostimproved',
    awardName: 'Most Improved',
    category: 'season',
    icon: Zap,
    accentColor: '#8b5cf6', // violet-500
    season: '2025–2026',
    winner: { playerId: '8', note: '+8.3 PPG improvement from prior season' },
    description: 'Celebrating the player who elevated their game the most.',
    criteria: '24.8 PPG · 11.8 RPG — top-5 league-wide in both',
  },
  {
    id: 'triple',
    awardName: 'Playmaker Award',
    category: 'weekly',
    icon: Target,
    accentColor: '#0ea5e9', // sky-500
    season: '2025–2026',
    winner: { playerId: '2', note: 'Recorded 3 triple-doubles this season' },
    description: 'Honors the player who best facilitates team offense.',
    criteria: '25.7 PPG · 9.1 RPG · 8.5 APG',
  },
  {
    id: 'record',
    awardName: 'All-Time Record',
    category: 'record',
    icon: Medal,
    accentColor: '#f97316', // orange-500
    season: '2023–2024',
    winner: { playerId: '1', note: 'Historic 50-point game vs DAUST' },
    description: 'Set a new BUL single-game scoring record.',
    criteria: '50 Points · 7 Rebounds · 5 Assists',
  },
  {
    id: 'leadership',
    awardName: 'Leadership Award',
    category: 'season',
    icon: Award,
    accentColor: '#be123c', // rose-700
    season: '2025–2026',
    winner: { playerId: '3', note: 'Team captain, led team to playoffs' },
    description: 'Recognizing exceptional leadership both on and off the court.',
    criteria: '24.3 PPG · 6.8 APG · Team Captain',
  },
];

const categoryConfig = {
  all:     { label: 'All Awards' },
  season:  { label: 'Season' },
  rookie:  { label: 'Rookie' },
  defense: { label: 'Defense' },
  weekly:  { label: 'Playmaker' },
  record:  { label: 'Records' },
};

type CategoryKey = keyof typeof categoryConfig;

// ─── Component ───────────────────────────────────────────────────────
const AwardsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const getPlayer = (id: string) => players.find((p) => p.id === id);
  const getTeamName = (teamId: string) => teams.find((t) => t.id === teamId)?.name || '';
  const getTeamColor = (teamId: string) => teams.find((t) => t.id === teamId)?.primaryColor || '#1a365d';

  const filtered = activeCategory === 'all'
    ? awards
    : awards.filter((a) => a.category === activeCategory);

  // Spotlight: Player of the Year
  const spotlight = awards.find((a) => a.id === 'poty')!;
  const spotlightPlayer = getPlayer(spotlight.winner.playerId)!;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">

      {/* ══════════════ HERO (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
              Official Recognitions
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none">
              League <span className="text-gold-500">Awards</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Honoring excellence across the board. Explore the active season awards and legacy records set by the greatest athletes in the league.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 mb-12">
        {/* ══════════════ SPOTLIGHT — Player of the Year ══════════════ */}
        <div className="bg-white border-4 border-gold-500 shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch group relative">
           {/* Abstract backdrop */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 blur-[100px] opacity-10 pointer-events-none"></div>

           <div className="md:w-1/3 bg-gray-100 p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-200">
              <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 border-white shadow-xl relative z-10 bg-white group-hover:scale-105 transition-transform duration-500">
                <img src={spotlightPlayer.avatar} alt={spotlightPlayer.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
           </div>

           <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Crown className="w-5 h-5 text-gold-500" />
                 <span className="text-xs font-black text-gold-500 uppercase tracking-widest">{spotlight.season} {spotlight.awardName}</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black text-navy-900 uppercase tracking-tight leading-none mb-2 group-hover:text-gold-500 transition-colors">
                {spotlightPlayer.name}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 mb-8">
                 <span className="text-xs font-black px-3 py-1 bg-navy-900 text-white uppercase tracking-widest">
                   {getTeamName(spotlightPlayer.team)}
                 </span>
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                   {spotlightPlayer.position} • #{spotlightPlayer.jerseyNumber}
                 </span>
                 {spotlight.winner.note && (
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5 ml-2">
                     {spotlight.winner.note}
                   </span>
                 )}
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PPG</p>
                   <p className="text-3xl font-black text-navy-900 tabular-nums leading-none">{spotlightPlayer.stats.ppg}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">RPG</p>
                   <p className="text-3xl font-black text-navy-900 tabular-nums leading-none">{spotlightPlayer.stats.rpg}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">APG</p>
                   <p className="text-3xl font-black text-navy-900 tabular-nums leading-none">{spotlightPlayer.stats.apg}</p>
                </div>
              </div>

              <div className="mt-auto">
                 <Link to={`/players/${spotlightPlayer.id}`} className="inline-flex items-center gap-2 bg-navy-900 hover:bg-gold-500 hover:text-navy-900 text-white px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors">
                   View Full Profile <ChevronRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ══════════════ CATEGORY TABS ══════════════ */}
        <div className="flex bg-white shadow-sm border border-gray-200 overflow-x-auto scrollbar-none mb-8">
          {(Object.keys(categoryConfig) as CategoryKey[]).map((key) => {
            const cfg = categoryConfig[key];
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-4 font-black text-xs tracking-widest uppercase whitespace-nowrap transition-all border-b-4 ${
                  isActive
                    ? 'bg-navy-900 text-white border-crimson-600'
                    : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50 border-transparent'
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* ══════════════ AWARDS GRID ══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <AnimatePresence mode="wait">
            {filtered.map((award) => {
              const player = getPlayer(award.winner.playerId);
              if (!player) return null;
              const Icon = award.icon;

              return (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/players/${player.id}`} className="block h-full group bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-navy-900 transition-all flex flex-col relative overflow-hidden">
                    
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-2 transition-all duration-300 group-hover:h-3" style={{ backgroundColor: award.accentColor }}></div>
                    
                    <div className="p-8 pb-6 flex-1 flex flex-col relative z-10">
                       <div className="flex justify-between items-start mb-6">
                         <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 shadow-sm" style={{ color: award.accentColor }}>
                           <Icon className="w-6 h-6" />
                         </div>
                         <div className="text-right">
                           <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{award.season}</span>
                           <span className="block text-[9px] font-black uppercase tracking-widest" style={{ color: award.accentColor }}>{categoryConfig[award.category].label}</span>
                         </div>
                       </div>
                       
                       <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tight leading-none mb-3 group-hover:text-crimson-600 transition-colors">
                         {award.awardName}
                       </h3>
                       <p className="text-xs font-bold text-gray-500 mb-8 flex-1 leading-relaxed">
                         {award.description}
                       </p>

                       <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                          <div className="w-14 h-14 bg-gray-100 border border-gray-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                             <img src={player.avatar} alt={player.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-black text-navy-900 uppercase tracking-tight text-lg leading-none mb-1 truncate">{player.name}</p>
                             <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                               <span className="truncate">{getTeamName(player.team)}</span>
                               <span>•</span>
                               <span>{player.position}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between group-hover:bg-navy-900 transition-colors">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">Award Criteria</span>
                          <span className="text-xs font-black text-navy-900 uppercase tracking-widest group-hover:text-white transition-colors">{award.criteria}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gold-500 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ══════════════ HALL OF HONOUR timeline ══════════════ */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 sm:p-12 mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-gray-200 gap-4">
             <div>
                <span className="text-[10px] font-bold text-crimson-600 uppercase tracking-[0.2em] mb-1 block">Legacy & Excellence</span>
                <h2 className="text-3xl sm:text-4xl font-black text-navy-900 uppercase tracking-tight">Hall of Honour</h2>
             </div>
             <Star className="w-8 h-8 text-gold-500 shrink-0" />
          </div>

          <div className="relative">
             <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-100"></div>

             <div className="space-y-8 relative z-10">
               {[
                 { year: '2023–2024', name: 'Ibrahima Diba', team: 'UCAO', award: 'Player of the Year', color: '#eab308' },
                 { year: '2022–2023', name: 'Ousmane Fall',  team: 'DAUST', award: 'Most Valuable Player', color: '#1a365d' },
                 { year: '2021–2022', name: 'Tidiane Diouf', team: 'UAHB', award: 'Player of the Year', color: '#1a365d' },
               ].map((entry, i) => (
                 <div key={entry.year} className="flex items-start sm:items-center gap-6 group">
                   <div className="w-14 h-14 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-navy-900 mt-2 sm:mt-0">
                     <Trophy className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
                   </div>
                   
                   <div className="flex-1 bg-gray-50 border border-gray-200 p-4 sm:p-6 group-hover:bg-white group-hover:shadow-md group-hover:border-navy-900 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                         <p className="font-black text-navy-900 uppercase text-xl leading-none tracking-tight mb-2 group-hover:text-crimson-600 transition-colors">{entry.name}</p>
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black bg-navy-900 text-white px-2 py-0.5 uppercase tracking-widest">{entry.team}</span>
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{entry.award}</span>
                         </div>
                      </div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                         {entry.year} Season
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AwardsPage;
