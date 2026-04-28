import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, ChevronRight } from 'lucide-react';
import TeamRoster from '../components/players/TeamRoster';
import { ADMIN_CONTENT_EVENT, getManagedTeams } from '../data/adminContent';
import { Team } from '../types';

const PlayersPage: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-navy-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-crimson-900 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-2">
              Our Teams
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-2 leading-relaxed">
              Discover the talented players that make up our university basketball teams. 
              Click on a team to view their roster and player statistics.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Teams Grid */}
      {!selectedTeam ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {allTeams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedTeam(team.id)}
              >
                <div className="relative h-48">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{team.name}</h2>
                    <p className="text-white/90">{team.mascot}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-crimson-500 mr-2" />
                        <span className="text-gray-600">{team.record}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-crimson-500 mr-2" />
                        <span className="text-gray-600">Rank #{team.standing}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-crimson-500 mr-2" />
                    <span className="text-gray-600">{team.roster?.length ?? 0} Players</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-12 sm:pb-16 w-full min-w-0">
          <TeamRoster
            team={allTeams.find((t) => t.id === selectedTeam)!}
            onBack={() => setSelectedTeam(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
