import { supabase } from '../config/supabase';

import { Game, NewsArticle, Player, PlayerGameStats, Product, Sponsor, Team, Order, Ticket } from '../types';

export const ADMIN_CONTENT_EVENT = 'adminContentUpdated';

type AdminGameInput = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
  homeScore?: number;
  awayScore?: number;
  highlightVideoUrl?: string;
  playerStats?: {
    home: PlayerGameStats[];
    away: PlayerGameStats[];
  };
};



// --- OPTIMISTIC CACHE ---
const cache = {
  news: [] as NewsArticle[],
  products: [] as Product[],
  games: [] as AdminGameInput[],
  teams: [] as Team[],
  players: [] as Player[],
  sponsors: [] as Sponsor[],
  orders: [] as Order[],
  tickets: [] as Ticket[]
};

let isSupabaseLoaded = false;
export const getIsSupabaseLoaded = () => isSupabaseLoaded;

const triggerUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ADMIN_CONTENT_EVENT));
  }
};

const LS_KEY = 'bul_cache_v1';

// --- LOAD FROM LOCALSTORAGE (instant on reload) ---
const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (saved.teams) cache.teams = saved.teams;
    if (saved.players) cache.players = saved.players;
    if (saved.games) cache.games = saved.games;
    if (saved.news) cache.news = saved.news;
    if (saved.sponsors) cache.sponsors = saved.sponsors;
    if (saved.products && saved.products.length > 0) cache.products = saved.products;
    if (saved.tickets) cache.tickets = saved.tickets;
    console.log('[Cache] Loaded from localStorage instantly.');
    return true;
  } catch (e) {
    console.warn('[Cache] localStorage read failed:', e);
    return false;
  }
};

// --- SAVE TO LOCALSTORAGE ---
const saveToLocalStorage = () => {
  try {
    const toSave = {
      teams: cache.teams,
      players: cache.players,
      games: cache.games,
      news: cache.news,
      sponsors: cache.sponsors,
      products: cache.products,
      tickets: cache.tickets
    };
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn('[Cache] localStorage write failed (quota?):', e);
  }
};

