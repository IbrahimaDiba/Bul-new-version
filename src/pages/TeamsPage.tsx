import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ADMIN_CONTENT_EVENT, getManagedTeams } from '../data/adminContent';
import { Team } from '../types';

const TeamsPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-6">
              Official Franchises
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none">
              League <span className="text-crimson-500">Teams</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Explore the official franchises of the Basketball University League. Access team rosters, deep statistical profiles, and seasonal schedules.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
        
        {/* ══════════════ DIVISION SELECTOR ══════════════ */}
        <div className="flex bg-white rounded-sm shadow-xl border border-gray-200 overflow-hidden mb-12 max-w-md w-full">
          <button
            type="button"
            className={`flex-1 py-3 sm:py-5 px-3 sm:px-6 font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase transition-all ${
              activeConference === 'East'
                ? 'bg-navy-900 text-white border-b-4 border-crimson-600'
                : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
            onClick={() => setActiveConference('East')}
          >
            Div 1 <span className="hidden sm:inline">(East)</span>
          </button>
          <button
            type="button"
            className={`flex-1 py-3 sm:py-5 px-3 sm:px-6 font-black text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase transition-all ${
              activeConference === 'West'
                ? 'bg-navy-900 text-white border-b-4 border-crimson-600'
                : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
            onClick={() => setActiveConference('West')}
          >
            Div 2 <span className="hidden sm:inline">(West)</span>
          </button>
        </div>

        {/* ══════════════ TEAMS GRID ══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="wait">
            {allTeams
              .filter(team => team.conference === activeConference)
              .map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={`/teams/${team.id}`}
                    className="group block bg-white border border-gray-200 shadow-sm hover:border-navy-900 hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    
                    {/* Team Color Accent Bar */}
                    <div 
                      className="absolute top-0 left-0 w-full h-2 transition-all duration-300 group-hover:h-3"
                      style={{ backgroundColor: team.primaryColor || '#1a365d' }} 
                    />

                    {/* Faint Logo Watermark */}
                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none transform group-hover:scale-110">
                      <img src={team.logo} alt="" className="w-64 h-64 object-contain grayscale" />
                    </div>

                    <div className="p-8 pb-0 flex flex-col items-center relative z-10">
                      <div className="w-32 h-32 mb-8 bg-white border border-gray-100 p-4 shadow-sm group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 relative">
                         {/* Subtle glowing shadow based on team color */}
                         <div 
                           className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"
                           style={{ backgroundColor: team.primaryColor || '#1a365d' }}
                         ></div>
                         <img
                           src={team.logo}
                           alt={team.name}
                           className="w-full h-full object-contain relative z-10"
                         />
                      </div>
                      
                      <div className="text-center w-full">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                          {team.abbreviation} Franchise
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-black text-navy-900 uppercase tracking-tighter leading-none mb-4 group-hover:text-crimson-600 transition-colors">
                          {team.name}
                        </h2>
                        
                        <div className="flex items-center justify-center gap-4 mb-8">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">W-L</span>
                            <span className="font-black text-navy-900 tabular-nums text-lg">{team.record}</span>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</span>
                            <span className="font-black text-navy-900 tabular-nums text-lg">#{team.standing}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Bar */}
                    <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-center gap-2 group-hover:bg-navy-900 transition-colors">
                      <span className="text-xs font-black uppercase tracking-widest text-navy-900 group-hover:text-white transition-colors">
                        Team Profile
                      </span>
                      <ArrowRight className="w-4 h-4 text-crimson-600 group-hover:translate-x-2 transition-transform" />
                    </div>

                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default TeamsPage;