import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CalendarDays, ExternalLink, Trophy, ArrowRight } from 'lucide-react';
import { Game } from '../../types';
import { ADMIN_CONTENT_EVENT, getManagedGames } from '../../data/adminContent';

// Images différentes par slide pour un vrai effet visuel
const SLIDE_IMAGES = [
  'https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const HeroSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [games, setGames] = useState<Game[]>([]);
  const featuredGames = games.length > 0 ? games.slice(0, 3) : [];

  useEffect(() => {
    const reload = () => setGames(getManagedGames());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);
  
  useEffect(() => {
    if (!featuredGames.length) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredGames.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  const handleDotClick = (index: number) => {
    setActiveSlide(index);
  };

  // ── FALLBACK HERO (aucun match chargé) ──────────────────────────────────
  if (featuredGames.length === 0) {
    return (
      <div className="relative h-screen bg-navy-900 border-b-4 border-crimson-600 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10" />
          <img
            src={SLIDE_IMAGES[0]}
            alt="BUL Basketball"
            className="w-full h-full object-cover object-[50%_30%] scale-105"
          />
        </div>
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 z-10 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <span className="inline-flex items-center gap-2 bg-crimson-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg mb-6">
              <Trophy className="w-3 h-3" /> Season 2024 – 2025
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              Basketball<br />
              <span className="text-crimson-500">University</span><br />
              League
            </h1>
            <p className="text-gray-300 text-base sm:text-lg font-medium max-w-xl mb-8 sm:mb-10 leading-relaxed">
              The premier university basketball competition in Senegal. Follow your team, track stats, and never miss a game.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/games/schedule"
                className="inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors shadow-lg"
              >
                View Schedule <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/teams"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors"
              >
                Explore Teams
              </Link>
            </div>
          </div>
        </div>
        {/* Bottom bar placeholder */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-crimson-600 z-30" />
      </div>
    );
  }
  const activeGame = featuredGames[activeSlide];

  return (
    <div className="relative h-screen bg-navy-900 border-b-4 border-crimson-600 overflow-hidden group">
      {/* Background Images Slider */}
      {featuredGames.map((game, index) => (
        <div
          key={game.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10" />
          {/* Subtle noise/texture overlay could go here */}
          <img
            src={SLIDE_IMAGES[index % SLIDE_IMAGES.length]}
            alt=""
            className={`w-full h-full object-cover transform object-[50%_30%] transition-transform duration-[10000ms] ${index === activeSlide ? 'scale-105' : 'scale-100'}`}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-crimson-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              {activeGame.status === 'live' ? 'Live Now' : activeGame.isCompleted ? 'Final Score' : 'Next Matchup'}
            </span>
            <span className="text-gray-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> 
              {activeGame.date} — {activeGame.time}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            
            {/* Left Box: Teams & Score */}
            <div className="flex-1">
              <div className="flex flex-col gap-2 mb-8">
                {/* Away Team */}
                <div className="flex items-center gap-3 sm:gap-6">
                  <img src={activeGame.awayTeam.logo} alt={activeGame.awayTeam.name} className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl shrink-0" />
                  <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none truncate">
                    {activeGame.awayTeam.name}
                  </h1>
                  {(activeGame.isCompleted || activeGame.status === 'live') && (
                    <span className={`ml-auto text-2xl sm:text-4xl md:text-6xl font-black tabular-nums tracking-tighter ${activeGame.awayScore > activeGame.homeScore ? 'text-white' : 'text-gray-500'}`}>
                      {activeGame.awayScore}
                    </span>
                  )}
                </div>

                {/* VS Divider or Just Spacing */}
                <div className="flex items-center gap-4 pl-8 sm:pl-10">
                  <div className="h-4 w-0.5 bg-gray-600"></div>
                  {!activeGame.isCompleted && <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">AT</span>}
                </div>

                {/* Home Team */}
                <div className="flex items-center gap-3 sm:gap-6">
                  <img src={activeGame.homeTeam.logo} alt={activeGame.homeTeam.name} className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl shrink-0" />
                  <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none truncate">
                    {activeGame.homeTeam.name}
                  </h1>
                  {(activeGame.isCompleted || activeGame.status === 'live') && (
                     <span className={`ml-auto text-2xl sm:text-4xl md:text-6xl font-black tabular-nums tracking-tighter ${activeGame.homeScore > activeGame.awayScore ? 'text-gold-500' : 'text-gray-500'}`}>
                       {activeGame.homeScore}
                     </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                {activeGame.status === 'live' ? (
                  <>
                    <Link to={`/games`} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors shadow-lg">
                      <PlayCircle className="w-5 h-5" /> Watch Live
                    </Link>
                    <Link to={`/games/results`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors">
                      Live Score
                    </Link>
                  </>
                ) : activeGame.isCompleted ? (
                   <>
                     <Link to={`/games/highlights`} className="inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors shadow-lg">
                       <PlayCircle className="w-5 h-5" /> Watch Highlights
                     </Link>
                     <Link to={`/games/results`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors">
                       Box Score
                     </Link>
                   </>
                ) : (
                  <>
                     <Link to={`/tickets/${activeGame.id}`} className="inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors shadow-lg">
                       Get Tickets
                     </Link>
                     <Link to={`/games/schedule`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 sm:py-4 font-black uppercase tracking-widest text-xs transition-colors border-l-4 border-l-gold-500">
                        View Schedule
                     </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Box: Context / Info (Hidden on small screens) */}
            <div className="hidden lg:flex flex-col justify-end items-end shrink-0 max-w-sm">
                <div className="bg-navy-900/80 backdrop-blur-md border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                   
                   <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium relative z-10">
                     {activeGame.isCompleted 
                       ? `Relive the intensity of this matchup. ${activeGame.homeTeam.name} hosted ${activeGame.awayTeam.name} in a spectacular showcase of university talent.`
                       : `Prepare for a massive clash. ${activeGame.awayTeam.name} travels to ${activeGame.venue} to face ${activeGame.homeTeam.name} in this highly anticipated matchup.`
                     }
                   </p>

                   {activeGame.broadcast && (
                     <div className="border-t border-white/10 pt-4 flex items-center justify-between relative z-10">
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Broadcast</span>
                       <span className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider">
                          <ExternalLink className="w-3 h-3 text-gold-500" /> {activeGame.broadcast.network || 'BUL Sports'}
                       </span>
                     </div>
                   )}
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Progress Indicators */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex gap-1">
          {featuredGames.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="relative h-full flex-1 group"
            >
              <div className={`absolute top-0 left-0 h-full bg-crimson-600 transition-all duration-300 ${index === activeSlide ? 'w-full' : 'w-0 group-hover:w-full group-hover:bg-white/30'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;