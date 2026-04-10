import React from 'react';
import { Player } from '../../types';

interface PlayerStatsCardProps {
  player: Player;
}

const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({ player }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex flex-col md:flex-row">
        
        {/* Image du joueur à gauche */}
        <div className="w-full md:w-1/3 h-64 md:h-auto">
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Infos et stats à droite */}
        <div className="p-6 w-full md:w-2/3">
          {/* Infos joueur */}
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-2xl font-bold text-navy-900">{player.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-3">{player.position}</span>
                <span className="bg-navy-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {player.jerseyNumber}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{player.height} • {player.weight}</p>
              <p className="text-gray-600">{player.year} • {player.hometown}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {player.team === '1' ? 'Wildcats' : 
                 player.team === '2' ? 'Bulls' : 
                 player.team === '3' ? 'Eagles' : 'Tigers'}
              </span>
            </div>
          </div>

          <hr className="my-4" />

          {/* Statistiques principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">PPG</p>
              <p className="text-2xl font-bold text-navy-900">{player.stats.ppg}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">RPG</p>
              <p className="text-2xl font-bold text-navy-900">{player.stats.rpg}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">APG</p>
              <p className="text-2xl font-bold text-navy-900">{player.stats.apg}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">FG%</p>
              <p className="text-2xl font-bold text-navy-900">{player.stats.fgp}%</p>
            </div>
          </div>

          {/* Autres statistiques */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">3PT%:</span>
              <span className="font-medium">{player.stats.tpp}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">FT%:</span>
              <span className="font-medium">{player.stats.ftp}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">SPG:</span>
              <span className="font-medium">{player.stats.spg}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">BPG:</span>
              <span className="font-medium">{player.stats.bpg}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsCard;
