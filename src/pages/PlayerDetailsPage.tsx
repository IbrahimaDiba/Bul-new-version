import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Shield, 
  Crosshair,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Clock,
  Play,
  Image,
  BarChart3,
  Video,
  Activity
} from 'lucide-react';
import PlayerDetailedStats from '../components/PlayerDetailedStats';
import ShotChart from '../components/ShotChart';
import { supabase } from '../supabaseClient';
import { players as mockPlayers } from '../data/mockData';

const PlayerDetailsPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (!error && data && data.length > 0) {
        setPlayers(data);
      } else {
        setPlayers(mockPlayers);
      }
    };
    fetchPlayers();
  }, []);

  const player = players.find(p => p.id === playerId);

  // Scroll to top when player changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerId]);

  if (!player) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-crimson-900 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="text-center max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Player Not Found
          </h1>
          <p className="text-white/80 mb-8 text-lg">
            The player you're looking for doesn't exist.
          </p>
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-crimson-500 to-purple-600 text-white rounded-xl hover:from-crimson-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-3 h-6 w-6" />
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const hasDetailedStats = player.detailedStats && player.shotChart && player.media;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'shot-chart', label: 'Shot Chart', icon: Target },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'detailed-stats', label: 'Detailed Stats', icon: Activity }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section with 3D Parallax */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={player.avatar}
            alt={player.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/40 to-navy-900/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-crimson-500/20 to-purple-600/20" />
        </motion.div>

        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <motion.div 
              className="max-w-6xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center text-white/90 hover:text-white transition-all duration-300 mb-8 group"
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="mr-3 h-6 w-6" />
                  <span className="text-lg font-medium">Back to Players</span>
                </motion.button>
              </motion.div>

              <motion.div className="flex flex-col lg:flex-row items-end gap-8" variants={itemVariants}>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-crimson-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <span className="text-white font-bold text-xl">#{player.jerseyNumber}</span>
                  </motion.div>
                </motion.div>

                <motion.div className="flex-1 text-white" variants={itemVariants}>
                  <motion.h1 
                    className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {player.name}
                  </motion.h1>
                  
                  <motion.div 
                    className="flex flex-wrap items-center gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.span 
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {player.position}
                    </motion.span>
                    <motion.span 
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {player.year}
                    </motion.span>
                    <motion.span 
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {player.height} • {player.weight}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <motion.div 
                      className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Target className="h-8 w-8 text-crimson-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{player.stats.ppg}</div>
                      <div className="text-sm text-white/70">PPG</div>
                    </motion.div>
                    <motion.div 
                      className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{player.stats.rpg}</div>
                      <div className="text-sm text-white/70">RPG</div>
                    </motion.div>
                    <motion.div 
                      className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{player.stats.apg}</div>
                      <div className="text-sm text-white/70">APG</div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div 
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tab Navigation */}
          <motion.div 
            className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
            variants={itemVariants}
          >
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-crimson-600 border-b-2 border-crimson-600 bg-white'
                      : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Season Averages */}
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg"
                    whileHover={{ scale: 1.02, rotateY: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <Trophy className="h-6 w-6 text-crimson-500 mr-3" />
                      <h3 className="text-xl font-bold text-navy-900">Season Averages</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'PPG', value: player.stats.ppg, icon: Target, color: 'text-crimson-500' },
                        { label: 'RPG', value: player.stats.rpg, icon: Shield, color: 'text-purple-500' },
                        { label: 'APG', value: player.stats.apg, icon: Zap, color: 'text-yellow-500' },
                        { label: 'SPG', value: player.stats.spg, icon: Crosshair, color: 'text-green-500' }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="bg-white rounded-xl p-4 shadow-md"
                          whileHover={{ scale: 1.05, rotateY: 5 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{stat.label}</p>
                              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Shooting Percentages */}
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg"
                    whileHover={{ scale: 1.02, rotateY: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-6">
                      <Target className="h-6 w-6 text-green-500 mr-3" />
                      <h3 className="text-xl font-bold text-navy-900">Shooting Percentages</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'FG%', value: player.stats.fgp, color: 'text-green-500' },
                        { label: '3P%', value: player.stats.tpp, color: 'text-blue-500' },
                        { label: 'FT%', value: player.stats.ftp, color: 'text-purple-500' }
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          className="bg-white rounded-xl p-4 shadow-md text-center"
                          whileHover={{ scale: 1.05, rotateY: 5 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <p className="text-3xl font-bold text-navy-900">{stat.value}%</p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'shot-chart' && (
                <motion.div
                  key="shot-chart"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {player.shotChart ? (
                    <ShotChart shotChart={player.shotChart} playerName={player.name} />
                  ) : (
                    <div className="text-center py-12">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Shot Chart</h3>
                      <p className="text-gray-500">Shot chart data not available for this player.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'videos' && (
                <motion.div
                  key="videos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Videos</h3>
                  <p className="text-gray-500">Player videos and highlights coming soon...</p>
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Photo Gallery</h3>
                  <p className="text-gray-500">Player photos and media coming soon...</p>
                </motion.div>
              )}

              {activeTab === 'detailed-stats' && (
                <motion.div
                  key="detailed-stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {hasDetailedStats ? (
                    <PlayerDetailedStats player={player} />
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Detailed Statistics</h3>
                      <p className="text-gray-500">Detailed statistics are not available for this player.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