// --- INITIALIZER ---
export const initSupabaseCache = async () => {
  if (isSupabaseLoaded) return;

  // Step 1: Load from localStorage immediately (synchronous, instant)
  const hadCache = loadFromLocalStorage();
  if (hadCache) {
    isSupabaseLoaded = true;
    triggerUpdate(); // Render with cached data right away
  }

  // Step 2: Refresh from Supabase in the background
  try {
    // Essential data for Homepage
    const [tRes, pRes, gRes, nRes, sRes, prRes] = await Promise.all([
      supabase.from('teams').select('id, name, mascot, abbreviation, primary_color, secondary_color, logo, conference, record, standing'),
      supabase.from('players').select('id, team_id, name, position, jersey_number, height, weight, year, hometown, avatar, date_of_birth, player_class, ppg, rpg, apg, spg, bpg, fgp, tpp, ftp'),
      supabase.from('games').select('*'),
      supabase.from('news_articles').select('id, title, summary, content, author, image, category, published_date'),
      supabase.from('sponsors').select('id, name, logo, category, description, benefits'),
      supabase.from('products').select('*')
    ]);

    if (tRes.error) console.error('[Supabase] teams:', tRes.error.message);
    if (pRes.error) console.error('[Supabase] players:', pRes.error.message);
    if (gRes.error) console.error('[Supabase] games:', gRes.error.message);
    if (nRes.error) console.error('[Supabase] news:', nRes.error.message);
    if (sRes.error) console.error('[Supabase] sponsors:', sRes.error.message);
    if (prRes.error) console.error('[Supabase] products:', prRes.error.message);

    if (tRes.data) {
      cache.teams = tRes.data.map(t => ({
        id: t.id, name: t.name, mascot: t.mascot, abbreviation: t.abbreviation,
        primaryColor: t.primary_color, secondaryColor: t.secondary_color,
        logo: t.logo || '',
        conference: t.conference, record: t.record, standing: t.standing, roster: []
      }));
      console.log('[Supabase] Teams loaded:', cache.teams.length);
    }

    if (pRes.data) {
      cache.players = pRes.data.map(p => ({
        id: p.id, team: p.team_id, name: p.name, position: p.position,
        jerseyNumber: p.jersey_number, height: p.height, weight: p.weight,
        year: p.year, hometown: p.hometown,
        avatar: p.avatar || '',
        dateOfBirth: p.date_of_birth,
        playerClass: p.player_class || p.year,
        stats: { ppg: p.ppg, rpg: p.rpg, apg: p.apg, spg: p.spg, bpg: p.bpg, fgp: p.fgp, tpp: p.tpp, ftp: p.ftp }
      }));
      console.log('[Supabase] Players loaded:', cache.players.length);
    }

    if (gRes.data) {
      cache.games = gRes.data.map(g => ({
        id: g.id, homeTeamId: g.home_team_id, awayTeamId: g.away_team_id,
        date: g.game_date, time: g.game_time, venue: g.venue, status: g.status,
        homeScore: g.home_score, awayScore: g.away_score,
        highlightVideoUrl: g.highlight_video_url || undefined,
        playerStats: undefined
      }));
      console.log('[Supabase] Games loaded:', cache.games.length);
    }

    if (nRes.data) {
      cache.news = nRes.data.map(n => ({
        id: n.id, title: n.title, summary: n.summary, content: n.content,
        author: n.author,
        image: n.image || '',
        category: n.category, date: n.published_date
      }));
      console.log('[Supabase] News loaded:', cache.news.length);
    }

    if (sRes.data) {
      cache.sponsors = sRes.data.map(s => ({
        id: s.id, name: s.name,
        logo: s.logo || '',
        category: s.category, description: s.description, benefits: s.benefits || []
      }));
      console.log('[Supabase] Sponsors loaded:', cache.sponsors.length);
    }

    if (prRes.data) {
      console.log('[Supabase] Raw products data:', prRes.data);
      cache.products = prRes.data.map(p => ({
        id: p.id, name: p.name, description: p.description, price: p.price,
        image: p.image || '',
        category: p.category, inStock: p.in_stock, featured: p.featured, team: p.team_id
      }));
      console.log('[Supabase] Products processed:', cache.products.length);
    } else if (prRes.error) {
      console.error('[Supabase] Products error:', prRes.error);
    }

    isSupabaseLoaded = true;
    saveToLocalStorage(); // Persist fresh data for next reload
    triggerUpdate();      // Re-render with fresh data from Supabase
    console.log('[Cache] Refreshed from Supabase and saved to localStorage.');

    // Background fetch for non-essential admin data
    Promise.all([
      supabase.from('tickets').select('*'),
      supabase.from('orders').select('*')
    ]).then(([tkRes, oRes]) => {
      if (tkRes.data) cache.tickets = tkRes.data.map(t => ({
        id: t.id, name: t.name, description: t.description, price: t.price,
        type: t.ticket_type, date: t.game_date, venue: t.venue, inStock: t.in_stock
      }));

      if (oRes.data) cache.orders = oRes.data.map(o => ({
        id: o.id, customerName: o.customer_name, customerEmail: o.customer_email,
        customerPhone: o.customer_phone, shippingAddress: o.shipping_address,
        totalAmount: o.total_amount, status: o.status, date: o.order_date, items: []
      }));
      saveToLocalStorage();
    });
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
    if (!hadCache) {
      isSupabaseLoaded = true;
      triggerUpdate();
    }
  }
};



// --- DATA ACCESSORS ---
export const getManagedNewsArticles = (): NewsArticle[] => [...cache.news];
export const getManagedProducts = (): Product[] => [...cache.products];
export const getManagedSponsors = (): Sponsor[] => [...cache.sponsors];

export const getManagedTeams = (): Team[] => {
  const allTeamsBase = [...cache.teams];
  const teamsWithStandings = calculateAutomatedStandings(allTeamsBase, cache.games);
  const allPlayers = getManagedPlayers();
  return teamsWithStandings.map((team) => ({
    ...team,
    roster: allPlayers.filter((player) => player.team === team.id)
  }));
};

export const getManagedPlayers = (): Player[] => {
  const allPlayersBase = [...cache.players];
  return calculateAutomatedPlayerStats(allPlayersBase, cache.games);
};

