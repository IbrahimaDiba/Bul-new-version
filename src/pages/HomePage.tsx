import React from 'react';
import HeroSection from '../components/home/HeroSection';
import LatestNews from '../components/home/LatestNews';
import StandingsPreview from '../components/home/StandingsPreview';
import UpcomingGames from '../components/home/UpcomingGames';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { players } from '../data/mockData';
import PlayerStatsCard from '../components/players/PlayerStatsCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  // Get a featured player
  const featuredPlayer = players[0]; // Michael Jordan from our mock data

  return (
    <div>
      <HeroSection />
      
      {/* Top Performers Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Top Performer</h2>
            <Link 
              to="/players" 
              className="text-gold-400 hover:text-gold-300 font-semibold flex items-center transition-colors"
            >
              View All Players
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <PlayerStatsCard player={featuredPlayer} />
        </div>
      </section>
      
      <LatestNews />
      <StandingsPreview />
      <UpcomingGames />
      <FeaturedProducts />
      
      {/* Newsletter & Ticket Promotion */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Never Miss a Game</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Sign up for our newsletter to get the latest news, game schedules, and exclusive offers.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white rounded-md px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-crimson-500"
                />
                <button
                  type="submit"
                  className="bg-crimson-500 hover:bg-crimson-600 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="bg-crimson-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-3">Season Tickets Available Now</h3>
              <p className="text-white/90 mb-6">
                Get access to all home games, exclusive events, and special pricing on merchandise.
              </p>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-crimson-500 rounded-full"></div>
                  </div>
                  <span>Priority seating for all home games</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-crimson-500 rounded-full"></div>
                  </div>
                  <span>Access to exclusive team events</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-crimson-500 rounded-full"></div>
                  </div>
                  <span>20% discount on merchandise</span>
                </div>
              </div>
              
              <Link
                to="/tickets/season"
                className="inline-block bg-white text-crimson-500 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-colors"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;