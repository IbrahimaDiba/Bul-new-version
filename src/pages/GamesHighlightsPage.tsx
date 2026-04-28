import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Play, Sparkles, ChevronRight, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { getManagedGames, getManagedTeams, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import type { Game, Team } from '../types';

function gameHasHighlightsContent(game: Game): boolean {
  const hasText = (game.highlights?.length ?? 0) > 0;
  return Boolean(game.highlightVideoUrl || hasText);
}

const GamesHighlightsPage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  React.useEffect(() => {
    const reload = () => {
      setAllGames(getManagedGames());
      setAllTeams(getManagedTeams());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const highlightGames = useMemo(() => {
    return allGames.filter((g) => g.isCompleted && gameHasHighlightsContent(g));
  }, [allGames]);

  const filtered = useMemo(() => {
    if (teamFilter === 'all') return highlightGames;
    return highlightGames.filter(
      (g) => g.homeTeam.id === teamFilter || g.awayTeam.id === teamFilter
    );
  }, [highlightGames, teamFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
  }, [filtered]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-crimson-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="text-sm text-white/70 mb-4">
            <Link to="/games" className="hover:text-white transition-colors">
              Games
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Highlights</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <Clapperboard className="h-10 w-10 text-gold-400 shrink-0" aria-hidden />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Game highlights</h1>
          </div>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
            Replay moments, top plays, and recap clips from recent Basketball University League games.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Filter</p>
            <label htmlFor="highlights-team" className="sr-only">
              Team
            </label>
            <select
              id="highlights-team"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="mt-1 w-full sm:w-72 min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-navy-900 shadow-sm focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20"
            >
              <option value="all">All teams</option>
              {allTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            {sorted.length} highlight reel{sorted.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <Play className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-navy-900">No highlights yet</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              Check back after the next games, or browse the schedule and results.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/games/results"
                className="inline-flex items-center justify-center text-crimson-600 font-medium hover:text-crimson-700"
              >
                Game results
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                to="/games/schedule"
                className="inline-flex items-center justify-center text-navy-700 font-medium hover:text-navy-900"
              >
                Schedule
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-10 sm:space-y-12">
            {sorted.map((game, index) => (
              <motion.li
                key={game.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {game.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/90 text-navy-900 text-xs font-bold px-2.5 py-0.5">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Final · {formatDate(game.date)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                    <Link
                      to={`/teams/${game.homeTeam.id}`}
                      className="hover:text-crimson-600 transition-colors"
                    >
                      {game.homeTeam.name}
                    </Link>
                    <span className="text-gray-400 font-normal mx-2">vs</span>
                    <Link
                      to={`/teams/${game.awayTeam.id}`}
                      className="hover:text-crimson-600 transition-colors"
                    >
                      {game.awayTeam.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-lg sm:text-xl font-semibold tabular-nums text-navy-800">
                    {game.homeScore ?? '—'} – {game.awayScore ?? '—'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      {game.venue}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      {game.time}
                    </span>
                  </div>
                </div>

                {game.highlightVideoUrl && (
                  <div className="relative aspect-video w-full bg-navy-900">
                    <iframe
                      title={`Highlights: ${game.homeTeam.name} vs ${game.awayTeam.name}`}
                      src={game.highlightVideoUrl}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {game.highlights && game.highlights.length > 0 && (
                  <div className="p-4 sm:p-6">
                    <h3 className="text-sm font-semibold text-navy-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Play className="h-4 w-4 text-crimson-500" />
                      Top moments
                    </h3>
                    <ul className="space-y-2.5">
                      {game.highlights.map((line, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm sm:text-base text-gray-700 leading-relaxed"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-500" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-center sm:text-left">
          <Link
            to="/games/results"
            className="inline-flex items-center justify-center sm:justify-start text-crimson-600 font-medium hover:text-crimson-700"
          >
            All results
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
          <Link
            to="/games"
            className="inline-flex items-center justify-center sm:justify-start text-navy-700 font-medium hover:text-navy-900"
          >
            Games hub
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GamesHighlightsPage;