export const getManagedGames = (): Game[] => {
  const allTeams = getManagedTeams();
  const mappedAdminGames: Game[] = cache.games.map(ag => {
    // Graceful fallback to avoid crashing if teams list is completely empty
    const homeTeam = allTeams.find(t => t.id === ag.homeTeamId) || ({} as Team);
    const awayTeam = allTeams.find(t => t.id === ag.awayTeamId) || ({} as Team);
    return {
      id: ag.id, date: ag.date, time: ag.time, venue: ag.venue,
      isFeatured: false, isCompleted: ag.status === 'completed', status: ag.status,
      homeTeam, awayTeam, homeScore: ag.homeScore, awayScore: ag.awayScore,
      highlightVideoUrl: ag.highlightVideoUrl,
      stats: { playerStats: ag.playerStats }
    };
  });

  return mappedAdminGames;
};

// --- AUTOMATION CALCULATIONS ---
const calculateAutomatedStandings = (teams: Team[], games: AdminGameInput[]): Team[] => {
  const completedGames = games.filter(g => g.status === 'completed' && g.homeScore !== undefined && g.awayScore !== undefined);
  const teamStats = teams.map(team => {
    let wins = 0; let losses = 0; let pf = 0; let pa = 0;
    completedGames.forEach(game => {
      if (game.homeTeamId === team.id) {
        pf += game.homeScore!; pa += game.awayScore!;
        if (game.homeScore! > game.awayScore!) wins++; else if (game.homeScore! < game.awayScore!) losses++;
      } else if (game.awayTeamId === team.id) {
        pf += game.awayScore!; pa += game.homeScore!;
        if (game.awayScore! > game.homeScore!) wins++; else if (game.awayScore! < game.homeScore!) losses++;
      }
    });
    return { id: team.id, wins, losses, pf, pa, diff: pf - pa, winPct: (wins + losses) > 0 ? wins / (wins + losses) : 0 };
  });
  const sorted = [...teamStats].sort((a, b) => b.winPct - a.winPct || b.diff - a.diff);
  return teams.map(team => {
    const stats = sorted.find(s => s.id === team.id);
    const rank = sorted.findIndex(s => s.id === team.id) + 1;
    const wins = stats?.wins || 0;
    const losses = stats?.losses || 0;
    return {
      ...team,
      record: (wins > 0 || losses > 0) ? `${wins}-${losses}` : team.record,
      standing: rank || team.standing,
      stats: {
        wins: wins,
        losses: losses,
        winPercentage: stats?.winPct || 0,
        pointsFor: stats?.pf || 0,
        pointsAgainst: stats?.pa || 0,
        streak: team.stats?.streak || '-',
        homeRecord: team.stats?.homeRecord || '-',
        awayRecord: team.stats?.awayRecord || '-',
        conferenceRecord: team.stats?.conferenceRecord || '-',
        lastTenGames: team.stats?.lastTenGames || '-'
      }
    };
  });
};

const calculateAutomatedPlayerStats = (players: Player[], games: AdminGameInput[]): Player[] => {
  const gamesWithPlayerStats = games.filter(g => g.status === 'completed' && g.playerStats);
  return players.map(player => {
    let totalPoints = 0; let totalRebounds = 0; let totalAssists = 0; let totalSteals = 0; let totalBlocks = 0; let gamesPlayed = 0;
    gamesWithPlayerStats.forEach(game => {
      const pStats = [...(game.playerStats?.home || []), ...(game.playerStats?.away || [])].find(s => s.playerId === player.id);
      if (pStats) {
        totalPoints += pStats.points; totalRebounds += pStats.rebounds; totalAssists += pStats.assists; totalSteals += pStats.steals; totalBlocks += pStats.blocks; gamesPlayed++;
      }
    });
    if (gamesPlayed === 0) return player;
    return { ...player, stats: { ...player.stats, ppg: parseFloat((totalPoints / gamesPlayed).toFixed(1)), rpg: parseFloat((totalRebounds / gamesPlayed).toFixed(1)), apg: parseFloat((totalAssists / gamesPlayed).toFixed(1)), spg: parseFloat((totalSteals / gamesPlayed).toFixed(1)), bpg: parseFloat((totalBlocks / gamesPlayed).toFixed(1)) } };
  });
};

// --- DATA MODIFIERS (OPTIMISTIC SUPABASE WRITES) ---

