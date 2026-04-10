import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const StandingsPage: React.FC = () => {
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [teams, setTeams] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (!error && data) setTeams(data);
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams
    .filter(team => team.conference === activeConference)
    .sort((a, b) => a.standing - b.standing);

  // Calculate additional statistics
  const teamsWithStats = filteredTeams.map(team => {
    const [wins, losses] = team.record.split('-').map(Number);
    const winPercentage = wins / (wins + losses);
    const gamesBehind = team.standing === 1 ? 0 : 
      (filteredTeams[0].standing === 1 ? 
        (parseInt(filteredTeams[0].record.split('-')[0]) - wins) + 
        (losses - parseInt(filteredTeams[0].record.split('-')[1])) : 0);
    
    // Mock data for additional stats
    const homeRecord = `${Math.floor(wins * 0.6)}-${Math.floor(losses * 0.4)}`;
    const awayRecord = `${wins - Math.floor(wins * 0.6)}-${losses - Math.floor(losses * 0.4)}`;
    const last10 = `${Math.floor(Math.random() * 6) + 5}-${Math.floor(Math.random() * 5)}`;
    const streak = Math.random() > 0.5 ? `W${Math.floor(Math.random() * 5) + 1}` : `L${Math.floor(Math.random() * 3) + 1}`;

    return {
      ...team,
      winPercentage,
      gamesBehind,
      homeRecord,
      awayRecord,
      last10,
      streak
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">League Standings</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            View detailed standings and statistics for all teams in the Basketball University League.
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

        {/* Standings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-navy-900 text-white">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Team</th>
                  <th className="py-3 px-4 text-center">Record</th>
                  <th className="py-3 px-4 text-center">Win %</th>
                  <th className="py-3 px-4 text-center">GB</th>
                  <th className="py-3 px-4 text-center">Home</th>
                  <th className="py-3 px-4 text-center">Away</th>
                  <th className="py-3 px-4 text-center">Last 10</th>
                  <th className="py-3 px-4 text-center">Streak</th>
                </tr>
              </thead>
              <tbody>
                {teamsWithStats.map((team, index) => (
                  <tr 
                    key={team.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img 
                          src={team.logo} 
                          alt={team.name} 
                          className="w-10 h-10 object-contain mr-3"
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">{team.record}</td>
                    <td className="py-4 px-4 text-center">
                      {team.winPercentage.toFixed(3).substring(1)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {team.gamesBehind === 0 ? '-' : team.gamesBehind}
                    </td>
                    <td className="py-4 px-4 text-center">{team.homeRecord}</td>
                    <td className="py-4 px-4 text-center">{team.awayRecord}</td>
                    <td className="py-4 px-4 text-center">{team.last10}</td>
                    <td className="py-4 px-4 text-center font-medium">
                      <span className={team.streak.startsWith('W') ? 'text-green-600' : 'text-red-600'}>
                        {team.streak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Standings Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-medium">GB:</span> Games Behind</p>
              <p><span className="font-medium">Home/Away:</span> Home/Away Record</p>
            </div>
            <div>
              <p><span className="font-medium">Last 10:</span> Record in last 10 games</p>
              <p><span className="font-medium">Streak:</span> Current win/loss streak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsPage; 