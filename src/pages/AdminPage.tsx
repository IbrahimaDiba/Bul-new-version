import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trash2, LogOut, Download, RotateCcw, BarChart2, Save, X, Upload } from 'lucide-react';
import {
  addAdminTeam,
  addAdminProduct,
  getAdminPlayersOnly,
  getAdminGamesOnly,
  getAdminNewsOnly,
  getAdminProductsOnly,
  getAdminSponsorsOnly,
  getAdminTeamsOnly,
  getAdminOrders,
  getManagedTeams,
  clearAdminContent,
  removeAdminPlayer,
  removeAdminGame,
  removeAdminNewsArticle,
  removeAdminProduct,
  removeAdminSponsor,
  removeAdminTeam,
  addAdminGame,
  updateAdminGameStats,
  updateAdminNewsArticle,
  updateAdminProduct,
  updateAdminGame,
  updateAdminTeam,
  addAdminSponsor,
  updateAdminSponsor,
  updateAdminPlayer,
  updateAdminOrder,
  getAdminTickets,
  addAdminTicket,
  addAdminPlayer,
  addAdminNewsArticle,
  updateAdminTicket,
  removeAdminTicket,
  ADMIN_CONTENT_EVENT
} from '../data/adminContent';
import { Edit2, XCircle, Eye } from 'lucide-react';
import { NewsArticle, Player, PlayerGameStats, Product, Sponsor, Team, Order, Ticket } from '../types';