export const addAdminNewsArticle = async (payload: Omit<NewsArticle, 'id'> & { id?: string }): Promise<NewsArticle> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.news.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('news_articles').insert({
    id: item.id, title: item.title, summary: item.summary, content: item.content,
    author: item.author, image: item.image, category: item.category, published_date: item.date
  });
  if (error) throw error;
  return item;
};

export const addAdminProduct = async (payload: Omit<Product, 'id'> & { id?: string }): Promise<Product> => {
  console.log('[Data] 1. addAdminProduct entry', payload);
  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return 'prod-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    }
  };
  const item = { ...payload, id: payload.id || generateId() };

  // Optimistic update
  cache.products.unshift(item);
  triggerUpdate();

  const { error, data } = await supabase.from('products').insert({
    id: item.id, name: item.name, description: item.description, price: item.price,
    image: item.image, category: item.category, in_stock: item.inStock, featured: item.featured,
    team_id: item.team
  }).select();

  if (error) {
    console.error('[Supabase Error] addAdminProduct:', error);
    // Remove from local cache if it failed? Optional, for now we throw to let the UI know.
    cache.products = cache.products.filter(p => p.id !== item.id);
    triggerUpdate();
    throw new Error(error.message);
  }

  console.log('[Supabase Success] Product inserted:', data);
  return item;
};

export const addAdminGame = async (payload: Omit<AdminGameInput, 'id'> & { id?: string }): Promise<AdminGameInput> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.games.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('games').insert({
    id: item.id, home_team_id: item.homeTeamId, away_team_id: item.awayTeamId,
    game_date: item.date, game_time: item.time, venue: item.venue, status: item.status,
    home_score: item.homeScore || 0, away_score: item.awayScore || 0,
    highlight_video_url: item.highlightVideoUrl || null
  });
  if (error) throw error;
  return item;
};

export const addAdminTeam = async (payload: Omit<Team, 'id'> & { id?: string }): Promise<Team> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.teams.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('teams').insert({
    id: item.id, name: item.name, mascot: item.mascot, abbreviation: item.abbreviation,
    primary_color: item.primaryColor, secondary_color: item.secondaryColor, logo: item.logo,
    conference: item.conference, record: item.record, standing: item.standing
  });
  if (error) throw error;
  return item;
};

export const addAdminSponsor = async (payload: Omit<Sponsor, 'id'> & { id?: string }): Promise<Sponsor> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.sponsors.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('sponsors').insert({
    id: item.id, name: item.name, logo: item.logo, category: item.category,
    description: item.description, benefits: item.benefits
  });
  if (error) throw error;
  return item;
};

export const addAdminPlayer = async (payload: Omit<Player, 'id'> & { id?: string }): Promise<Player> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.players.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('players').insert({
    id: item.id, team_id: item.team, name: item.name, position: item.position,
    jersey_number: item.jerseyNumber, height: item.height, weight: item.weight,
    year: item.year, hometown: item.hometown, avatar: item.avatar,
    date_of_birth: item.dateOfBirth || null,
    player_class: item.playerClass || null,
    ppg: item.stats.ppg, rpg: item.stats.rpg, apg: item.stats.apg, spg: item.stats.spg,
    bpg: item.stats.bpg, fgp: item.stats.fgp, tpp: item.stats.tpp, ftp: item.stats.ftp
  });
  if (error) throw error;
  return item;
};

export const updateAdminGameStats = (gameId: string, playerStats: { home: PlayerGameStats[]; away: PlayerGameStats[] }): void => {
  const game = cache.games.find(g => g.id === gameId);
  if (game) {
    game.playerStats = playerStats;
    triggerUpdate();
    // In a full implementation, we'd also push this to the game_player_stats table in Supabase.
  }
};

export const updateAdminNewsArticle = (id: string, payload: Partial<NewsArticle>): void => {
  const idx = cache.news.findIndex(n => n.id === id);
  if (idx !== -1) {
    cache.news[idx] = { ...cache.news[idx], ...payload };
    triggerUpdate();
    const item = cache.news[idx];
    supabase.from('news_articles').update({
      title: item.title, summary: item.summary, content: item.content,
      image: item.image, category: item.category
    }).eq('id', id).then();
  }
};

