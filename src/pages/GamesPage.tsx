import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { games as mockGames } from '../data/mockData';

const GamesPage: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [filter, setFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase.from('games').select('*');
      if (!error && data && data.length > 0) {
        setGames(data);
      } else {
        setGames(mockGames);
      }
    };
    fetchGames();
  }, []);

  const filteredGames = games.filter(game => 
    filter === 'upcoming' ? !game.isCompleted : game.isCompleted
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative bg-navy-900 text-white py-20 overflow-hidden"
        style={{ y }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-navy-900 to-crimson-900 opacity-50"
          style={{ opacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Games Schedule
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            View upcoming games and past results from the Basketball University League.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <motion.div 
          className="flex border-b border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className={`py-3 px-6 font-medium text-lg ${
              filter === 'upcoming'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setFilter('upcoming')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upcoming Games
          </motion.button>
          <motion.button
            className={`py-3 px-6 font-medium text-lg ${
              filter === 'completed'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setFilter('completed')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Completed Games
          </motion.button>
        </motion.div>

        {/* Games List */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="grid grid-cols-3 items-center">
                  {/* Home Team */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.img
                      src={game.homeTeam?.logo}
                      alt={game.homeTeam?.name}
                      className="w-20 h-20 object-contain mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <h3 className="mt-2 font-medium">{game.homeTeam?.name}</h3>
                    {game.isCompleted && (
                      <motion.p 
                        className="text-2xl font-bold text-navy-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {game.homeScore}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Game Info */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-gray-100 rounded-lg py-4 px-3">
                      <motion.p 
                        className="text-navy-900 font-bold text-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        VS
                      </motion.p>
                      <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(game.date)}</span>
                      </div>
                      <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{game.time}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Away Team */}
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.img
                      src={game.awayTeam?.logo}
                      alt={game.awayTeam?.name}
                      className="w-20 h-20 object-contain mx-auto"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <h3 className="mt-2 font-medium">{game.awayTeam?.name}</h3>
                    {game.isCompleted && (
                      <motion.p 
                        className="text-2xl font-bold text-navy-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {game.awayScore}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{game.venue}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default GamesPage;