type Tab = 'overview' | 'orders' | 'tickets' | 'news' | 'products' | 'games' | 'teams' | 'players' | 'sponsors';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [productItems, setProductItems] = useState<Product[]>([]);
  const [gameItems, setGameItems] = useState<any[]>([]);
  const [teamItems, setTeamItems] = useState<Team[]>([]);
  const [playerItems, setPlayerItems] = useState<Player[]>([]);
  const [sponsorItems, setSponsorItems] = useState<Sponsor[]>([]);
  const [orderItems, setOrderItems] = useState<Order[]>([]);
  const [ticketItems, setTicketItems] = useState<Ticket[]>([]);
  const [managedTeams, setManagedTeams] = useState<Team[]>([]);

  const [ticketForm, setTicketForm] = useState({
    name: '',
    price: '',
    description: '',
    type: 'season' as 'season' | 'game',
    date: '',
    venue: '',
    inStock: true
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    image: '',
    category: 'general' as NewsArticle['category']
  });

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    team: '',
    inStock: true,
    featured: false
  });

  const [gameForm, setGameForm] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    venue: 'Dakar Arena',
    status: 'scheduled' as 'scheduled' | 'live' | 'completed',
    homeScore: '',
    awayScore: ''
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    mascot: '',
    abbreviation: '',
    logo: '',
    conference: 'East',
    record: '0-0',
    standing: '1',
    primaryColor: '#1a365d',
    secondaryColor: '#c41e3a'
  });

  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    logo: '',
    description: '',
    benefits: ''
  });

  const [playerForm, setPlayerForm] = useState({
    name: '',
    team: '',
    position: 'PG',
    jerseyNumber: '',
    height: '',
    weight: '',
    year: 'Freshman',
    hometown: '',
    avatar: '',
    dateOfBirth: '',
    playerClass: '',
    ppg: '',
    rpg: '',
    apg: '',
    spg: '',
    bpg: '',
    fgp: '',
    tpp: '',
    ftp: ''
  });
  const [editingStatsGameId, setEditingStatsGameId] = useState<string | null>(null);
  const [tempStats, setTempStats] = useState<{ home: PlayerGameStats[]; away: PlayerGameStats[] }>({ home: [], away: [] });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editing States
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  const reloadAdminData = () => {
    setNewsItems(getAdminNewsOnly());
    setProductItems(getAdminProductsOnly());
    setPlayerItems(getAdminPlayersOnly());
    setGameItems(getAdminGamesOnly());
    setTeamItems(getAdminTeamsOnly());
    setSponsorItems(getAdminSponsorsOnly());
    setOrderItems(getAdminOrders());
    setTicketItems(getAdminTickets());
    setManagedTeams(getManagedTeams());
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import('../config/supabase');
        // Verify real Supabase session — cannot be faked via localStorage
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        // Verify the user actually has admin role in the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const isAdmin = profile?.role === 'admin';
        setIsAuthenticated(isAdmin);

        if (!isAdmin) {
          // Clear any stale localStorage flags
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
        }
      } catch (e) {
        console.error('Auth check failed:', e);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    reloadAdminData();
    window.addEventListener('storage', reloadAdminData);
    window.addEventListener(ADMIN_CONTENT_EVENT, reloadAdminData);
    return () => {
      window.removeEventListener('storage', reloadAdminData);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reloadAdminData);
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 font-medium">Vérification de la session admin...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await import('../config/supabase').then(res => res.supabase.auth.signOut());
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: 'error', text: "L'image est trop lourde (max 10 Mo)." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const commonData = {
        ...newsForm,
        date: new Date().toISOString().split('T')[0],
        tags: []
      };

      setFeedback({ type: 'success', text: 'Enregistrement en cours...' });

      if (editingNewsId) {
        await updateAdminNewsArticle(editingNewsId, commonData);
        setEditingNewsId(null);
      } else {
        await addAdminNewsArticle(commonData);
      }

      setNewsForm({
        title: '',
        summary: '',
        content: '',
        author: '',
        image: '',
        category: 'general'
      });
      reloadAdminData();
      setFeedback({ type: 'success', text: `News ${editingNewsId ? 'mise à jour' : 'ajoutee'} avec succes.` });
    } catch (error: any) {
      console.error('[Admin] Error saving news:', error);
      setFeedback({ type: 'error', text: `Erreur: ${error.message || 'Enregistrement échoué'}` });
    }
  };

  const handleEditNews = (article: NewsArticle) => {
    setNewsForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      author: article.author,
      image: article.image,
      category: article.category
    });
    setEditingNewsId(article.id);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Admin] Submitting product form...', productForm);

    const price = parseFloat(productForm.price.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      console.warn('[Admin] Invalid price:', productForm.price);
      setFeedback({ type: 'error', text: 'Le prix du produit doit être un nombre supérieur à 0.' });
      return;
    }
    
    if (!productForm.category) {
      console.warn('[Admin] Category missing');
      setFeedback({ type: 'error', text: 'Veuillez sélectionner une catégorie.' });
      return;
    }
    
    if (!productForm.name.trim()) {
      console.warn('[Admin] Name missing');
      setFeedback({ type: 'error', text: 'Le nom du produit est obligatoire.' });
      return;
    }

    try {
      console.log('[Admin] Step 1: Preparing commonData');
      const commonData = {
        name: productForm.name,
        description: productForm.description,
        price: price,
        image: productForm.image,
        category: productForm.category,
        team: productForm.team || undefined,
        inStock: productForm.inStock,
        featured: productForm.featured
      };

      setFeedback({ type: 'success', text: 'Enregistrement en cours...' });

      if (editingProductId) {
        console.log('[Admin] Step 2: Awaiting Update existing product:', editingProductId);
        await updateAdminProduct(editingProductId, commonData);
        setEditingProductId(null);
      } else {
        console.log('[Admin] Step 2: Awaiting Add new product...');
        await addAdminProduct(commonData);
      }

      console.log('[Admin] Step 3: Resetting form');
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        team: '',
        inStock: true,
        featured: false
      });
      
      console.log('[Admin] Step 4: Reloading data');
      reloadAdminData();
      setFeedback({ type: 'success', text: `Produit ${editingProductId ? 'mis à jour' : 'ajouté'} avec succès.` });
      console.log('[Admin] Step 5: Finished!');
    } catch (error: any) {
      console.error('[Admin] CRASH at handleProductSubmit:', error);
      // Constructing a clearer error message for the user
      let errorMsg = 'Erreur lors de l\'enregistrement.';
      if (error.message) {
        if (error.message.includes('row-level security')) {
          errorMsg = 'Permission refusée (RLS). Vous devez être connecté pour modifier les produits.';
        } else {
          errorMsg = `Erreur: ${error.message}`;
        }
      }
      setFeedback({ type: 'error', text: errorMsg });
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      team: product.team || '',
      inStock: product.inStock,
      featured: product.featured
    });
    setEditingProductId(product.id);
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerForm.name.trim()) {
      setFeedback({ type: 'error', text: 'Le nom du joueur est obligatoire.' });
      return;
    }
    
    try {
      const commonData = {
        name: playerForm.name,
        position: playerForm.position,
        team: playerForm.team,
        jerseyNumber: Number(playerForm.jerseyNumber),
        height: playerForm.height,
        weight: playerForm.weight,
        year: playerForm.year,
        hometown: playerForm.hometown,
        avatar: playerForm.avatar,
        dateOfBirth: playerForm.dateOfBirth,
        playerClass: playerForm.playerClass,
        stats: {
          ppg: Number(playerForm.ppg),
          rpg: Number(playerForm.rpg),
          apg: Number(playerForm.apg),
          spg: Number(playerForm.spg),
          bpg: Number(playerForm.bpg),
          fgp: Number(playerForm.fgp),
          tpp: Number(playerForm.tpp),
          ftp: Number(playerForm.ftp)
        }
      };

      setFeedback({ type: 'success', text: 'Enregistrement en cours...' });

      if (editingPlayerId) {
        await updateAdminPlayer(editingPlayerId, commonData);
        setEditingPlayerId(null);
      } else {
        await addAdminPlayer(commonData);
      }

      setPlayerForm({
        name: '',
        team: '',
        position: 'PG',
        jerseyNumber: '',
        height: '',
        weight: '',
        year: 'Freshman',
        hometown: '',
        avatar: '',
        dateOfBirth: '',
        playerClass: '',
        ppg: '',
        rpg: '',
        apg: '',
        spg: '',
        bpg: '',
        fgp: '',
        tpp: '',
        ftp: ''
      });
      reloadAdminData();
      setFeedback({ type: 'success', text: `Joueur ${editingPlayerId ? 'mis à jour' : 'ajoute'} avec succes.` });
    } catch (error: any) {
      console.error('[Admin] Error saving player:', error);
      setFeedback({ type: 'error', text: `Erreur: ${error.message || 'Enregistrement échoué'}` });
    }
  };

  const handleEditPlayer = (player: Player) => {
    setPlayerForm({
      name: player.name,
      team: player.team,
      position: player.position,
      jerseyNumber: player.jerseyNumber.toString(),
      height: player.height,
      weight: player.weight,
      year: player.year,
      hometown: player.hometown,
      avatar: player.avatar,
      dateOfBirth: player.dateOfBirth || '',
      playerClass: player.playerClass || '',
      ppg: player.stats.ppg.toString(),
      rpg: player.stats.rpg.toString(),
      apg: player.stats.apg.toString(),
      spg: player.stats.spg.toString(),
      bpg: player.stats.bpg.toString(),
      fgp: player.stats.fgp.toString(),
      tpp: player.stats.tpp.toString(),
      ftp: player.stats.ftp.toString()
    });
    setEditingPlayerId(player.id);
  };

  const handleGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameForm.date || !gameForm.time || !gameForm.venue) {
      alert('Veuillez remplir la date, l\'heure et la salle.');
      setFeedback({ type: 'error', text: 'Veuillez remplir la date, l\'heure et la salle.' });
      return;
    }
    if (!gameForm.homeTeamId || !gameForm.awayTeamId) {
      alert('Veuillez sélectionner les deux équipes (Home et Away).');
      setFeedback({ type: 'error', text: 'Veuillez sélectionner les deux équipes (Home et Away).' });
      return;
    }
    if (gameForm.homeTeamId === gameForm.awayTeamId) {
      alert('Les équipes Home et Away doivent être différentes.');
      setFeedback({ type: 'error', text: 'Les équipes Home et Away doivent être différentes.' });
      return;
    }
    if (gameForm.status !== 'scheduled' && (gameForm.homeScore === '' || gameForm.awayScore === '')) {
      alert('Renseigne les scores pour un match live ou termine.');
      setFeedback({ type: 'error', text: 'Renseigne les scores pour un match live ou termine.' });
      return;
    }
    
    const commonData = {
      homeTeamId: gameForm.homeTeamId,
      awayTeamId: gameForm.awayTeamId,
      date: gameForm.date,
      time: gameForm.time,
      venue: gameForm.venue,
      status: gameForm.status,
      homeScore: gameForm.status !== 'scheduled' ? Number(gameForm.homeScore) : undefined,
      awayScore: gameForm.status !== 'scheduled' ? Number(gameForm.awayScore) : undefined
    };

    if (editingGameId) {
      updateAdminGame(editingGameId, commonData);
      setEditingGameId(null);
    } else {
      addAdminGame(commonData);
    }

    setGameForm({
      homeTeamId: '',
      awayTeamId: '',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      venue: 'Dakar Arena',
      status: 'scheduled',
      homeScore: '',
      awayScore: ''
    });
    reloadAdminData();
    setFeedback({ type: 'success', text: `Match ${editingGameId ? 'mis à jour' : 'ajoute'} avec succes.` });
  };

  const handleEditGame = (game: any) => {
    setGameForm({
      homeTeamId: game.homeTeamId,
      awayTeamId: game.awayTeamId,
      date: game.date,
      time: game.time,
      venue: game.venue,
      status: game.status,
      homeScore: game.homeScore?.toString() || '',
      awayScore: game.awayScore?.toString() || ''
    });
    setEditingGameId(game.id);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamId && managedTeams.some((team) => team.abbreviation.toLowerCase() === teamForm.abbreviation.toLowerCase())) {
      setFeedback({ type: 'error', text: 'Cette abreviation existe deja.' });
      return;
    }
    
    try {
      const commonData = {
        name: teamForm.name,
        mascot: teamForm.mascot,
        abbreviation: teamForm.abbreviation,
        logo: teamForm.logo,
        conference: teamForm.conference as any,
        record: teamForm.record,
        standing: Number(teamForm.standing),
        primaryColor: teamForm.primaryColor,
        secondaryColor: teamForm.secondaryColor,
        roster: []
      };

      setFeedback({ type: 'success', text: 'Enregistrement en cours...' });

      if (editingTeamId) {
        await updateAdminTeam(editingTeamId, commonData);
        setEditingTeamId(null);
      } else {
        await addAdminTeam(commonData);
      }

      setTeamForm({
        name: '',
        mascot: '',
        abbreviation: '',
        logo: '',
        conference: 'East',
        record: '0-0',
        standing: '1',
        primaryColor: '#1a365d',
        secondaryColor: '#c41e3a'
      });
      reloadAdminData();
      setFeedback({ type: 'success', text: `Equipe ${editingTeamId ? 'mise à jour' : 'ajoutee'} avec succes.` });
    } catch (error: any) {
      console.error('[Admin] Error saving team:', error);
      setFeedback({ type: 'error', text: `Erreur: ${error.message || 'Enregistrement échoué'}` });
    }
  };

  const handleEditTeam = (team: Team) => {
    setTeamForm({
      name: team.name,
      mascot: team.mascot,
      abbreviation: team.abbreviation,
      logo: team.logo,
      conference: team.conference,
      record: team.record,
      standing: team.standing.toString(),
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor
    });
    setEditingTeamId(team.id);
  };

  const handleStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStatsGameId) return;

    updateAdminGameStats(editingStatsGameId, tempStats);
    setEditingStatsGameId(null);
    reloadAdminData();
    setFeedback({ type: 'success', text: 'Statistiques enregistrées avec succès.' });
  };

  const openStatsEditor = (game: any) => {
    const homeTeam = managedTeams.find((t) => t.id === game.homeTeamId);
    const awayTeam = managedTeams.find((t) => t.id === game.awayTeamId);

    const existingStats = game.playerStats || {
      home:
        homeTeam?.roster.map((p) => ({
          playerId: p.id,
          name: p.name,
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fouls: 0
        })) || [],
      away:
        awayTeam?.roster.map((p) => ({
          playerId: p.id,
          name: p.name,
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fouls: 0
        })) || []
    };

    setTempStats(existingStats);
    setEditingStatsGameId(game.id);
  };

  const updatePlayerStat = (side: 'home' | 'away', playerId: string, field: keyof PlayerGameStats, value: number) => {
    setTempStats((prev) => ({
      ...prev,
      [side]: prev[side].map((ps) => (ps.playerId === playerId ? { ...ps, [field]: value } : ps))
    }));
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFeedback({ type: 'success', text: 'Enregistrement en cours...' });
      
      const commonData = {
        name: sponsorForm.name,
        logo: sponsorForm.logo,
        category: 'Partner',
        description: sponsorForm.description,
        benefits: sponsorForm.benefits
          ? sponsorForm.benefits.split(',').map((b) => b.trim()).filter(Boolean)
          : []
      };

      if (editingSponsorId) {
        await updateAdminSponsor(editingSponsorId, commonData);
        setEditingSponsorId(null);
      } else {
        await addAdminSponsor(commonData);
      }

      setSponsorForm({
        name: '',
        logo: '',
        description: '',
        benefits: ''
      });
      reloadAdminData();
      setFeedback({ type: 'success', text: `Sponsor ${editingSponsorId ? 'mis à jour' : 'ajouté'} avec succès.` });
    } catch (error: any) {
      console.error('[Admin] Error saving sponsor:', error);
      setFeedback({ type: 'error', text: `Erreur: ${error.message || 'Enregistrement échoué'}` });
    }
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setSponsorForm({
      name: sponsor.name,
      logo: sponsor.logo,
      description: sponsor.description,
      benefits: sponsor.benefits.join(', ')
    });
    setEditingSponsorId(sponsor.id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(ticketForm.price) <= 0) {
      setFeedback({ type: 'error', text: 'Le prix du ticket doit etre superieur a 0.' });
      return;
    }
    
    const commonData = {
      name: ticketForm.name,
      description: ticketForm.description,
      price: Number(ticketForm.price),
      type: ticketForm.type,
      date: ticketForm.date || undefined,
      venue: ticketForm.venue || undefined,
      inStock: ticketForm.inStock
    };

    if (editingTicketId) {
      updateAdminTicket(editingTicketId, commonData);
      setEditingTicketId(null);
    } else {
      addAdminTicket(commonData);
    }

    setTicketForm({
      name: '',
      price: '',
      description: '',
      type: 'season',
      date: '',
      venue: '',
      inStock: true
    });
    reloadAdminData();
    setFeedback({ type: 'success', text: `Ticket ${editingTicketId ? 'mis à jour' : 'ajoute'} avec succes.` });
  };

  const handleEditTicket = (ticket: Ticket) => {
    setTicketForm({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price.toString(),
      type: ticket.type,
      date: ticket.date || '',
      venue: ticket.venue || '',
      inStock: ticket.inStock
    });
    setEditingTicketId(ticket.id);
  };

  const handleExportAdminData = () => {
    const payload = {
      news: newsItems,
      products: productItems,
      players: playerItems,
      games: gameItems,
      teams: teamItems,
      sponsors: sponsorItems
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-content-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ type: 'success', text: 'Export JSON telecharge.' });
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    updateAdminOrder(id, { status });
    reloadAdminData();
    setFeedback({ type: 'success', text: `Statut de la commande mis à jour.` });
  };



  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-navy-900 text-white rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Ajoute et gère le contenu du site (News, Shop, Games, Teams, Sponsors).</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 bg-crimson-600 hover:bg-crimson-700 px-4 py-2 rounded-lg font-bold"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {feedback && (
          <div
            className={`rounded-xl px-4 py-3 mb-6 text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Commandes</p><p className="text-2xl font-black text-navy-900">{orderItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Tickets</p><p className="text-2xl font-black text-navy-900">{ticketItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">News</p><p className="text-2xl font-black text-navy-900">{newsItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Produits</p><p className="text-2xl font-black text-navy-900">{productItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Joueurs</p><p className="text-2xl font-black text-navy-900">{playerItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Matchs</p><p className="text-2xl font-black text-navy-900">{gameItems.length}</p></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><p className="text-xs text-gray-500">Equipes</p><p className="text-2xl font-black text-navy-900">{teamItems.length}</p></div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {(['overview', 'orders', 'tickets', 'news', 'products', 'games', 'teams', 'players', 'sponsors'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-bold uppercase ${
                  activeTab === tab ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-black text-navy-900 mb-4">Aperçu & Analytics</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 border rounded-lg border-gray-200">
                  <span className="font-bold text-gray-600">Revenus Boutiques</span>
                  <span className="font-black text-crimson-600 text-2xl">
                    {orderItems.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-4 border rounded-lg border-gray-200">
                  <span className="font-bold text-gray-600">Commandes Récents</span>
                  <span className="font-black text-navy-900 text-2xl">{orderItems.length}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-navy-900 mb-3">Actions globales</h2>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleExportAdminData} className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg font-bold">
                  <Download className="w-4 h-4" /> Export JSON
                </button>

              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-black text-navy-900 mb-4">Commandes Récentes</h2>
              {orderItems.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune commande récente.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {orderItems.slice(0, 5).map(order => (
                    <li key={order.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-navy-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.totalAmount.toLocaleString('fr-FR')} FCFA • {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
            <h2 className="text-xl font-black text-navy-900 mb-6">Gestion des Commandes</h2>
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Aucune commande pour le moment.</p>
            ) : (
              <div className="overflow-x-auto text-left">
                <table className="w-full text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orderItems.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          <p className="text-navy-900 text-xs font-semibold">{new Date(order.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-navy-900">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-crimson-600">
                          {order.totalAmount.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                            className={`px-2 py-1 rounded text-xs font-bold uppercase border-0 outline-none ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-[10px] text-gray-400 max-w-[120px] truncate ml-auto">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleNewsSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingNewsId ? 'Modifier la News' : 'Ajouter une News'}</h2>
                {editingNewsId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNewsId(null);
                      setNewsForm({ title: '', summary: '', content: '', author: '', image: '', category: 'general' });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Titre" className="w-full border rounded-lg p-3" />
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Image de l'article</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-crimson-500 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setNewsForm({ ...newsForm, image: base64 }))} className="hidden" />
                  </label>
                  {newsForm.image && (
                    <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={newsForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <select value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as NewsArticle['category'] })} className="w-full border rounded-lg p-3">
                <option value="general">General</option>
                <option value="team">Team</option>
                <option value="player">Player</option>
                <option value="league">League</option>
              </select>
              <textarea required value={newsForm.summary} onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })} placeholder="Résumé" className="w-full border rounded-lg p-3 min-h-20" />
              <textarea required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Contenu" className="w-full border rounded-lg p-3 min-h-32" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                  {editingNewsId ? 'Mettre à jour' : 'Publier'}
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">News ajoutées ({newsItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {newsItems.map((article) => (
                  <div key={article.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                    {article.image && (
                      <div className="w-12 h-12 rounded border overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={article.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-navy-900 line-clamp-1">{article.title}</p>
                      <p className="text-xs text-gray-500">{article.author} - {article.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditNews(article)} className="text-navy-900 hover:text-navy-700 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { removeAdminNewsArticle(article.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleProductSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingProductId ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({ name: '', description: '', price: '', image: '', category: '', team: '', inStock: true, featured: false });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Nom produit" className="w-full border rounded-lg p-3" />
              <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Prix" className="w-full border rounded-lg p-3" />
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Image du produit</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-crimson-500 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setProductForm({ ...productForm, image: base64 }))} className="hidden" />
                  </label>
                  {productForm.image && (
                    <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <select 
                value={productForm.category} 
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} 
                className="w-full border rounded-lg p-3 bg-white"
              >
                <option value="" disabled>-- Sélectionner une catégorie --</option>
                <option value="jerseys">Jerseys</option>
                <option value="shorts">Shorts</option>
                <option value="hoodies">Hoodies</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="accessories">Accessoires</option>
                <option value="equipment">Équipement</option>
                <option value="footwear">Chaussures</option>
              </select>
              <select 
                value={productForm.team} 
                onChange={(e) => setProductForm({ ...productForm, team: e.target.value })} 
                className="w-full border rounded-lg p-3 bg-white"
              >
                <option value="">-- Sélectionner l'équipe (Optionnel) --</option>
                {managedTeams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <textarea required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" className="w-full border rounded-lg p-3 min-h-24" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} /> En stock</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} /> En vedette</label>
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                {editingProductId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">Produits ajoutés ({productItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {productItems.map((product) => (
                  <div key={product.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                    {product.image && (
                      <div className="w-12 h-12 rounded border overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-navy-900">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.price.toLocaleString('fr-FR')} FCFA - {product.category}
                        {product.team && ` (${managedTeams.find(t => t.id === product.team)?.name || product.team})`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditProduct(product)} className="text-navy-900 hover:text-navy-700 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { removeAdminProduct(product.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleGameSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingGameId ? 'Modifier le Match' : 'Ajouter un Match'}</h2>
                {editingGameId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGameId(null);
                      setGameForm({ homeTeamId: '', awayTeamId: '', date: '', time: '', venue: '', status: 'scheduled', homeScore: '', awayScore: '' });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <select value={gameForm.homeTeamId} onChange={(e) => setGameForm({ ...gameForm, homeTeamId: e.target.value })} className="w-full border rounded-lg p-3">
                <option value="" disabled>-- Sélectionner l'équipe Home --</option>
                {managedTeams.map((team) => <option key={team.id} value={team.id}>Home: {team.name}</option>)}
              </select>
              <select value={gameForm.awayTeamId} onChange={(e) => setGameForm({ ...gameForm, awayTeamId: e.target.value })} className="w-full border rounded-lg p-3">
                <option value="" disabled>-- Sélectionner l'équipe Away --</option>
                {managedTeams.map((team) => <option key={team.id} value={team.id}>Away: {team.name}</option>)}
              </select>
              <input type="date" value={gameForm.date} onChange={(e) => setGameForm({ ...gameForm, date: e.target.value })} className="w-full border rounded-lg p-3" />
              <input type="time" value={gameForm.time} onChange={(e) => setGameForm({ ...gameForm, time: e.target.value })} className="w-full border rounded-lg p-3" />
              <input value={gameForm.venue} onChange={(e) => setGameForm({ ...gameForm, venue: e.target.value })} placeholder="Salle / Stade" className="w-full border rounded-lg p-3" />
              <select value={gameForm.status} onChange={(e) => setGameForm({ ...gameForm, status: e.target.value as 'scheduled' | 'live' | 'completed' })} className="w-full border rounded-lg p-3">
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
              {gameForm.status !== 'scheduled' && (
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={gameForm.homeScore} onChange={(e) => setGameForm({ ...gameForm, homeScore: e.target.value })} placeholder="Score Home" className="w-full border rounded-lg p-3" />
                  <input type="number" value={gameForm.awayScore} onChange={(e) => setGameForm({ ...gameForm, awayScore: e.target.value })} placeholder="Score Away" className="w-full border rounded-lg p-3" />
                </div>
              )}
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                {editingGameId ? 'Mettre à jour' : 'Ajouter match'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">Matchs ajoutés ({gameItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {gameItems.map((game) => {
                  const home = managedTeams.find((t) => t.id === game.homeTeamId);
                  const away = managedTeams.find((t) => t.id === game.awayTeamId);
                  return (
                    <div key={game.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-navy-900">{home?.name} vs {away?.name}</p>
                        <p className="text-xs text-gray-500">{game.date} {game.time} - {game.venue}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-crimson-600">{game.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditGame(game)} className="text-navy-900 hover:text-navy-700 p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { removeAdminGame(game.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openStatsEditor(game)} className="text-navy-900 hover:text-navy-700 flex items-center gap-1 text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">
                          <BarChart2 className="w-3 h-3" /> Stats
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {editingStatsGameId && (
              <div className="lg:col-span-2 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center bg-navy-900 text-white">
                    <div>
                      <h2 className="text-xl font-black">Statistiques du Match</h2>
                      <p className="text-xs text-gray-400">Entre les points, rebonds, passes, etc. pour chaque joueur.</p>
                    </div>
                    <button onClick={() => setEditingStatsGameId(null)} className="text-gray-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-6 space-y-8">
                    <section>
                      <h3 className="text-lg font-black text-navy-900 mb-4 border-b pb-2">Home Team</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left border-b bg-gray-50">
                              <th className="p-2">Joueur</th>
                              <th className="p-2">MIN</th>
                              <th className="p-2">PTS</th>
                              <th className="p-2">REB</th>
                              <th className="p-2">AST</th>
                              <th className="p-2">STL</th>
                              <th className="p-2">BLK</th>
                              <th className="p-2">TO</th>
                              <th className="p-2">PF</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tempStats.home.map((ps) => (
                              <tr key={ps.playerId} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-bold whitespace-nowrap">{ps.name}</td>
                                {(['minutes', 'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'] as const).map((field) => (
                                  <td key={field} className="p-1">
                                    <input
                                      type="number"
                                      min="0"
                                      value={ps[field]}
                                      onChange={(e) => updatePlayerStat('home', ps.playerId, field, parseInt(e.target.value) || 0)}
                                      className="w-16 border rounded p-1 text-center"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-black text-navy-900 mb-4 border-b pb-2">Away Team</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left border-b bg-gray-50">
                              <th className="p-2">Joueur</th>
                              <th className="p-2">MIN</th>
                              <th className="p-2">PTS</th>
                              <th className="p-2">REB</th>
                              <th className="p-2">AST</th>
                              <th className="p-2">STL</th>
                              <th className="p-2">BLK</th>
                              <th className="p-2">TO</th>
                              <th className="p-2">PF</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tempStats.away.map((ps) => (
                              <tr key={ps.playerId} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-bold whitespace-nowrap">{ps.name}</td>
                                {(['minutes', 'points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls'] as const).map((field) => (
                                  <td key={field} className="p-1">
                                    <input
                                      type="number"
                                      min="0"
                                      value={ps[field]}
                                      onChange={(e) => updatePlayerStat('away', ps.playerId, field, parseInt(e.target.value) || 0)}
                                      className="w-16 border rounded p-1 text-center"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                  <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setEditingStatsGameId(null)} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200">
                      Annuler
                    </button>
                    <button onClick={handleStatsSubmit} className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                      <Save className="w-4 h-4" /> Enregistrer stats
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleTeamSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingTeamId ? 'Modifier l’Équipe' : 'Ajouter une Équipe'}</h2>
                {editingTeamId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTeamId(null);
                      setTeamForm({ name: '', mascot: '', abbreviation: '', logo: '', conference: 'East', record: '0-0', standing: '1', primaryColor: '#1a365d', secondaryColor: '#c41e3a' });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input required value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Nom équipe" className="w-full border rounded-lg p-3" />
              <input required value={teamForm.mascot} onChange={(e) => setTeamForm({ ...teamForm, mascot: e.target.value })} placeholder="Mascotte" className="w-full border rounded-lg p-3" />
              <input required value={teamForm.abbreviation} onChange={(e) => setTeamForm({ ...teamForm, abbreviation: e.target.value })} placeholder="Abréviation (ex: UCAO)" className="w-full border rounded-lg p-3" />
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Logo de l'équipe</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-crimson-500 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choisir un logo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setTeamForm({ ...teamForm, logo: base64 }))} className="hidden" />
                  </label>
                  {teamForm.logo && (
                    <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0 p-2">
                      <img src={teamForm.logo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={teamForm.conference} onChange={(e) => setTeamForm({ ...teamForm, conference: e.target.value })} className="w-full border rounded-lg p-3">
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
                <input required value={teamForm.record} onChange={(e) => setTeamForm({ ...teamForm, record: e.target.value })} placeholder="Record ex: 0-0" className="w-full border rounded-lg p-3" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input required type="number" min={1} value={teamForm.standing} onChange={(e) => setTeamForm({ ...teamForm, standing: e.target.value })} placeholder="Standing" className="w-full border rounded-lg p-3" />
                <input required type="color" value={teamForm.primaryColor} onChange={(e) => setTeamForm({ ...teamForm, primaryColor: e.target.value })} className="w-full border rounded-lg p-1 h-12" />
                <input required type="color" value={teamForm.secondaryColor} onChange={(e) => setTeamForm({ ...teamForm, secondaryColor: e.target.value })} className="w-full border rounded-lg p-1 h-12" />
              </div>
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                {editingTeamId ? 'Mettre à jour' : 'Ajouter équipe'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">Equipes ajoutées ({teamItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {teamItems.map((team) => (
                  <div key={team.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                    {team.logo && (
                      <div className="w-10 h-10 rounded border overflow-hidden bg-gray-50 flex-shrink-0 p-1">
                        <img src={team.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-navy-900">{team.name} ({team.abbreviation})</p>
                      <p className="text-xs text-gray-500">{team.conference} - {team.record}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditTeam(team)} className="text-navy-900 hover:text-navy-700 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { removeAdminTeam(team.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handlePlayerSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingPlayerId ? 'Modifier le Joueur' : 'Ajouter un Joueur'}</h2>
                {editingPlayerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlayerId(null);
                      setPlayerForm({ name: '', team: '', position: 'PG', jerseyNumber: '', height: '', weight: '', year: 'Freshman', hometown: '', avatar: '', ppg: '', rpg: '', apg: '', spg: '', bpg: '', fgp: '', tpp: '', ftp: '' });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input required value={playerForm.name} onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} placeholder="Nom complet" className="w-full border rounded-lg p-3" />
              <div className="grid grid-cols-2 gap-3">
                {managedTeams.length > 0 ? (
                  <select
                    value={playerForm.team}
                    onChange={(e) => setPlayerForm({ ...playerForm, team: e.target.value })}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">-- Choisir une équipe --</option>
                    {managedTeams.map((team) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={playerForm.team}
                    onChange={(e) => setPlayerForm({ ...playerForm, team: e.target.value })}
                    placeholder="Nom de l'équipe"
                    className="w-full border rounded-lg p-3"
                  />
                )}
                <select value={playerForm.position} onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })} className="w-full border rounded-lg p-3">
                  <option value="PG">PG</option>
                  <option value="SG">SG</option>
                  <option value="SF">SF</option>
                  <option value="PF">PF</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={playerForm.jerseyNumber} onChange={(e) => setPlayerForm({ ...playerForm, jerseyNumber: e.target.value })} placeholder="Numero maillot" className="w-full border rounded-lg p-3" />
                <input value={playerForm.height} onChange={(e) => setPlayerForm({ ...playerForm, height: e.target.value })} placeholder="Taille (ex: 6'6)" className="w-full border rounded-lg p-3" />
                <input value={playerForm.weight} onChange={(e) => setPlayerForm({ ...playerForm, weight: e.target.value })} placeholder="Poids (ex: 210 lbs)" className="w-full border rounded-lg p-3" />
              </div>
              <input value={playerForm.hometown} onChange={(e) => setPlayerForm({ ...playerForm, hometown: e.target.value })} placeholder="Ville d'origine" className="w-full border rounded-lg p-3" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Date de naissance</label>
                  <input type="date" value={playerForm.dateOfBirth} onChange={(e) => setPlayerForm({ ...playerForm, dateOfBirth: e.target.value })} className="w-full border rounded-lg p-3" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Classe du joueur</label>
                  <input value={playerForm.playerClass} onChange={(e) => setPlayerForm({ ...playerForm, playerClass: e.target.value })} placeholder="ex: Licence 2, Master 1" className="w-full border rounded-lg p-3" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Photo du joueur</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-crimson-500 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setPlayerForm({ ...playerForm, avatar: base64 }))} className="hidden" />
                  </label>
                  {playerForm.avatar && (
                    <div className="w-12 h-12 rounded-full border overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={playerForm.avatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <input type="number" step="0.1" value={playerForm.ppg} onChange={(e) => setPlayerForm({ ...playerForm, ppg: e.target.value })} placeholder="PPG" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.rpg} onChange={(e) => setPlayerForm({ ...playerForm, rpg: e.target.value })} placeholder="RPG" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.apg} onChange={(e) => setPlayerForm({ ...playerForm, apg: e.target.value })} placeholder="APG" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.spg} onChange={(e) => setPlayerForm({ ...playerForm, spg: e.target.value })} placeholder="SPG" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.bpg} onChange={(e) => setPlayerForm({ ...playerForm, bpg: e.target.value })} placeholder="BPG" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.fgp} onChange={(e) => setPlayerForm({ ...playerForm, fgp: e.target.value })} placeholder="FG%" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.tpp} onChange={(e) => setPlayerForm({ ...playerForm, tpp: e.target.value })} placeholder="3P%" className="w-full border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" value={playerForm.ftp} onChange={(e) => setPlayerForm({ ...playerForm, ftp: e.target.value })} placeholder="FT%" className="w-full border rounded-lg p-2 text-sm" />
              </div>
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                {editingPlayerId ? 'Mettre à jour' : 'Ajouter joueur'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">Joueurs ajoutés ({playerItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {playerItems.map((player) => {
                  const team = managedTeams.find((item) => item.id === player.team);
                  return (
                    <div key={player.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                      {player.avatar && (
                        <div className="w-10 h-10 rounded-full border overflow-hidden bg-gray-50 flex-shrink-0">
                          <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-navy-900">{player.name} (#{player.jerseyNumber})</p>
                        <p className="text-xs text-gray-500">{player.position} - {team?.name || 'N/A'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPlayer(player)} className="text-navy-900 hover:text-navy-700 p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { removeAdminPlayer(player.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleSponsorSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingSponsorId ? 'Modifier le Sponsor' : 'Ajouter un Sponsor'}</h2>
                {editingSponsorId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSponsorId(null);
                      setSponsorForm({ name: '', logo: '', category: 'Silver', description: '', benefits: '' });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input required value={sponsorForm.name} onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })} placeholder="Nom sponsor" className="w-full border rounded-lg p-3" />
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Logo du sponsor</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-crimson-500 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Choisir un logo</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setSponsorForm({ ...sponsorForm, logo: base64 }))} className="hidden" />
                  </label>
                  {sponsorForm.logo && (
                    <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 flex-shrink-0 p-2">
                      <img src={sponsorForm.logo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <textarea required value={sponsorForm.description} onChange={(e) => setSponsorForm({ ...sponsorForm, description: e.target.value })} placeholder="Description" className="w-full border rounded-lg p-3 min-h-24" />
              <input value={sponsorForm.benefits} onChange={(e) => setSponsorForm({ ...sponsorForm, benefits: e.target.value })} placeholder="Bénéfices séparés par virgule" className="w-full border rounded-lg p-3" />
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-5 py-3 rounded-lg">
                {editingSponsorId ? 'Mettre à jour' : 'Ajouter sponsor'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-black text-navy-900 mb-4">Sponsors ajoutés ({sponsorItems.length})</h3>
              <div className="space-y-3 max-h-[520px] overflow-auto">
                {sponsorItems.map((sponsor) => (
                  <div key={sponsor.id} className="border rounded-lg p-3 flex justify-between items-center gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-navy-900">{sponsor.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSponsor(sponsor)} className="text-navy-900 hover:text-navy-700 p-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { removeAdminSponsor(sponsor.id); reloadAdminData(); }} className="text-red-600 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tickets' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <form onSubmit={handleTicketSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-navy-900">{editingTicketId ? 'Modifier Ticket' : 'Créer un Ticket'}</h2>
                {editingTicketId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTicketId(null);
                      setTicketForm({ name: '', price: '', description: '', type: 'season', date: '', venue: '', inStock: true });
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <input required value={ticketForm.name} onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })} placeholder="Nom (Ex: Season Pass VIP)" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600" />
              <textarea value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} placeholder="Description & Inclus..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600 min-h-[100px]" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" value={ticketForm.price} onChange={(e) => setTicketForm({ ...ticketForm, price: e.target.value })} placeholder="Prix (FCFA)" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600" />
                <select value={ticketForm.type} onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as 'season' | 'game' })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600">
                  <option value="season">Pass Saison</option>
                  <option value="game">Billet de Match</option>
                </select>
              </div>
              {ticketForm.type === 'game' && (
                <div className="grid grid-cols-2 gap-4">
                  <input value={ticketForm.date} onChange={(e) => setTicketForm({ ...ticketForm, date: e.target.value })} placeholder="Date (ex: 25 Oct 2024)" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600" />
                  <input value={ticketForm.venue} onChange={(e) => setTicketForm({ ...ticketForm, venue: e.target.value })} placeholder="Lieu (ex: Dakar Arena)" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-crimson-600 focus:ring-1 focus:ring-crimson-600" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ticketInStock" checked={ticketForm.inStock} onChange={(e) => setTicketForm({ ...ticketForm, inStock: e.target.checked })} />
                <label htmlFor="ticketInStock" className="text-sm font-medium text-gray-700">En vente (Disponible)</label>
              </div>
              <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {editingTicketId ? 'Mettre à jour' : 'Créer'}
              </button>
            </form>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50"><h2 className="font-bold text-navy-900">Tickets Actifs</h2></div>
              <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {ticketItems.map((ticket) => (
                  <li key={ticket.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy-900">{ticket.name} <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider ml-2">{ticket.type}</span></p>
                      <p className="text-sm text-gray-500 mt-1 font-bold text-crimson-600">{ticket.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditTicket(ticket)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if (window.confirm('Sur ?')) { removeAdminTicket(ticket.id); reloadAdminData(); setFeedback({type: 'success', text: 'Ticket supprime.'}); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
                {ticketItems.length === 0 && <p className="text-gray-500 text-center py-6 text-sm">Aucun ticket.</p>}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
