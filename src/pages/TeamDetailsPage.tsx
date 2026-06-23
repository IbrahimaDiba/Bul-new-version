import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, PlayCircle, Ticket } from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedGames, getManagedPlayers, getManagedTeams } from '../data/adminContent';
import { Game, Player, Team } from '../types';

const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [ticketQR, setTicketQR] = useState<string | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const reload = () => {
      setAllTeams(getManagedTeams());
      setAllGames(getManagedGames());
      setAllPlayers(getManagedPlayers());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const team = allTeams.find(t => t.id === teamId);
  
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center bg-white border border-gray-200 p-16 shadow-lg">
          <h1 className="text-4xl font-black text-navy-900 uppercase tracking-widest mb-4">Franchise Not Found</h1>
          <p className="text-gray-500 mb-8">The requested team profile could not be located in the current season database.</p>
          <Link to="/teams" className="bg-navy-900 text-white px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors hover:bg-crimson-600">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const teamColor = team.primaryColor || '#1a365d';
  const teamPlayers = allPlayers.filter(player => player.team === team.id);
  const recentGames = allGames
    .filter(game => (game.homeTeam.id === team.id || game.awayTeam.id === team.id) && game.isCompleted)
    .slice(0, 4);
  const upcomingGames = allGames
    .filter(game => (game.homeTeam.id === team.id || game.awayTeam.id === team.id) && !game.isCompleted)
    .slice(0, 4);

  // Calculate team statistics
  const teamStats = {
    ppg: teamPlayers.length ? teamPlayers.reduce((sum, player) => sum + player.stats.ppg, 0) / teamPlayers.length : 0,
    rpg: teamPlayers.length ? teamPlayers.reduce((sum, player) => sum + player.stats.rpg, 0) / teamPlayers.length : 0,
    apg: teamPlayers.length ? teamPlayers.reduce((sum, player) => sum + player.stats.apg, 0) / teamPlayers.length : 0,
    fgp: teamPlayers.length ? teamPlayers.reduce((sum, player) => sum + player.stats.fgp, 0) / teamPlayers.length : 0,
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
    }).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION ══════════════ */}
      <div 
        className="relative bg-navy-900 border-b-4 border-crimson-600 overflow-hidden"
      >
        {/* Dynamic Team Color Background Split */}

        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-12 text-center md:text-left">
            <div className="w-40 h-40 sm:w-56 sm:h-56 bg-white border-4 border-gray-100 p-4 shadow-2xl relative shrink-0 group">
              <div 
                 className="absolute inset-0 blur-xl opacity-20"
                 style={{ backgroundColor: teamColor }}
               ></div>
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-full h-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-white/20">
                {team.conference} CONFERENCE
              </span>
              <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                {team.name}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 font-bold uppercase tracking-widest mb-6">
                {team.mascot}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-navy-950/80 border border-white/10 px-6 py-3 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Record</span>
                  <span className="text-white font-black text-xl leading-none tabular-nums mt-1">{team.record}</span>
                </div>
                <div className="bg-navy-950/80 border border-white/10 px-6 py-3 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Standing</span>
                  <span className="text-white font-black text-xl leading-none tabular-nums mt-1">#{team.standing}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ TEAM DASHBOARD ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* ════════ Team Statistics ════════ */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Season Averages</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="p-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Points PG</p>
                  <p className="text-4xl font-black text-navy-900 tabular-nums leading-none">{teamStats.ppg.toFixed(1)}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rebounds PG</p>
                  <p className="text-4xl font-black text-navy-900 tabular-nums leading-none">{teamStats.rpg.toFixed(1)}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assists PG</p>
                  <p className="text-4xl font-black text-navy-900 tabular-nums leading-none">{teamStats.apg.toFixed(1)}</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Field Goal %</p>
                  <p className="text-4xl font-black text-navy-900 tabular-nums leading-none">{teamStats.fgp.toFixed(1)}<span className="text-xl text-gray-300">%</span></p>
                </div>
              </div>
            </div>

            {/* ════════ Matches (Upcoming & Recent) ════════ */}
            <div className="flex flex-col gap-8">
              
              <div className="bg-white border border-gray-200 shadow-sm">
                 <div className="bg-navy-900 border-b-4 border-crimson-600 p-4 flex justify-between items-center">
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Upcoming Matches</h2>
                   <Link to="/games/schedule" className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:text-white flex items-center gap-1">
                     Full Schedule <ArrowRight className="w-3 h-3" />
                   </Link>
                 </div>
                 <div className="divide-y divide-gray-100">
                   {upcomingGames.length === 0 ? (
                      <p className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No upcoming matches scheduled.</p>
                   ) : (
                     upcomingGames.map(game => (
                       <div key={game.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                         {/* Match Date & Teams */}
                         <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                           <div className="w-24 text-left sm:text-center shrink-0">
                              <span className="block text-xs font-black text-navy-900 uppercase tracking-widest mb-1"><Calendar className="w-3 h-3 inline-block -mt-1 mr-1 text-crimson-600"/> {formatDate(game.date)}</span>
                              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest"><Clock className="w-3 h-3 inline-block -mt-1 mr-1"/> {game.time}</span>
                           </div>
                           
                           <div className="flex items-center gap-4 flex-1">
                             <div className="w-10 h-10 shrink-0">
                               <img src={game.homeTeam.logo} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0" />
                             </div>
                             <span className={`text-base sm:text-lg font-black uppercase tracking-tight ${game.homeTeam.id === team.id ? 'text-navy-900' : 'text-gray-400'}`}>
                               {game.homeTeam.abbreviation}
                             </span>
                             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">VS</span>
                             <span className={`text-base sm:text-lg font-black uppercase tracking-tight ${game.awayTeam.id === team.id ? 'text-navy-900' : 'text-gray-400'}`}>
                               {game.awayTeam.abbreviation}
                             </span>
                             <div className="w-10 h-10 shrink-0">
                               <img src={game.awayTeam.logo} alt="" className="w-full h-full object-contain grayscale group-hover:grayscale-0" />
                             </div>
                           </div>
                         </div>
                         
                         {/* Actions */}
                         <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                           <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] w-full text-center sm:text-right hidden xl:block">
                             <MapPin className="w-3 h-3 inline-block -mt-1 mr-1" /> {game.venue}
                           </div>
                           <button 
                             onClick={() => { setShowTicketModal(true); setSelectedGame(game); }}
                             className="w-full sm:w-auto flex justify-center items-center gap-2 bg-navy-900 hover:bg-crimson-600 text-white px-6 py-3 font-black text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                           >
                             <Ticket className="w-3 h-3" /> Tickets
                           </button>
                         </div>
                       </div>
                     ))
                   )}
                 </div>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm">
                 <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                   <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Recent Results</h2>
                   <Link to="/games/results" className="text-[10px] font-bold text-gray-500 hover:text-navy-900 uppercase tracking-widest flex items-center gap-1">
                     View All <ArrowRight className="w-3 h-3" />
                   </Link>
                 </div>
                 <div className="divide-y divide-gray-100">
                   {recentGames.map(game => {
                      const isHome = game.homeTeam.id === team.id;
                      const myScore = isHome ? game.homeScore : game.awayScore;
                      const opponentScore = isHome ? game.awayScore : game.homeScore;
                      const isWin = myScore > opponentScore;

                      return (
                       <div key={game.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4 group">
                         <div className="flex items-center gap-4 flex-1 min-w-0">
                            <span className={`w-6 h-6 flex items-center justify-center shrink-0 border border-transparent font-black tracking-widest text-[9px] ${isWin ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {isWin ? 'W' : 'L'}
                            </span>
                            <div className="hidden sm:block text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 w-20">
                              {formatDate(game.date)}
                            </div>
                            
                            {/* Score Display */}
                            <div className="flex items-center gap-3">
                              <span className="font-black text-navy-900 tabular-nums text-lg sm:text-xl w-8 text-right">{myScore}</span>
                              <span className="text-[10px] font-bold text-gray-300">-</span>
                              <span className="font-black text-gray-400 tabular-nums text-lg sm:text-xl w-8 text-left">{opponentScore}</span>
                            </div>

                            <div className="flex items-center gap-3 ml-2 truncate">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
                                {isHome ? 'VS' : 'AT'}
                              </span>
                              <img src={isHome ? game.awayTeam.logo : game.homeTeam.logo} alt="" className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 shrink-0" />
                              <span className="font-bold text-gray-600 uppercase tracking-tight text-sm truncate">
                                {isHome ? game.awayTeam.name : game.homeTeam.name}
                              </span>
                            </div>
                         </div>

                         <Link to={`/games/highlights`} className="shrink-0 text-crimson-600 hover:text-crimson-800 transition-colors">
                           <PlayCircle className="w-6 h-6" />
                         </Link>
                       </div>
                     );
                   })}
                 </div>
              </div>

            </div>

          </div>
          
          {/* ════════ Active Roster ════════ */}
          <div className="lg:col-span-1">
             <div className="bg-white border border-gray-200 shadow-sm sticky top-24">
                <div className="bg-navy-900 border-b border-gray-200 p-4 flex justify-between items-center">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Roster</h2>
                  <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                    {teamPlayers.length} Players
                  </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto">
                   {sortedPlayers.length === 0 ? (
                      <p className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No active players.</p>
                   ) : (
                     sortedPlayers.map((player) => (
                       <Link
                         key={player.id}
                         to={`/players/${player.id}`}
                         className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition-colors group"
                       >
                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 shrink-0 overflow-hidden border border-gray-200 relative mr-3 sm:mr-4">
                           <img src={player.avatar} alt="" className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all" />
                           <div className="absolute bottom-0 right-0 bg-navy-900 text-white text-[8px] font-black italic px-1 py-px leading-none">
                             #{player.jerseyNumber}
                           </div>
                         </div>
                         <div className="flex-1 min-w-0">
                           <h3 className="font-black text-navy-900 text-sm truncate group-hover:text-crimson-600 transition-colors uppercase tracking-tight">
                             {player.name}
                           </h3>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                             <span className="text-crimson-600">{player.position}</span>
                             <span>•</span>
                             <span>{player.height}</span>
                           </div>
                           {/* Quick stats on roster */}
                           <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-gray-100">
                             <span className="text-[9px] font-bold text-gray-500 uppercase"><span className="text-navy-900 font-black tabular-nums">{player.stats.ppg}</span> PTS</span>
                             <span className="text-[9px] font-bold text-gray-500 uppercase"><span className="text-navy-900 font-black tabular-nums">{player.stats.rpg}</span> REB</span>
                             <span className="text-[9px] font-bold text-gray-500 uppercase"><span className="text-navy-900 font-black tabular-nums">{player.stats.apg}</span> AST</span>
                           </div>
                         </div>
                       </Link>
                     ))
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* ════════ TICKET MODAL ════════ */}
      {showTicketModal && selectedGame && (
        <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-white shadow-2xl p-0 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-navy-900 p-6 text-center border-b-4 border-crimson-600 relative">
               <button
                 className="absolute top-2 right-2 text-white/50 hover:text-white"
                 onClick={() => { setShowTicketModal(false); setTicketQR(null); setBuyerName(''); setBuyerEmail(''); }}
               >
                 ✕
               </button>
               <Ticket className="w-8 h-8 text-crimson-500 mx-auto mb-2" />
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">Official Ticketing</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                 {selectedGame.homeTeam.abbreviation} vs {selectedGame.awayTeam.abbreviation}
               </p>
            </div>

            <div className="p-8 pb-10">
              {!ticketQR ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const qrValue = `TICKET-${selectedGame.id}-${Date.now()}`;
                    setTicketQR(qrValue);
                  }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50 p-3 border border-gray-100">
                    <span>{formatDate(selectedGame.date)}</span>
                    <span className="text-navy-900 font-black">{selectedGame.time}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Pass Holder Name</label>
                      <input
                        type="text"
                        value={buyerName}
                        onChange={e => setBuyerName(e.target.value)}
                        required
                        className="block w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600 uppercase transition-colors"
                        placeholder="FULL NAME"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Email Delivery</label>
                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={e => setBuyerEmail(e.target.value)}
                        required
                        className="block w-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600 uppercase transition-colors"
                        placeholder="EMAIL ADDRESS"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-crimson-600 hover:bg-crimson-700 text-white px-6 py-4 font-black uppercase tracking-widest text-xs transition-colors shadow-md mt-4"
                  >
                    Generate E-Ticket
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-white border-2 border-gray-100 p-4 shadow-sm mb-6">
                    <QRCode value={ticketQR} size={200} />
                  </div>
                  
                  <div className="text-center w-full bg-gray-50 border border-gray-200 p-4 mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Pass Holder</p>
                    <p className="font-black text-navy-900 uppercase text-lg">{buyerName}</p>
                    <div className="h-px w-8 bg-crimson-600 mx-auto my-2"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedGame.venue}</p>
                  </div>
                  
                  <button
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white px-6 py-4 font-black uppercase tracking-widest text-xs transition-colors"
                    onClick={() => { setShowTicketModal(false); setTicketQR(null); setBuyerName(''); setBuyerEmail(''); }}
                  >
                    Close & Finish
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailsPage;