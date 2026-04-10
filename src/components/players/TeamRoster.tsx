import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Team, Player } from '../../types';
import PlayerStats from './PlayerStats';
import { Typography } from '@mui/material';

interface TeamRosterProps {
  team: Team;
  onBack: () => void;
}

const TeamRoster: React.FC<TeamRosterProps> = ({ team, onBack }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!team || !team.roster || team.roster.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8">
        <Typography variant="h6" color="text.secondary" align="center">
          No players available for this team.
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden"
    >
      {!selectedPlayer ? (
        <>
          <div className="p-6 border-b border-gray-100">
            <button
              onClick={onBack}
              className="inline-flex items-center text-navy-900 hover:text-crimson-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Teams
            </button>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-crimson-500" />
                <h1 className="text-2xl font-bold text-navy-900">{team.name} Roster</h1>
              </div>
              <div className="text-sm text-gray-500">
                {team.roster.length} Players
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {team.roster.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="block"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPlayer(player);
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="text-xl font-bold text-white">{player.name}</h2>
                      <div className="flex items-center space-x-2 text-white/90">
                        <span className="text-sm">#{player.jerseyNumber}</span>
                        <span className="text-sm">•</span>
                        <span className="text-sm">{player.position}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Height</p>
                        <p className="font-semibold text-navy-900">{player.height}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-semibold text-navy-900">{player.weight}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Year</p>
                        <p className="font-semibold text-navy-900">{player.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Hometown</p>
                        <p className="font-semibold text-navy-900">{player.hometown}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500">PPG</p>
                          <p className="text-xl font-bold text-crimson-500">{player.stats?.ppg || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">RPG</p>
                          <p className="text-xl font-bold text-crimson-500">{player.stats?.rpg || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">APG</p>
                          <p className="text-xl font-bold text-crimson-500">{player.stats?.apg || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <PlayerStats player={selectedPlayer} onBack={() => setSelectedPlayer(null)} />
      )}
    </motion.div>
  );
};

export default TeamRoster; 