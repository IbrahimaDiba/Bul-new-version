import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { teams as mockTeams, players as mockPlayers, games as mockGames } from '../data/mockData';
import QRCode from 'react-qr-code';

const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // Ajout d'états pour le ticket
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [ticketQR, setTicketQR] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (!error && data && data.length > 0) {
        setTeams(data);
      } else {
        setTeams(mockTeams);
      }
    };
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (!error && data && data.length > 0) {
        setPlayers(data);
      } else {
        setPlayers(mockPlayers);
      }
    };
    const fetchGames = async () => {
      const { data, error } = await supabase.from('games').select('*');
      if (!error && data && data.length > 0) {
        setGames(data);
      } else {
        setGames(mockGames);
      }
    };
    fetchTeams();
    fetchPlayers();
    fetchGames();
  }, []);

  const team = teams.find(t => t.id === teamId);
  
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Team Not Found</h1>
          <Link to="/teams" className="text-crimson-500 hover:text-crimson-600">
            Return to Teams
          </Link>
        </div>
      </div>
    );
  }

  const teamPlayers = players.filter(player => player.team === team.id);
  const recentGames = games
    .filter(game => (game.homeTeam.id === team.id || game.awayTeam.id === team.id) && game.isCompleted)
    .slice(0, 5);
  const upcomingGames = games
    .filter(game => (game.homeTeam.id === team.id || game.awayTeam.id === team.id) && !game.isCompleted)
    .slice(0, 3);

  // Calculate team statistics
  const teamStats = {
    ppg: teamPlayers.reduce((sum, player) => sum + player.stats.ppg, 0) / teamPlayers.length,
    rpg: teamPlayers.reduce((sum, player) => sum + player.stats.rpg, 0) / teamPlayers.length,
    apg: teamPlayers.reduce((sum, player) => sum + player.stats.apg, 0) / teamPlayers.length,
    fgp: teamPlayers.reduce((sum, player) => sum + player.stats.fgp, 0) / teamPlayers.length,
  };

  // Sort players by position
  const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
  const sortedPlayers = [...teamPlayers].sort((a, b) => 
    positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative py-32 bg-navy-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 54, 93, 0.9), rgba(26, 54, 93, 0.9)), url(${team.logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <img 
              src={team.logo} 
              alt={team.name} 
              className="w-32 h-32 object-contain mr-8"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
              <p className="text-xl text-gray-300 mb-4">{team.mascot}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-white/10 px-4 py-2 rounded-full">
                  {team.conference} Conference
                </span>
                <span className="bg-white/10 px-4 py-2 rounded-full">
                  Record: {team.record}
                </span>
                <span className="bg-white/10 px-4 py-2 rounded-full">
                  Standing: {team.standing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Statistics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Team Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Points Per Game</p>
                  <p className="text-2xl font-bold text-navy-900">{teamStats.ppg.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Rebounds Per Game</p>
                  <p className="text-2xl font-bold text-navy-900">{teamStats.rpg.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Assists Per Game</p>
                  <p className="text-2xl font-bold text-navy-900">{teamStats.apg.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Field Goal %</p>
                  <p className="text-2xl font-bold text-navy-900">{teamStats.fgp.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Recent Games */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-900">Recent Games</h2>
                <Link 
                  to="/games/results" 
                  className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors"
                >
                  View All Games
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentGames.map(game => (
                  <div key={game.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Logo équipe domicile */}
                        <img 
                          src={game.homeTeam.logo} 
                          alt={game.homeTeam.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                        />
                        {/* Score */}
                        <span className="text-2xl font-bold">{game.homeScore} - {game.awayScore}</span>
                        {/* Logo équipe extérieure */}
                        <img 
                          src={game.awayTeam.logo} 
                          alt={game.awayTeam.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                        />
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div className="flex items-center justify-end">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(game.date)}</span>
                        </div>
                        <div className="flex items-center justify-end mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{game.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Games */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-900">Upcoming Games</h2>
                <Link 
                  to="/games/schedule" 
                  className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors"
                >
                  View Full Schedule
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingGames.map(game => (
                  <div key={game.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <img 
                            src={game.homeTeam.logo} 
                            alt={game.homeTeam.name} 
                            className="w-12 h-12 object-contain"
                          />
                          <span className={`text-sm ${game.homeTeam.id === team.id ? 'font-bold' : ''}`}>
                            {game.homeTeam.name}
                          </span>
                        </div>
                        <span className="text-gray-400">vs</span>
                        <div className="text-center">
                          <img 
                            src={game.awayTeam.logo} 
                            alt={game.awayTeam.name} 
                            className="w-12 h-12 object-contain"
                          />
                          <span className={`text-sm ${game.awayTeam.id === team.id ? 'font-bold' : ''}`}>
                            {game.awayTeam.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(game.date)}</span>
                        </div>
                        <div className="flex items-center justify-end mt-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{game.time}</span>
                        </div>
                        <button
                          className="mt-2 inline-block bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          onClick={() => { setShowTicketModal(true); setSelectedGame(game); }}
                        >
                          Acheter un ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Roster */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Team Roster</h2>
              <div className="space-y-4">
                {sortedPlayers.map(player => (
                  <Link
                    key={player.id}
                    to={`/players/${player.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <img 
                        src={player.avatar} 
                        alt={player.name} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-navy-900">{player.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{player.position}</span>
                          <span>•</span>
                          <span>#{player.jerseyNumber}</span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-crimson-500 font-medium">{player.stats.ppg} PPG</span>
                          <span className="mx-2">•</span>
                          <span className="text-crimson-500 font-medium">{player.stats.rpg} RPG</span>
                          <span className="mx-2">•</span>
                          <span className="text-crimson-500 font-medium">{player.stats.apg} APG</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'achat de ticket et QR code */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowTicketModal(false); setTicketQR(null); setBuyerName(''); setBuyerEmail(''); }}
            >
              ×
            </button>
            {!ticketQR ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const qrValue = `ticket-${selectedGame.id}-${buyerName}-${buyerEmail}`;
                  setTicketQR(qrValue);
                }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-4 text-navy-900">Achat de ticket</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={e => setBuyerEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-crimson-500 hover:bg-crimson-600 text-white py-2 rounded-md font-semibold"
                >
                  Générer mon QR Code
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-navy-900">Votre QR Code Ticket</h2>
                <QRCode value={ticketQR} size={180} />
                <p className="mt-4 text-gray-700 text-center">Montrez ce QR code à l'entrée du match pour valider votre ticket.</p>
                <button
                  className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => { setShowTicketModal(false); setTicketQR(null); setBuyerName(''); setBuyerEmail(''); }}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage; 