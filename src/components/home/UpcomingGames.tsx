import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Game } from '../../types';
import { games } from '../../data/mockData';

const UpcomingGames: React.FC = () => {
  const upcomingGames = games.filter(game => !game.isCompleted);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-navy-900">Upcoming Games</h2>
          <Link 
            to="/games/schedule" 
            className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors"
          >
            View Schedule
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingGames.map((game) => (
            <div 
              key={game.id} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-3 items-center">
                {/* Home Team */}
                <div className="text-center">
                  <img 
                    src={game.homeTeam.logo} 
                    alt={game.homeTeam.name} 
                    className="w-20 h-20 object-contain mx-auto"
                  />
                  <h3 className="mt-2 font-medium">{game.homeTeam.name}</h3>
                  <p className="text-sm text-gray-500">{game.homeTeam.record}</p>
                </div>

                {/* Game Info */}
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg py-4 px-3">
                    <p className="text-navy-900 font-bold text-lg">VS</p>
                    <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(game.date)}</span>
                    </div>
                    <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{game.time}</span>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  <img 
                    src={game.awayTeam.logo} 
                    alt={game.awayTeam.name} 
                    className="w-20 h-20 object-contain mx-auto"
                  />
                  <h3 className="mt-2 font-medium">{game.awayTeam.name}</h3>
                  <p className="text-sm text-gray-500">{game.awayTeam.record}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{game.venue}</span>
                </div>
                <Link
                  to={`/tickets/${game.id}`}
                  className="bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingGames;