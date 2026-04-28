import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Team } from '../../types';
import { ADMIN_CONTENT_EVENT, getManagedTeams } from '../../data/adminContent';

const StandingsPreview: React.FC = () => {
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const reload = () => setTeams(getManagedTeams());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);
  
  const filteredTeams = teams.filter(team => team.conference === activeConference)
    .sort((a, b) => a.standing - b.standing);

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">Conference Standings</h2>
          <Link 
            to="/teams/standings" 
            className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors text-sm sm:text-base"
          >
            Full Standings
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {/* Conference Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg flex overflow-x-auto scrollbar-none mb-6 sm:mb-8">
          <button
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap outline-none flex-1 sm:flex-none justify-center border-b-4 ${
              activeConference === 'East'
                ? 'text-navy-900 border-crimson-600 bg-gray-50/50'
                : 'text-gray-500 border-transparent hover:text-navy-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveConference('East')}
          >
            Division 1 (East)
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap outline-none flex-1 sm:flex-none justify-center border-b-4 ${
              activeConference === 'West'
                ? 'text-navy-900 border-crimson-600 bg-gray-50/50'
                : 'text-gray-500 border-transparent hover:text-navy-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveConference('West')}
          >
            Division 2 (West)
          </button>
        </div>

        {/* Standings Table */}
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl mb-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-navy-900 text-white">
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-left text-xs sm:text-sm w-8 sm:w-12">#</th>
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-left text-xs sm:text-sm">Team</th>
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-center text-xs sm:text-sm">Record</th>
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-center text-xs sm:text-sm hidden md:table-cell">Win %</th>
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-center text-xs sm:text-sm hidden lg:table-cell">Last 10</th>
                <th className="py-2.5 sm:py-3 px-4 sm:px-6 text-center text-xs sm:text-sm hidden lg:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => {
                // Parse the record (e.g., "18-5") to get wins and losses
                const [wins, losses] = team.record.split('-').map(Number);
                const winPercentage = wins / (wins + losses);
                
                // Mock data for last 10 games and streak
                const last10 = `${Math.floor(Math.random() * 6) + 5}-${Math.floor(Math.random() * 5)}`;
                const streak = Math.random() > 0.5 ? `W${Math.floor(Math.random() * 5) + 1}` : `L${Math.floor(Math.random() * 3) + 1}`;
                
                return (
                  <tr 
                    key={team.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold">{index + 1}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <Link to={`/teams/${team.id}`} className="flex items-center group">
                        <img 
                          src={team.logo} 
                          alt={team.name} 
                          className="w-7 h-7 sm:w-10 sm:h-10 object-contain mr-2 sm:mr-3 shrink-0"
                        />
                        <span className="font-medium group-hover:text-crimson-500 transition-colors text-xs sm:text-base hidden sm:inline">
                          {team.name}
                        </span>
                        <span className="font-medium group-hover:text-crimson-500 transition-colors text-xs inline sm:hidden">
                          {team.abbreviation}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center text-xs sm:text-sm font-semibold tabular-nums">{team.record}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center hidden md:table-cell text-sm">
                      {winPercentage.toFixed(3).substring(1)}
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center hidden lg:table-cell text-sm">{last10}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-center hidden lg:table-cell font-medium text-sm">
                      <span className={streak.startsWith('W') ? 'text-green-600' : 'text-red-600'}>
                        {streak}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default StandingsPreview;