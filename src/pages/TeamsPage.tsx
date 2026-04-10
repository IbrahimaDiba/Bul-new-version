import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { teams as mockTeams } from '../data/mockData';

const TeamsPage: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (!error && data && data.length > 0) {
        setTeams(data);
      } else {
        setTeams(mockTeams);
      }
    };
    fetchTeams();
  }, []);

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
            Basketball University League Teams
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore detailed information about all teams in the league, including rosters, statistics, and schedules.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Conference Tabs */}
        <motion.div 
          className="flex border-b border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className={`py-3 px-6 font-medium text-lg ${
              activeConference === 'East'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setActiveConference('East')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Division 1
          </motion.button>
          <motion.button
            className={`py-3 px-6 font-medium text-lg ${
              activeConference === 'West'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setActiveConference('West')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Division 2
          </motion.button>
        </motion.div>

        {/* Teams Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {teams
              .filter(team => team.conference === activeConference)
              .map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={`/teams/${team.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <motion.div 
                      className="p-6 flex items-center"
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.img
                        src={team.logo}
                        alt={team.name}
                        className="w-24 h-24 object-contain mr-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <div>
                        <motion.h2 
                          className="text-2xl font-bold text-navy-900 mb-2"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {team.name}
                        </motion.h2>
                        <p className="text-gray-600 mb-2">Record: {team.record}</p>
                        <motion.div 
                          className="flex items-center text-crimson-500 font-medium"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          View Team Details
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamsPage;