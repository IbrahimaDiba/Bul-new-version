import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Team, Player } from '../../types';
import PlayerStats from './PlayerStats';

interface TeamRosterProps {
  team: Team;
  onBack: () => void;
}

const TeamRoster: React.FC<TeamRosterProps> = ({ team, onBack }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!team || !team.roster || team.roster.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mx-auto max-w-lg">
        <p className="text-center text-gray-600 text-sm sm:text-base">
          No players available for this team.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-full min-w-0"
    >
      {!selectedPlayer ? (
        <>
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center min-h-[44px] text-navy-900 hover:text-crimson-500 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-5 w-5 shrink-0" />
              Back to Teams
            </button>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-crimson-500 shrink-0" />
                <h1 className="text-xl sm:text-2xl font-bold text-navy-900 break-words">
                  {team.name} Roster
                </h1>
              </div>
              <div className="text-sm text-gray-500 shrink-0">
                {team.roster.length} player{team.roster.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {team.roster.map((player) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="block min-w-0"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPlayer(player);
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-gray-50 rounded-xl overflow-hidden h-full border border-transparent hover:border-crimson-200/80 transition-colors"
                >
                  <div className="relative h-40 sm:h-44 md:h-48">
                    <img
                      src={player.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">{player.name}</h2>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-white/90 text-xs sm:text-sm">
                        <span>#{player.jerseyNumber}</span>
                        <span className="opacity-70">•</span>
                        <span>{player.position}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="min-w-0">
                        <p className="text-gray-500">Height</p>
                        <p className="font-semibold text-navy-900 truncate">{player.height}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-500">Weight</p>
                        <p className="font-semibold text-navy-900 truncate">{player.weight}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-500">Classe</p>
                        <p className="font-semibold text-navy-900 truncate">{player.playerClass}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-500">Hometown</p>
                        <p className="font-semibold text-navy-900 break-words line-clamp-2 leading-snug">
                          {player.hometown}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">PPG</p>
                          <p className="text-lg sm:text-xl font-bold text-crimson-500 tabular-nums">
                            {player.stats?.ppg ?? '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">RPG</p>
                          <p className="text-lg sm:text-xl font-bold text-crimson-500 tabular-nums">
                            {player.stats?.rpg ?? '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">APG</p>
                          <p className="text-lg sm:text-xl font-bold text-crimson-500 tabular-nums">
                            {player.stats?.apg ?? '—'}
                          </p>
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