export const updateAdminProduct = async (id: string, payload: Partial<Product>): Promise<void> => {
  console.log('[Data] updateAdminProduct called for ID:', id, 'with payload:', payload);
  const idx = cache.products.findIndex(p => p.id === id);
  if (idx !== -1) {
    const originalItem = { ...cache.products[idx] };
    cache.products[idx] = { ...cache.products[idx], ...payload };
    triggerUpdate();
    const item = cache.products[idx];

    const { error, data } = await supabase.from('products').update({
      name: item.name, description: item.description, price: item.price,
      image: item.image, category: item.category, in_stock: item.inStock, featured: item.featured,
      team_id: item.team
    })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Supabase Error] updateAdminProduct:', error);
      // Revert cache if error
      cache.products[idx] = originalItem;
      triggerUpdate();
      throw new Error(error.message);
    }

    console.log('[Supabase Success] Product updated:', data);
  } else {
    console.warn('[Data] Product not found in cache for update:', id);
    throw new Error('Produit non trouvé.');
  }
};

export const updateAdminGame = async (id: string, payload: Partial<AdminGameInput>): Promise<void> => {
  const idx = cache.games.findIndex(g => g.id === id);
  if (idx !== -1) {
    cache.games[idx] = { ...cache.games[idx], ...payload };
    triggerUpdate();
    const item = cache.games[idx];
    const { error } = await supabase.from('games').update({
      home_team_id: item.homeTeamId, away_team_id: item.awayTeamId,
      game_date: item.date, game_time: item.time, venue: item.venue, status: item.status,
      home_score: item.homeScore, away_score: item.awayScore,
      highlight_video_url: item.highlightVideoUrl || null
    }).eq('id', id);
    if (error) throw error;
  }
};

export const updateAdminTeam = async (id: string, payload: Partial<Team>): Promise<void> => {
  const idx = cache.teams.findIndex(t => t.id === id);
  if (idx !== -1) {
    cache.teams[idx] = { ...cache.teams[idx], ...payload };
    triggerUpdate();
    const item = cache.teams[idx];
    const { error } = await supabase.from('teams').update({
      name: item.name, mascot: item.mascot, abbreviation: item.abbreviation,
      primary_color: item.primaryColor, secondary_color: item.secondaryColor, logo: item.logo,
      conference: item.conference, record: item.record, standing: item.standing
    }).eq('id', id);
    if (error) throw error;
  }
};

export const updateAdminSponsor = async (id: string, payload: Partial<Sponsor>): Promise<void> => {
  const idx = cache.sponsors.findIndex(s => s.id === id);
  if (idx !== -1) {
    cache.sponsors[idx] = { ...cache.sponsors[idx], ...payload };
    triggerUpdate();
    const item = cache.sponsors[idx];
    const { error } = await supabase.from('sponsors').update({
      name: item.name, logo: item.logo, category: item.category, description: item.description,
      benefits: item.benefits
    }).eq('id', id);
    if (error) throw error;
  }
};

export const updateAdminPlayer = async (id: string, payload: Partial<Player>): Promise<void> => {
  const idx = cache.players.findIndex(p => p.id === id);
  if (idx !== -1) {
    cache.players[idx] = { ...cache.players[idx], ...payload };
    triggerUpdate();
    const item = cache.players[idx];
    const { error } = await supabase.from('players').update({
      team_id: item.team, name: item.name, position: item.position, jersey_number: item.jerseyNumber,
      height: item.height, weight: item.weight, year: item.year, hometown: item.hometown, avatar: item.avatar,
      date_of_birth: item.dateOfBirth || null,
      player_class: item.playerClass || null,
      ppg: item.stats.ppg, rpg: item.stats.rpg, apg: item.stats.apg, spg: item.stats.spg,
      bpg: item.stats.bpg, fgp: item.stats.fgp, tpp: item.stats.tpp, ftp: item.stats.ftp
    }).eq('id', id);
    if (error) throw error;
  }
};

