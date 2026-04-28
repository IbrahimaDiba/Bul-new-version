import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import LatestNews from '../components/home/LatestNews';
import StandingsPreview from '../components/home/StandingsPreview';
import UpcomingGames from '../components/home/UpcomingGames';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PlayerStatsCard from '../components/players/PlayerStatsCard';
import { ArrowRight, Ticket, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_CONTENT_EVENT, getManagedPlayers } from '../data/adminContent';
import { Player } from '../types';

const HomePage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const reload = () => setPlayers(getManagedPlayers());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  // Get a featured player
  const featuredPlayer = players[0];

  return (
    <div className="bg-gray-50 font-sans pb-20">
      <HeroSection />
      
      {/* ══════════════ TOP PERFORMER SECTION ══════════════ */}
      <section className="py-20 bg-navy-900 border-b-4 border-crimson-600 relative overflow-hidden">


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
            <div>
              <span className="text-crimson-500 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Weekly Highlight</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">Top Performer</h2>
            </div>
            <Link 
              to="/players" 
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 transition-colors shrink-0"
            >
              View All Players
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {featuredPlayer ? <PlayerStatsCard player={featuredPlayer} /> : null}
        </div>
      </section>
      
      <UpcomingGames />
      <StandingsPreview />
      <LatestNews />
      <FeaturedProducts />
      
      {/* ══════════════ NEWSLETTER & TICKETS PROMO ══════════════ */}
      <section className="bg-gray-100 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Newsletter Block */}
            <div className="bg-white border border-gray-200 shadow-sm p-10 flex flex-col justify-center relative overflow-hidden group hover:border-gray-300 transition-colors">

              <div className="relative z-10">
                <span className="text-crimson-600 font-bold uppercase tracking-widest text-[10px] mb-2 block">Insider Access</span>
                <h2 className="text-3xl font-black text-navy-900 uppercase tracking-tight mb-4 leading-none">Never Miss <br/>A Game</h2>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed max-w-sm">
                  Sign up for our newsletter to get the latest league news, game schedules, and exclusive merchandise offers straight to your inbox.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-0 shadow-sm">
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL..."
                    className="bg-gray-50 border border-gray-200 text-navy-900 px-4 py-4 flex-grow focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 text-xs font-bold uppercase tracking-wide rounded-l-sm"
                  />
                  <button
                    type="submit"
                    className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 font-black text-xs uppercase tracking-widest transition-colors rounded-r-sm shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            
            {/* Ticket Promo Block */}
            <div className="bg-crimson-600 p-10 flex flex-col justify-center relative overflow-hidden shadow-lg group">

              <div className="relative z-10">
                <span className="text-white/80 font-bold uppercase tracking-widest text-[10px] mb-2 block">Official Ticketing</span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 leading-none">Season Tickets <br/>Available Now</h3>
                <p className="text-white/90 mb-8 font-medium max-w-sm leading-relaxed">
                  Secure your seat for the entire season. Get priority access to all home games, exclusive team events, and VIP perks.
                </p>
                
                <div className="mb-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-sm">Priority seating for all home games</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-sm">Access to exclusive team events</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-white font-bold text-sm">20% discount on official merchandise</span>
                  </div>
                </div>
                
                <Link
                  to="/tickets/season"
                  className="inline-flex items-center gap-2 bg-white text-crimson-600 hover:bg-gray-100 px-8 py-4 font-black text-xs uppercase tracking-widest transition-colors w-max shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  View Packages
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;