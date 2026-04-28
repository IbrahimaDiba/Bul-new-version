import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Zap, 
  Shield, 
  Crosshair,
  BarChart3,
  Video,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import ShotChart from '../components/ShotChart';
import { ADMIN_CONTENT_EVENT, getManagedPlayers, getManagedTeams } from '../data/adminContent';
import { Player, Team } from '../types';

const PlayerDetailsPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  const player = allPlayers.find((p) => p.id === playerId);
  const team = player ? allTeams.find((t) => t.id === player.team) : null;

  // Scroll to top when player changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerId]);

  useEffect(() => {
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

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">Player Not Found</h1>
          <p className="text-gray-500 mb-8">We couldn't find the player you're looking for.</p>
          <button
            onClick={() => navigate('/players')}
            className="px-6 py-3 bg-navy-900 text-white rounded-md font-semibold hover:bg-navy-800 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Players
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'shot-chart', label: 'Shot Chart', icon: Target },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ NAVBAR / BACK BUTTON ══════════════ */}
      <div className="bg-navy-900 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center text-sm font-semibold text-gray-400">
          <button 
            onClick={() => navigate('/players')}
            className="hover:text-white transition-colors flex items-center group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Players
          </button>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className="text-white">{player.name}</span>
        </div>
      </div>

      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 relative border-b-[6px] border-crimson-600">
        {/* Ghosted Jersey Number in Background */}


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 sm:pt-16 sm:pb-0 relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10">
          
          {/* Avatar / Photo */}
          <div className="relative">
            <div className="w-40 h-40 sm:w-56 sm:h-56 bg-gray-200 border-4 border-white shadow-2xl rounded-sm overflow-hidden z-20 relative sm:translate-y-12">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Team Logo Badge */}
            {team && (
              <div className="absolute -bottom-4 sm:bottom-8 -right-4 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-2 sm:p-3 shadow-lg border-2 border-gray-100 z-30 flex items-center justify-center">
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Player Info Text */}
          <div className="flex-1 text-center sm:text-left sm:pb-8">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
              <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-sm border border-white/20">
                {player.position}
              </span>
              <span className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
                {player.height} | {player.weight} | {player.playerClass}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none mb-2">
              {player.name}
            </h1>
            
            <p className="text-xl text-gray-400 font-medium tracking-wide">
              #{player.jerseyNumber} • {team?.name || 'Free Agent'}
            </p>
          </div>

        </div>
      </div>

      {/* ══════════════ QUICK STATS STRIP ══════════════ */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-4 sm:pl-[320px] py-4">
          <div className="flex gap-8 sm:gap-16 justify-center sm:justify-start overflow-x-auto scrollbar-none">
            <div className="text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">PPG</p>
              <p className="text-2xl font-black text-navy-900">{player.stats.ppg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">RPG</p>
              <p className="text-2xl font-black text-navy-900">{player.stats.rpg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">APG</p>
              <p className="text-2xl font-black text-navy-900">{player.stats.apg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">PER</p>
              <p className="text-2xl font-black text-navy-900">{player.stats.per || '24.5'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ TABS NAVIGATION ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="bg-white border border-gray-200 rounded-t-lg flex overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap outline-none flex-1 sm:flex-none justify-center border-b-4 ${
                activeTab === tab.id
                  ? 'text-navy-900 border-crimson-600 bg-gray-50/50'
                  : 'text-gray-500 border-transparent hover:text-navy-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-crimson-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════ TAB CONTENT ══════════════ */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg p-6 sm:p-10 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left Column - Season Stats */}
                <div className="col-span-1 lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-navy-900 mb-4 border-b-2 border-gray-100 pb-2 inline-block">2025-2026 Regular Season</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Points', value: player.stats.ppg, icon: Target },
                        { label: 'Rebounds', value: player.stats.rpg, icon: Shield },
                        { label: 'Assists', value: player.stats.apg, icon: Zap },
                        { label: 'Steals', value: player.stats.spg, icon: Crosshair }
                      ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                          <stat.icon className="h-6 w-6 text-gray-400 mb-2" />
                          <span className="text-2xl font-black text-navy-900">{stat.value}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-navy-900 mb-4 border-b-2 border-gray-100 pb-2 inline-block">Shooting</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Field Goals', value: player.stats.fgp },
                        { label: '3-Pointers', value: player.stats.tpp },
                        { label: 'Free Throws', value: player.stats.ftp }
                      ].map((stat, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-crimson-600" />
                          <span className="text-3xl font-black text-navy-900 block mt-2">{stat.value}%</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 block">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Player Info & Awards */}
                <div className="space-y-6">
                  {/* Bio block */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Player Profile</h4>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center border-b border-gray-200 xl:border-b-0 pb-3 xl:pb-0">
                        <span className="text-gray-500 font-semibold">Hometown</span>
                        <span className="text-navy-900 font-bold">{player.hometown}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-200 xl:border-b-0 pb-3 xl:pb-0">
                        <span className="text-gray-500 font-semibold">Experience</span>
                        <span className="text-navy-900 font-bold">{player.year}</span>
                      </li>
                      <li className="flex justify-between items-center border-b border-gray-200 xl:border-b-0 pb-3 xl:pb-0">
                        <span className="text-gray-500 font-semibold">Position</span>
                        <span className="text-navy-900 font-bold">{player.position}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Achievements */}
                  {player.achievements && player.achievements.length > 0 && (
                    <div className="bg-navy-900 rounded-lg p-6 text-white overflow-hidden relative">
                      <h4 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-4 relative z-10">Trophy Room</h4>
                      <ul className="space-y-4 relative z-10">
                        {player.achievements.slice(0, 3).map(ach => (
                          <li key={ach.id} className="flex items-start gap-3">
                            <Trophy className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-white text-sm">{ach.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{ach.date}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* SHOT CHART TAB */}
            {activeTab === 'shot-chart' && (
              <motion.div
                key="shot-chart"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {player.shotChart ? (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black text-navy-900 mb-6 text-center uppercase tracking-tight">Shot Distribution</h3>
                    <ShotChart shotChart={player.shotChart} playerName={player.name} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Target className="h-16 w-16 text-gray-200 mb-4" />
                    <h3 className="text-2xl font-bold text-navy-900 mb-2">No Shot Data Available</h3>
                    <p className="text-gray-500">Analytics are not yet available for this player's current season.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* MEDIA TABS */}
            {(activeTab === 'videos' || activeTab === 'gallery') && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                {activeTab === 'videos' ? (
                  <Video className="h-16 w-16 text-gray-200 mb-4" />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-200 mb-4" />
                )}
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Media Library</h3>
                <p className="text-gray-500">Photos and videos coverage is currently being processed for {player.name}.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default PlayerDetailsPage;
