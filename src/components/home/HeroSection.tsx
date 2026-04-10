import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Game } from '../../types';
import { games } from '../../data/mockData';

const HeroSection: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const featuredGames = games.filter(game => game.isFeatured);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredGames.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  const handleDotClick = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <div className="relative h-screen">
      {/* Background Images Slider */}
      {featuredGames.map((game, index) => (
        <div
          key={game.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/50 to-navy-900/90 z-10" />
          <img
            src="https://images.pexels.com/photos/3755440/pexels-photo-3755440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt={`${game.homeTeam.name} vs ${game.awayTeam.name}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
            <div>
              <span className="text-gold-400 font-semibold mb-2 inline-block tracking-wide">
                {featuredGames[activeSlide].isCompleted ? 'GAME RECAP' : 'UPCOMING GAME'}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                {featuredGames[activeSlide].homeTeam.name} vs {featuredGames[activeSlide].awayTeam.name}
              </h1>
              
              {featuredGames[activeSlide].isCompleted ? (
                <div className="flex items-center mb-6">
                  <div className="mr-8">
                    <p className="text-white text-lg">{featuredGames[activeSlide].homeTeam.name}</p>
                    <p className="text-white text-4xl font-bold">{featuredGames[activeSlide].homeScore}</p>
                  </div>
                  <div>
                    <p className="text-white text-lg">{featuredGames[activeSlide].awayTeam.name}</p>
                    <p className="text-white text-4xl font-bold">{featuredGames[activeSlide].awayScore}</p>
                  </div>
                </div>
              ) : (
                <p className="text-white text-xl mb-6">
                  {new Date(featuredGames[activeSlide].date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {featuredGames[activeSlide].time}
                </p>
              )}
              
              <p className="text-gray-300 text-lg mb-8 max-w-lg">
                {featuredGames[activeSlide].isCompleted 
                  ? `Catch the highlights from this thrilling matchup between ${featuredGames[activeSlide].homeTeam.name} and ${featuredGames[activeSlide].awayTeam.name} at ${featuredGames[activeSlide].venue}.`
                  : `Don't miss this exciting matchup between ${featuredGames[activeSlide].homeTeam.name} and ${featuredGames[activeSlide].awayTeam.name} at ${featuredGames[activeSlide].venue}.`
                }
              </p>
              
              <div className="flex space-x-4">
                <Link
                  to={featuredGames[activeSlide].isCompleted 
                    ? `/games/${featuredGames[activeSlide].id}` 
                    : `/tickets/${featuredGames[activeSlide].id}`
                  }
                  className="bg-crimson-500 hover:bg-crimson-600 text-white px-8 py-3 rounded-md font-semibold transition-colors flex items-center"
                >
                  {featuredGames[activeSlide].isCompleted ? 'View Recap' : 'Get Tickets'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to={`/games/schedule`}
                  className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Full Schedule
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              {/* Team logos */}
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <img 
                    src={featuredGames[activeSlide].homeTeam.logo} 
                    alt={featuredGames[activeSlide].homeTeam.name} 
                    className="w-48 h-48 object-contain mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white">{featuredGames[activeSlide].homeTeam.name}</h3>
                  <p className="text-gray-300">{featuredGames[activeSlide].homeTeam.record}</p>
                </div>
                <div className="text-center text-white text-4xl font-bold">VS</div>
                <div className="text-center">
                  <img 
                    src={featuredGames[activeSlide].awayTeam.logo} 
                    alt={featuredGames[activeSlide].awayTeam.name} 
                    className="w-48 h-48 object-contain mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white">{featuredGames[activeSlide].awayTeam.name}</h3>
                  <p className="text-gray-300">{featuredGames[activeSlide].awayTeam.record}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {featuredGames.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === activeSlide ? 'bg-crimson-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;