export const removeAdminNewsArticle = (id: string): void => {
  cache.news = cache.news.filter(x => x.id !== id); triggerUpdate();
  supabase.from('news_articles').delete().eq('id', id).then();
};
export const removeAdminProduct = (id: string): void => {
  cache.products = cache.products.filter(x => x.id !== id); triggerUpdate();
  supabase.from('products').delete().eq('id', id).then();
};
export const removeAdminGame = (id: string): void => {
  cache.games = cache.games.filter(x => x.id !== id); triggerUpdate();
  supabase.from('games').delete().eq('id', id).then();
};
export const removeAdminTeam = (id: string): void => {
  cache.teams = cache.teams.filter(x => x.id !== id); triggerUpdate();
  supabase.from('teams').delete().eq('id', id).then();
};
export const removeAdminSponsor = (id: string): void => {
  cache.sponsors = cache.sponsors.filter(x => x.id !== id); triggerUpdate();
  supabase.from('sponsors').delete().eq('id', id).then();
};
export const removeAdminPlayer = (id: string): void => {
  cache.players = cache.players.filter(x => x.id !== id); triggerUpdate();
  supabase.from('players').delete().eq('id', id).then();
};

export const getAdminOrders = (): Order[] => cache.orders;
export const getAdminTickets = (): Ticket[] => cache.tickets;

export const addAdminTicket = async (payload: Omit<Ticket, 'id'> & { id?: string }): Promise<Ticket> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.tickets.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('tickets').insert({
    id: item.id, name: item.name, description: item.description, price: item.price,
    ticket_type: item.type, game_date: item.date, venue: item.venue, in_stock: item.inStock
  });
  if (error) throw error;
  return item;
};
export const updateAdminTicket = async (id: string, payload: Partial<Ticket>): Promise<void> => {
  const idx = cache.tickets.findIndex(x => x.id === id);
  if (idx !== -1) {
    cache.tickets[idx] = { ...cache.tickets[idx], ...payload };
    triggerUpdate();
    const item = cache.tickets[idx];
    const { error } = await supabase.from('tickets').update({
      name: item.name, description: item.description, price: item.price,
      ticket_type: item.type, game_date: item.date, venue: item.venue, in_stock: item.inStock
    }).eq('id', id);
    if (error) throw error;
  }
};
export const removeAdminTicket = (id: string): void => {
  cache.tickets = cache.tickets.filter(x => x.id !== id); triggerUpdate();
  supabase.from('tickets').delete().eq('id', id).then();
};

export const addAdminOrder = async (payload: Omit<Order, 'id'> & { id?: string }): Promise<Order> => {
  const item = { ...payload, id: payload.id || crypto.randomUUID() };
  cache.orders.unshift(item);
  triggerUpdate();
  const { error } = await supabase.from('orders').insert({
    id: item.id, customer_name: item.customerName, customer_email: item.customerEmail,
    customer_phone: item.customerPhone, shipping_address: item.shippingAddress,
    total_amount: item.totalAmount, status: item.status
  });
  if (error) throw error;
  return item;
};
export const updateAdminOrder = async (id: string, payload: Partial<Order>): Promise<void> => {
  const idx = cache.orders.findIndex(x => x.id === id);
  if (idx !== -1) {
    cache.orders[idx] = { ...cache.orders[idx], ...payload }; triggerUpdate();
    const { error } = await supabase.from('orders').update({ status: cache.orders[idx].status }).eq('id', id);
    if (error) throw error;
  }
};
export const removeAdminOrder = (id: string): void => {
  cache.orders = cache.orders.filter(x => x.id !== id); triggerUpdate();
  supabase.from('orders').delete().eq('id', id).then();
};

export const getAdminNewsOnly = (): NewsArticle[] => cache.news;
export const getAdminProductsOnly = (): Product[] => cache.products;
export const getAdminGamesOnly = (): AdminGameInput[] => cache.games;
export const getAdminTeamsOnly = (): Team[] => cache.teams;
export const getAdminSponsorsOnly = (): Sponsor[] => cache.sponsors;
export const getAdminPlayersOnly = (): Player[] => cache.players;

export const clearAdminContent = (): void => {
  // Clearing cache deletes locally
  // We do not drop the entire Supabase DB here, that's too destructive. 
  // We'll just reset local storage memory if needed, but since it's Cloud, "clear" isn't standard.
  cache.news = []; cache.products = []; cache.games = []; cache.teams = [];
  cache.players = []; cache.sponsors = []; cache.orders = []; cache.tickets = [];
  triggerUpdate();
};

// Start initialization automatically on import
initSupabaseCache();
