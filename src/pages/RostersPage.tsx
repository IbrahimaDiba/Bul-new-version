import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LayoutGrid, List } from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedPlayers, getManagedTeams } from '../data/adminContent';
import { Player, Team } from '../types';

const RostersPage: React.FC = () => {
  const [activeConference, setActiveConference] = useState<'East' | 'West'>('East');
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    const reload = () => {
      setAllTeams(getManagedTeams());
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

  const filteredTeams = useMemo(
    () => allTeams.filter((team) => team.conference === activeConference),
    [allTeams, activeConference]
  );

  useEffect(() => {
    if (!filteredTeams.length) {
      setSelectedTeam('');
      return;
    }
    if (!filteredTeams.some((team) => team.id === selectedTeam)) {
      setSelectedTeam(filteredTeams[0].id);
    }
  }, [filteredTeams, selectedTeam]);

  const selectedTeamData = selectedTeam ? allTeams.find((team) => team.id === selectedTeam) : null;

  const teamPlayers = selectedTeamData
    ? allPlayers.filter((player) => player.team === selectedTeamData.id)
    : [];

  const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
  const sortedPlayers = [...teamPlayers].sort(
    (a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
  );

  const rosterCount = teamPlayers.length;
  const avg = (fn: (p: (typeof teamPlayers)[0]) => number) =>
    rosterCount > 0 ? (teamPlayers.reduce((sum, player) => sum + fn(player), 0) / rosterCount).toFixed(1) : '—';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-4">
              Official Rosters
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-none">
              League <span className="text-crimson-500">Rosters</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl font-medium leading-relaxed">
              Explore the official active rosters, player personnel, and aggregate team statistics for all participating franchises.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-6">
        
        {/* ══════════════ DIVISION SELECTOR ══════════════ */}
        <div className="flex bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden mb-8 max-w-md">
          <button
            type="button"
            className={`flex-1 py-4 px-6 font-black text-xs tracking-widest uppercase transition-all ${
              activeConference === 'East'
                ? 'bg-navy-900 text-white border-b-4 border-crimson-600'
                : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
            onClick={() => {
              setActiveConference('East');
              const eastTeams = allTeams.filter(t => t.conference === 'East');
              if (eastTeams.length > 0) setSelectedTeam(eastTeams[0].id);
            }}
          >
            Division 1 (East)
          </button>
          <button
            type="button"
            className={`flex-1 py-4 px-6 font-black text-xs tracking-widest uppercase transition-all ${
              activeConference === 'West'
                ? 'bg-navy-900 text-white border-b-4 border-crimson-600'
                : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
            onClick={() => {
              setActiveConference('West');
              const westTeams = allTeams.filter(t => t.conference === 'West');
              if (westTeams.length > 0) setSelectedTeam(westTeams[0].id);
            }}
          >
            Division 2 (West)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ══════════════ SIDEBAR (TEAM SELECTOR) ══════════════ */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 shadow-sm sticky top-24">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xs font-black text-navy-900 uppercase tracking-widest">Select Franchise</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                {filteredTeams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full flex items-center p-4 transition-all ${
                      selectedTeam === team.id 
                      ? 'bg-gray-50 border-l-4 border-crimson-600 pl-3' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white border border-gray-100 p-1 flex items-center justify-center mr-4 shrink-0 shadow-sm">
                      <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className={`font-black uppercase tracking-tight truncate ${selectedTeam === team.id ? 'text-navy-900' : 'text-gray-600'}`}>
                        {team.name}
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{team.record}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════ MAIN CONTENT (ROSTER & STATS) ══════════════ */}
          <div className="lg:col-span-3 min-w-0 space-y-6">
            
            {selectedTeamData ? (
              <>
                {/* Team Header Banner */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bottom-0 w-32 bg-gray-50 transform skew-x-12 translate-x-16 border-l border-gray-200" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-gray-200 p-2 shadow-sm shrink-0">
                      <img src={selectedTeamData.logo} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeConference} CONFERENCE</span>
                      <h2 className="text-3xl sm:text-4xl font-black text-navy-900 uppercase tracking-tighter leading-none mt-1">
                        {selectedTeamData.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="px-3 py-1 bg-navy-900 text-white text-[10px] font-bold uppercase tracking-widest">
                          {selectedTeamData.record} Record
                        </span>
                        <span className="text-sm font-bold text-gray-500 uppercase">
                          {rosterCount} Active Players
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Controls */}
                  <div className="relative z-10 flex gap-2">
                    <button 
                      onClick={() => setViewMode('table')}
                      className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500 hover:text-navy-900'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500 hover:text-navy-900'}`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* PLAYERS LISTING */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
                  {rosterCount === 0 ? (
                    <div className="p-16 text-center">
                      <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="font-black text-navy-900 text-xl uppercase tracking-tight">No Active Roster</p>
                      <p className="text-gray-500 text-sm mt-2">This franchise has not listed any active players for the current season.</p>
                    </div>
                  ) : (
                    <>
                      {viewMode === 'table' ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-navy-900 text-white">
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest w-16 text-center">No.</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest">Player</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">Pos</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">Height</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">Weight</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">PPG</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">RPG</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-center">APG</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {sortedPlayers.map((player) => (
                                <tr key={player.id} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-4 py-4 text-center font-black text-gray-300 group-hover:text-crimson-600 text-lg transition-colors italic">
                                    {player.jerseyNumber}
                                  </td>
                                  <td className="px-4 py-4">
                                    <Link to={`/players/${player.id}`} className="flex items-center gap-3 min-w-0">
                                      <div className="w-10 h-10 bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                                        <img src={player.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 object-top transition-all" />
                                      </div>
                                      <div>
                                        <div className="font-black text-navy-900 uppercase tracking-tight group-hover:text-crimson-600 transition-colors">
                                          {player.name}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{player.playerClass}</div>
                                      </div>
                                    </Link>
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-50 text-navy-900 text-xs font-black">
                                      {player.position}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-600">{player.height}</td>
                                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-600">{player.weight}</td>
                                  <td className="px-4 py-4 text-center font-bold text-navy-900 tabular-nums">{player.stats.ppg}</td>
                                  <td className="px-4 py-4 text-center font-bold text-navy-900 tabular-nums">{player.stats.rpg}</td>
                                  <td className="px-4 py-4 text-center font-bold text-navy-900 tabular-nums">{player.stats.apg}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50">
                          {sortedPlayers.map((player) => (
                            <Link key={player.id} to={`/players/${player.id}`} className="bg-white border border-gray-200 p-4 flex gap-4 group hover:border-gray-400 hover:shadow-md transition-all">
                              <div className="w-20 h-24 bg-gray-100 shrink-0 overflow-hidden border border-gray-200 relative">
                                <img src={player.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 object-top transition-all" />
                                <div className="absolute bottom-0 right-0 bg-navy-900 text-white text-[10px] font-black italic px-1.5 py-0.5">
                                  #{player.jerseyNumber}
                                </div>
                              </div>
                              <div className="flex flex-col justify-between py-1">
                                <div>
                                  <div className="flex font-black text-lg text-navy-900 uppercase tracking-tight group-hover:text-crimson-600 transition-colors leading-none">
                                    {player.name}
                                  </div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                                    {player.position} • {player.height}
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                  <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">PPG</div>
                                    <div className="font-extrabold text-navy-900 tabular-nums leading-none">{player.stats.ppg}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">RPG</div>
                                    <div className="font-extrabold text-navy-900 tabular-nums leading-none">{player.stats.rpg}</div>
                                  </div>
                                  <div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">APG</div>
                                    <div className="font-extrabold text-navy-900 tabular-nums leading-none">{player.stats.apg}</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Team Aggregate Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team PPG</p>
                    <p className="text-3xl font-black text-navy-900 tabular-nums">{avg((p) => p.stats.ppg)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team RPG</p>
                    <p className="text-3xl font-black text-navy-900 tabular-nums">{avg((p) => p.stats.rpg)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm p-5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team APG</p>
                    <p className="text-3xl font-black text-navy-900 tabular-nums">{avg((p) => p.stats.apg)}</p>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm p-5 text-center border-b-4 border-crimson-600">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team FG%</p>
                    <p className="text-3xl font-black text-navy-900 tabular-nums">{rosterCount > 0 ? `${avg((p) => p.stats.fgp)}%` : '—'}</p>
                  </div>
                </div>

              </>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 p-16 text-center">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase text-navy-900 mb-2">No Team Selected</h3>
                <p className="text-gray-500 text-sm">Please select a franchise from the sidebar to view their full roster and statistics.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RostersPage;
