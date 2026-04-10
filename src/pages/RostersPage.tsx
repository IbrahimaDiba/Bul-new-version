import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RostersPage: React.FC = () => {
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (!error && data) setTeams(data);
    };
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (!error && data) setPlayers(data);
    };
    fetchTeams();
    fetchPlayers();
  }, []);

  const filteredTeams = teams.filter(team => team.conference === activeConference);
  
  const selectedTeamData = selectedTeam 
    ? teams.find(team => team.id === selectedTeam)
    : null;

  const teamPlayers = selectedTeamData
    ? players.filter(player => player.team === selectedTeamData.id)
    : [];

  // Sort players by position
  const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
  const sortedPlayers = [...teamPlayers].sort((a, b) => 
    positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Team Rosters</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            View detailed rosters and player statistics for all teams in the Basketball University League.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Conference Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeConference === 'East'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setActiveConference('East')}
          >
            Division 1
          </button>
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeConference === 'West'
                ? 'text-crimson-500 border-b-2 border-crimson-500'
                : 'text-gray-600 hover:text-navy-900'
            }`}
            onClick={() => setActiveConference('West')}
          >
            Division 2
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Team Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-navy-900 text-white">
                <h2 className="text-lg font-semibold">Select Team</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredTeams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedTeam === team.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-10 h-10 object-contain mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-navy-900">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.record}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Team Roster */}
          <div className="lg:col-span-3">
            {selectedTeamData ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-navy-900 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={selectedTeamData.logo} 
                        alt={selectedTeamData.name} 
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">{selectedTeamData.name}</h2>
                        <p className="text-gray-300">{selectedTeamData.record}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roster Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left">#</th>
                        <th className="py-3 px-4 text-left">Player</th>
                        <th className="py-3 px-4 text-left">Position</th>
                        <th className="py-3 px-4 text-center">PPG</th>
                        <th className="py-3 px-4 text-center">RPG</th>
                        <th className="py-3 px-4 text-center">APG</th>
                        <th className="py-3 px-4 text-center">FG%</th>
                        <th className="py-3 px-4 text-center">3P%</th>
                        <th className="py-3 px-4 text-center">FT%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map(player => (
                        <tr 
                          key={player.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">{player.jerseyNumber}</td>
                          <td className="py-4 px-4">
                            <Link 
                              to={`/players/${player.id}`}
                              className="flex items-center group"
                            >
                              <img 
                                src={player.avatar} 
                                alt={player.name} 
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <span className="font-medium group-hover:text-crimson-500 transition-colors">
                                  {player.name}
                                </span>
                                <p className="text-sm text-gray-600">{player.height} • {player.weight}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 px-4">{player.position}</td>
                          <td className="py-4 px-4 text-center font-medium">{player.stats.ppg}</td>
                          <td className="py-4 px-4 text-center">{player.stats.rpg}</td>
                          <td className="py-4 px-4 text-center">{player.stats.apg}</td>
                          <td className="py-4 px-4 text-center">{player.stats.fgp}%</td>
                          <td className="py-4 px-4 text-center">{player.stats.tpp}%</td>
                          <td className="py-4 px-4 text-center">{player.stats.ftp}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Team Stats Summary */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Team Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Points Per Game</p>
                      <p className="text-2xl font-bold text-navy-900">
                        {(teamPlayers.reduce((sum, player) => sum + player.stats.ppg, 0) / teamPlayers.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Rebounds Per Game</p>
                      <p className="text-2xl font-bold text-navy-900">
                        {(teamPlayers.reduce((sum, player) => sum + player.stats.rpg, 0) / teamPlayers.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Assists Per Game</p>
                      <p className="text-2xl font-bold text-navy-900">
                        {(teamPlayers.reduce((sum, player) => sum + player.stats.apg, 0) / teamPlayers.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Field Goal %</p>
                      <p className="text-2xl font-bold text-navy-900">
                        {(teamPlayers.reduce((sum, player) => sum + player.stats.fgp, 0) / teamPlayers.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Select a team to view their roster</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RostersPage; 