import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Shield, 
  Crosshair,
  TrendingUp,
  BarChart2,
  Activity,
  Award,
  Percent,
  ChevronRight
} from 'lucide-react';
import { Player } from '../../types';

interface PlayerStatsProps {
  player: Player;
  onBack: () => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, onBack }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const handleViewDetails = () => {
    navigate(`/players/${player.id}/details`);
  };

  const stats = [
    { 
      label: 'Points Per Game', 
      value: player.stats.ppg, 
      icon: Target, 
      color: 'text-crimson-500',
      trend: '+2.3',
      rank: '3rd'
    },
    { 
      label: 'Rebounds Per Game', 
      value: player.stats.rpg, 
      icon: Shield, 
      color: 'text-navy-500',
      trend: '+0.8',
      rank: '5th'
    },
    { 
      label: 'Assists Per Game', 
      value: player.stats.apg, 
      icon: Zap, 
      color: 'text-green-500',
      trend: '+1.5',
      rank: '2nd'
    },
    { 
      label: 'Steals Per Game', 
      value: player.stats.spg, 
      icon: Crosshair, 
      color: 'text-purple-500',
      trend: '-0.2',
      rank: '8th'
    },
    { 
      label: 'Blocks Per Game', 
      value: player.stats.bpg, 
      icon: Shield, 
      color: 'text-blue-500',
      trend: '+0.5',
      rank: '4th'
    },
    { 
      label: 'Field Goal %', 
      value: `${player.stats.fgp}%`, 
      icon: Target, 
      color: 'text-orange-500',
      trend: '+1.2',
      rank: '6th'
    },
    { 
      label: '3-Point %', 
      value: `${player.stats.tpp}%`, 
      icon: Crosshair, 
      color: 'text-pink-500',
      trend: '+2.1',
      rank: '1st'
    },
    { 
      label: 'Free Throw %', 
      value: `${player.stats.ftp}%`, 
      icon: Target, 
      color: 'text-teal-500',
      trend: '+0.9',
      rank: '7th'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      {/* Hero Section */}
      <div className="relative bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 opacity-90" />
        <motion.div 
          className="absolute inset-0 bg-[url('/court-pattern.png')] opacity-5"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.button
            onClick={onBack}
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2 h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            Back to Roster
          </motion.button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="flex items-center space-x-4 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span 
                  className="px-4 py-1.5 bg-crimson-500/20 text-crimson-400 rounded-full text-sm font-semibold tracking-wide"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(220, 38, 38, 0.3)" }}
                >
                  #{player.jerseyNumber}
                </motion.span>
                <motion.span 
                  className="px-4 py-1.5 bg-white/10 text-white/90 rounded-full text-sm tracking-wide"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  {player.position}
                </motion.span>
                <motion.span 
                  className="px-4 py-1.5 bg-white/10 text-white/90 rounded-full text-sm tracking-wide"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  {player.team}
                </motion.span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {player.name}
              </motion.h1>

              <motion.div 
                className="flex flex-wrap gap-6 text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-white/60">Season Average</p>
                    <p className="text-xl font-semibold">{player.stats.ppg} PPG</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Award className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-white/60">Career High</p>
                    <p className="text-xl font-semibold">42 Points</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Percent className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-white/60">Efficiency</p>
                    <p className="text-xl font-semibold">{player.stats.fgp}%</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <p className="text-sm text-white/60">Height</p>
                  <p className="text-xl font-semibold text-white">{player.height}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60">Weight</p>
                  <p className="text-xl font-semibold text-white">{player.weight}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-white/60">Experience</p>
                  <p className="text-xl font-semibold text-white">{player.year}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
              }}
              style={{ transformStyle: "preserve-3d" }}
              onHoverStart={() => setHoveredStat(stat.label)}
              onHoverEnd={() => setHoveredStat(null)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-crimson-500/10 to-navy-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ transform: "translateZ(-1px)" }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center mr-3`}
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{stat.label}</h3>
                      <p className="text-xs text-gray-500">League Rank: {stat.rank}</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-end"
                    whileHover={{ x: -5 }}
                  >
                    <span className={`text-sm font-medium ${parseFloat(stat.trend) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend}
                    </span>
                  </motion.div>
                </div>
                <motion.p 
                  className="text-3xl font-bold text-navy-900"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>

                <AnimatePresence>
                  {hoveredStat === stat.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4 rounded-b-xl cursor-pointer"
                      onClick={handleViewDetails}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                    >
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Season Highlights */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-lg"
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h3 
              className="text-xl font-semibold text-navy-900 mb-6 flex items-center"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Trophy className="h-6 w-6 text-crimson-500 mr-3" />
              </motion.div>
              Season Highlights
            </motion.h3>
            <div className="space-y-6">
              <motion.div 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  backgroundColor: "rgb(249, 250, 251)",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-crimson-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Best Performance</p>
                    <p className="text-sm text-gray-600">vs. Lakers - Jan 15, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-crimson-500">42 PTS</span>
                  <p className="text-sm text-gray-600">+15 REB, 8 AST</p>
                </div>
              </motion.div>
              {/* ... other highlights ... */}
            </div>
          </motion.div>

          {/* Player Bio */}
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-lg"
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h3 
              className="text-xl font-semibold text-navy-900 mb-6 flex items-center"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <BarChart2 className="h-6 w-6 text-crimson-500 mr-3" />
              </motion.div>
              Player Bio & Achievements
            </motion.h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="p-4 bg-gray-50 rounded-lg"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    backgroundColor: "rgb(249, 250, 251)",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <p className="text-sm text-gray-600">Hometown</p>
                  <p className="text-lg font-semibold text-navy-900">{player.hometown}</p>
                </motion.div>
                {/* ... other bio info ... */}
              </div>
              <motion.div 
                className="p-4 bg-gray-50 rounded-lg"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  backgroundColor: "rgb(249, 250, 251)",
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <p className="text-sm text-gray-600 mb-3">Career Achievements</p>
                <div className="flex flex-wrap gap-2">
                  <motion.span 
                    className="px-3 py-1.5 bg-crimson-500/10 text-crimson-500 rounded-full text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    All-Star 2023
                  </motion.span>
                  {/* ... other achievements ... */}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlayerStats; 