import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftOpen,
  PanelLeftClose,
  SquarePen,
  Trash2,
  Pencil,
  Check,
  X,
  MessageSquareDashed,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  Sun,
  Moon,
  ChevronLeft,
  Bot,
  ShoppingCart,
  Ticket,
  Paperclip,
  StopCircle,
  MessageSquare,
  Plus,
  Users,
  CalendarDays,
  ShoppingBag,
  TicketCheck,
  Newspaper,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import {
  getManagedGames,
  getManagedProducts,
  getManagedNewsArticles,
  getManagedPlayers,
  getManagedTeams,
  getManagedSponsors,
  getAdminTickets,
} from '../data/adminContent';

// ─── Types ─────────────────────────────────────────────────────────────────

type MessageRole = 'user' | 'assistant';
type MessageKind = 'text' | 'ticket' | 'product';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  kind?: MessageKind;
  payload?: any;
  createdAt: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

// ─── Suggestion prompts ────────────────────────────────────────────────────

const SUGGESTIONS = [
  {
    Icon: Users,
    heading: 'Infos sur les équipes',
    body: "Quelles sont les informations sur l'équipe ESP ?",
  },
  {
    Icon: CalendarDays,
    heading: 'Calendrier & résultats',
    body: 'Donne-moi les derniers scores et résultats des matchs',
  },
  {
    Icon: ShoppingBag,
    heading: 'Boutique officielle',
    body: 'Quels produits sont en vente dans la boutique ?',
  },
  {
    Icon: TicketCheck,
    heading: 'Acheter des billets',
    body: 'Quels sont les tickets de match disponibles ?',
  },
];

// ─── Data / AI layer ───────────────────────────────────────────────────────

function buildSystemContext(): string {
  const teams   = getManagedTeams().map(t => `${t.name} (${t.abbreviation}) — Bilan: ${t.record}, Conf: ${t.conference}`).join('\n');
  const players = getManagedPlayers().map(p => {
    const teamName = getManagedTeams().find(t => t.id === p.team)?.name ?? '?';
    return `${p.name} (${p.position}) — Équipe: ${teamName}, PPG: ${p.stats.ppg}, RPG: ${p.stats.rpg}`;
  }).join('\n');
  const games    = getManagedGames().map(g => `${g.homeTeam.name} vs ${g.awayTeam.name} — ${g.date} ${g.time} (${g.venue}) — ${g.status} — ${g.homeScore ?? '?'}-${g.awayScore ?? '?'}`).join('\n');
  const products = getManagedProducts().map(p => `${p.name} — ${p.price} FCFA — ${p.category}`).join('\n');
  const tickets  = getAdminTickets().map(t => `${t.name} — ${t.price} FCFA`).join('\n');
  const news     = getManagedNewsArticles().map(n => `${n.title} (${n.date}) — ${n.category}`).join('\n');
  const sponsors = getManagedSponsors().map(s => `${s.name} (${s.category}) — ${s.description}`).join('\n');

  return `Tu es BUL Assistant, l'assistant IA officiel de la Basketball University League (BUL).
Réponds en français, de façon concise et professionnelle. Utilise des emojis avec modération.
Tu dois UNIQUEMENT répondre aux questions concernant la ligue BUL en utilisant les données ci-dessous.
Si la question est hors-sujet, réponds: "En tant qu'assistant officiel BUL, je ne réponds qu'aux questions sur la ligue."

ÉQUIPES:\n${teams}
JOUEURS:\n${players}
MATCHS:\n${games}
BOUTIQUE:\n${products}
BILLETS:\n${tickets}
ACTUALITÉS:\n${news}
SPONSORS:\n${sponsors}`;
}

function localFallback(question: string): Omit<ChatMessage, 'id' | 'createdAt'> {
  const q   = question.toLowerCase();
  const teams    = getManagedTeams();
  const players  = getManagedPlayers();
  const games    = getManagedGames();
  const products = getManagedProducts();
  const sponsors = getManagedSponsors();
  const news     = getManagedNewsArticles();
  const tickets  = getAdminTickets();

  const matchedTeam = teams.find(t => q.includes(t.name.toLowerCase()) || q.includes(t.abbreviation.toLowerCase()));
  if (matchedTeam && !q.includes('match') && !q.includes('joueur')) {
    return {
      role: 'assistant', kind: 'text',
      content: `**${matchedTeam.name}** (${matchedTeam.abbreviation})\n- Conférence : ${matchedTeam.conference}\n- Bilan : ${matchedTeam.record}\n- Classement : ${matchedTeam.standing}e\n- Mascotte : ${matchedTeam.mascot}`,
    };
  }

  const matchedPlayer = players.find(p => q.includes(p.name.toLowerCase()));
  if (matchedPlayer) {
    const teamName = teams.find(t => t.id === matchedPlayer.team)?.name ?? '?';
    return {
      role: 'assistant', kind: 'text',
      content: `**${matchedPlayer.name}** (${matchedPlayer.position})\n- Équipe : ${teamName}\n- PPG : ${matchedPlayer.stats.ppg} · RPG : ${matchedPlayer.stats.rpg} · APG : ${matchedPlayer.stats.apg}\n- Taille : ${matchedPlayer.height}`,
    };
  }

  const matchedSponsor = sponsors.find(s => q.includes(s.name.toLowerCase()));
  if (matchedSponsor) {
    return {
      role: 'assistant', kind: 'text',
      content: `**${matchedSponsor.name}** (${matchedSponsor.category})\n${matchedSponsor.description}`,
    };
  }

  if (q.includes('ticket') || q.includes('billet')) {
    if (tickets.length > 0) {
      const t = tickets[0];
      return { role: 'assistant', kind: 'text', content: `🎟️ **${t.name}** — ${t.price.toLocaleString('fr-FR')} FCFA\nType : ${t.type === 'season' ? 'Pass Saison' : 'Billet Match'}` };
    }
    const upcoming = games.filter(g => !g.isCompleted);
    if (upcoming.length === 0) return { role: 'assistant', kind: 'text', content: "Aucun match à venir pour l'instant." };
    return { role: 'assistant', kind: 'ticket', content: `Prochain match disponible :`, payload: upcoming[0] };
  }

  if (q.includes('match') && (q.includes('venir') || q.includes('prochain') || q.includes('quand'))) {
    const upcoming = games.filter(g => !g.isCompleted).slice(0, 3);
    if (upcoming.length === 0) return { role: 'assistant', kind: 'text', content: "Aucun match à venir." };
    return {
      role: 'assistant', kind: 'text',
      content: '**Prochains matchs :**\n' + upcoming.map(g => `- **${g.homeTeam.name}** vs **${g.awayTeam.name}** — ${g.date} à ${g.time}`).join('\n'),
    };
  }

  if (q.includes('score') || q.includes('résultat') || q.includes('resultat')) {
    const done = games.filter(g => g.isCompleted).slice(0, 3);
    if (done.length === 0) return { role: 'assistant', kind: 'text', content: "Aucun résultat disponible." };
    return {
      role: 'assistant', kind: 'text',
      content: '**Derniers résultats :**\n' + done.map(g => `- **${g.homeTeam.name}** ${g.homeScore} – ${g.awayScore} **${g.awayTeam.name}**`).join('\n'),
    };
  }

  if (q.includes('produit') || q.includes('shop') || q.includes('boutique') || q.includes('maillot')) {
    if (products.length === 0) return { role: 'assistant', kind: 'text', content: "La boutique est vide pour l'instant." };
    const matchedProduct = products.find(p => q.includes(p.name.toLowerCase()));
    if (matchedProduct) return { role: 'assistant', kind: 'product', content: 'Voici le produit :', payload: matchedProduct };
    return {
      role: 'assistant', kind: 'text',
      content: '**Boutique officielle :**\n' + products.slice(0, 5).map(p => `- **${p.name}** — ${p.price.toLocaleString('fr-FR')} FCFA`).join('\n'),
    };
  }

  if (q.includes('news') || q.includes('actualité') || q.includes('article')) {
    if (news.length === 0) return { role: 'assistant', kind: 'text', content: "Aucune actualité pour l'instant." };
    return {
      role: 'assistant', kind: 'text',
      content: '**Dernières actualités :**\n' + news.slice(0, 3).map(n => `- **${n.title}** — ${n.category}`).join('\n'),
    };
  }

  if (q.includes('sponsor') || q.includes('partenaire')) {
    if (sponsors.length === 0) return { role: 'assistant', kind: 'text', content: "Aucun sponsor enregistré." };
    return {
      role: 'assistant', kind: 'text',
      content: '**Partenaires officiels :**\n' + sponsors.map(s => `- **${s.name}** — ${s.category}`).join('\n'),
    };
  }

  return {
    role: 'assistant', kind: 'text',
    content: "Je suis BUL Assistant 🏀 Posez-moi une question sur :\n- Les **équipes** et **joueurs**\n- Le **calendrier** ou les **résultats**\n- Les **tickets**, la **boutique** ou les **sponsors**",
  };
}

async function callAI(userMessage: string): Promise<string> {
  const ctx         = buildSystemContext();
  const groqKey     = import.meta.env.VITE_GROQ_API_KEY;
  const openAiKey   = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey   = import.meta.env.VITE_GEMINI_API_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 1 — Groq (fastest)
  if (groqKey) {
    try {
      const res  = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: ctx }, { role: 'user', content: userMessage }] }),
      });
      const json = await res.json();
      if (!json.error) return json.choices[0].message.content;
    } catch { /* fall through */ }
  }

  // 2 — OpenAI
  if (openAiKey) {
    try {
      const res  = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openAiKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: ctx }, { role: 'user', content: userMessage }] }),
      });
      const json = await res.json();
      if (!json.error) return json.choices[0].message.content;
    } catch { /* fall through */ }
  }

  // 3 — Gemini
  if (geminiKey) {
    try {
      const res  = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: ctx }] }, contents: [{ parts: [{ text: userMessage }] }] }),
      });
      const json = await res.json();
      if (!json.error) return json.candidates[0].content.parts[0].text;
    } catch { /* fall through */ }
  }

  // 4 — Supabase Edge Function
  if (supabaseUrl && supabaseKey) {
    try {
      const res  = await fetch(`${supabaseUrl}/functions/v1/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
        body: JSON.stringify({ message: userMessage, context: ctx }),
      });
      const json = await res.json();
      if (json.text) return json.text;
    } catch { /* fall through */ }
  }

  throw new Error('NO_API');
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const STORAGE_CONVOS = 'bul_convos_v2';
const STORAGE_ACTIVE = 'bul_active_v2';
const STORAGE_THEME  = 'bul_theme_v2';

function makeWelcome(): ChatMessage {
  return {
    id: uid(),
    role: 'assistant',
    kind: 'text',
    content: 'Bonjour ! Je suis **BUL Assistant**, votre guide officiel de la Basketball University League.\n\nPosez-moi une question sur les équipes, joueurs, matchs, billets ou la boutique.',
    createdAt: Date.now(),
  };
}

function makeConversation(): Conversation {
  return { id: uid(), title: 'Nouvelle discussion', messages: [makeWelcome()], createdAt: Date.now() };
}

// ─── Markdown renderer ─────────────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <div key={i} className="h-2" />;

    // Bold inline
    const parseBold = (raw: string): React.ReactNode[] =>
      raw.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j} className="font-semibold text-[--fg-primary]">{part.slice(2, -2)}</strong>
          : part
      );

    if (line.match(/^[-*•]\s/)) {
      return (
        <div key={i} className="flex gap-2 text-[--fg-secondary] text-sm leading-relaxed">
          <span className="mt-[3px] text-[--fg-tertiary] shrink-0">•</span>
          <span>{parseBold(line.replace(/^[-*•]\s/, ''))}</span>
        </div>
      );
    }
    if (line.match(/^\d+\.\s/)) {
      const [num, ...rest] = line.split(/\.\s/);
      return (
        <div key={i} className="flex gap-2 text-[--fg-secondary] text-sm leading-relaxed">
          <span className="mt-[3px] text-[--fg-tertiary] shrink-0 font-mono text-xs">{num}.</span>
          <span>{parseBold(rest.join('. '))}</span>
        </div>
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed text-[--fg-secondary]">
        {parseBold(line)}
      </p>
    );
  });
}

// ─── Component ─────────────────────────────────────────────────────────────

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();

  // ── State ──
  const [sidebarOpen, setSidebar]   = useState(true);
  const [convos, setConvos]         = useState<Conversation[]>([]);
  const [activeId, setActiveId]     = useState('');
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [editId, setEditId]         = useState<string | null>(null);
  const [editTitle, setEditTitle]   = useState('');
  const [copied, setCopied]         = useState<string | null>(null);
  const [liked, setLiked]           = useState<Record<string, 'up' | 'down' | null>>({});
  const [ticketDone, setTicketDone] = useState<Record<string, boolean>>({});
  const [userEmail, setUserEmail]   = useState<string | null>(null);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const abortRef   = useRef<boolean>(false);

  // ── Auth State ──
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);
      }
    };
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
      } else {
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Derived ──
  const activeConvo = convos.find(c => c.id === activeId);
  const messages    = activeConvo?.messages ?? [];

  // ── Boot ──
  useEffect(() => {
    let stored: Conversation[] = [];
    try { stored = JSON.parse(localStorage.getItem(STORAGE_CONVOS) ?? '[]'); } catch { /**/ }

    if (stored.length === 0) {
      const c = makeConversation();
      stored  = [c];
    }
    setConvos(stored);

    const storedActive = localStorage.getItem(STORAGE_ACTIVE);
    const valid = stored.find(c => c.id === storedActive);
    setActiveId(valid ? valid.id : stored[0].id);

    // Close sidebar on mobile by default
    if (window.innerWidth < 768) setSidebar(false);
  }, []);

  // ── Persist ──
  const persist = useCallback((updated: Conversation[]) => {
    setConvos(updated);
    localStorage.setItem(STORAGE_CONVOS, JSON.stringify(updated));
  }, []);

  // ── Scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Textarea auto-grow ──
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  // ── Keyboard shortcut Cmd+N ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); newConvo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [convos]);

  // ── Conversation actions ──
  const newConvo = useCallback(() => {
    const c = makeConversation();
    persist([c, ...convos]);
    setActiveId(c.id);
    localStorage.setItem(STORAGE_ACTIVE, c.id);
    if (window.innerWidth < 768) setSidebar(false);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [convos, persist]);

  const selectConvo = (id: string) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_ACTIVE, id);
    if (window.innerWidth < 768) setSidebar(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const deleteConvo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = convos.filter(c => c.id !== id);
    if (next.length === 0) { const c = makeConversation(); persist([c]); setActiveId(c.id); return; }
    persist(next);
    if (activeId === id) { setActiveId(next[0].id); localStorage.setItem(STORAGE_ACTIVE, next[0].id); }
  };

  const commitRename = (id: string) => {
    if (!editTitle.trim()) { setEditId(null); return; }
    persist(convos.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c));
    setEditId(null);
  };

  // ── Send ──
  const send = useCallback(async (text?: string) => {
    const raw = (text ?? input).trim();
    if (!raw || loading) return;
    abortRef.current = false;
    setInput('');

    const userMsg: ChatMessage = { id: uid(), role: 'user', kind: 'text', content: raw, createdAt: Date.now() };

    const autoTitle = (t: string) => t.slice(0, 30) + (t.length > 30 ? '…' : '');

    setConvos(prev => {
      const updated = prev.map(c => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          title: c.title === 'Nouvelle discussion' ? autoTitle(raw) : c.title,
          messages: [...c.messages, userMsg],
        };
      });
      localStorage.setItem(STORAGE_CONVOS, JSON.stringify(updated));
      return updated;
    });
    setLoading(true);

    let botMsg: ChatMessage;
    try {
      const reply = await callAI(raw);
      if (abortRef.current) return;
      botMsg = { id: uid(), role: 'assistant', kind: 'text', content: reply, createdAt: Date.now() };
    } catch {
      const fb = localFallback(raw);
      botMsg = { id: uid(), ...fb, createdAt: Date.now() };
    }

    setConvos(prev => {
      const updated = prev.map(c => {
        if (c.id !== activeId) return c;
        return { ...c, messages: [...c.messages, botMsg] };
      });
      localStorage.setItem(STORAGE_CONVOS, JSON.stringify(updated));
      return updated;
    });
    setLoading(false);
  }, [input, loading, activeId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // ── Copy ──
  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── CSS variables injected via class ──
  const cssVars: React.CSSProperties = {
    // Sidebar colors (Black, White text, Gold accents)
    '--bg-sidebar'          : '#000000',
    '--border-sidebar'      : 'rgba(212, 175, 55, 0.25)',
    '--bg-sidebar-hover'    : '#121212',
    '--bg-sidebar-active'   : '#1c1c1c',
    '--fg-sidebar-primary'  : '#ffffff',
    '--fg-sidebar-secondary': '#cccccc',
    '--fg-sidebar-tertiary' : '#888888',
    '--fg-sidebar-muted'    : '#555555',

    // Main panel colors (Light mode: White background, dark text, gold accents)
    '--bg-primary'    : '#ffffff',
    '--bg-surface'    : '#f8fafc',
    '--bg-input'      : '#ffffff',
    '--bg-hover'      : '#f1f5f9',
    '--bg-active'     : '#e2e8f0',
    '--bg-user-bubble': '#f1f5f9',
    '--border'        : 'rgba(0,0,0,0.08)',
    '--fg-primary'    : '#0f172a',
    '--fg-secondary'  : '#334155',
    '--fg-tertiary'   : '#64748b',
    '--fg-muted'      : '#94a3b8',
    '--accent'        : '#b08d28',
    '--accent-hover'  : '#93741f',
  } as React.CSSProperties;

  // Group conversations by age for sidebar sections
  const today     = convos.filter(c => Date.now() - c.createdAt < 86_400_000);
  const last7     = convos.filter(c => { const age = Date.now() - c.createdAt; return age >= 86_400_000 && age < 7 * 86_400_000; });
  const older     = convos.filter(c => Date.now() - c.createdAt >= 7 * 86_400_000);

  const isOnlyWelcome = messages.length <= 1;

  // ── Render ──
  return (
    <div
      style={{ ...cssVars, fontFamily: "'Inter', 'Söhne', ui-sans-serif, system-ui, sans-serif" } as React.CSSProperties}
      className="flex h-[100dvh] w-full overflow-hidden select-none"
      css-bg="bg-primary"
    >
      <style>{`
        [css-bg~="bg-primary"] { background: var(--bg-primary); color: var(--fg-primary); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        .sidebar-item { transition: background 0.1s ease; }
        .sidebar-item:hover { background: var(--bg-hover); }
        .sidebar-item.active { background: var(--bg-active); }
        .send-btn { transition: background 0.15s ease, transform 0.1s ease; }
        .send-btn:active { transform: scale(0.93); }

        /* Message actions: hidden on desktop until hover, always visible on mobile */
        .msg-action { opacity: 0; transition: opacity 0.15s ease; }
        .msg-row:hover .msg-action { opacity: 1; }
        @media (max-width: 767px) {
          .msg-action { opacity: 1; }
        }

        .suggestion-card { transition: background 0.15s ease, border-color 0.15s ease; }
        .suggestion-card:hover { border-color: var(--fg-muted) !important; background: var(--bg-hover); }
        .suggestion-card:active { transform: scale(0.98); }
        textarea { resize: none; }
        textarea:focus { outline: none; }

        /* Prevent double-tap zoom on buttons (mobile) */
        button, a { touch-action: manipulation; }

        /* Sidebar responsive transitions */
        .sidebar-desktop {
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.25s cubic-bezier(0.4,0,0.2,1),
                      visibility 0.25s;
          overflow: hidden;
        }
        .sidebar-desktop.open {
          width: 260px;
          opacity: 1;
          visibility: visible;
        }
        .sidebar-desktop.closed {
          width: 0;
          opacity: 0;
          visibility: hidden;
        }

        /* Safe area for iPhone notch & home bar */
        .input-safe {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
        .topbar-safe {
          padding-top: env(safe-area-inset-top, 0px);
        }
      `}</style>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebar(false)}
        />
      )}

      {/* ═══════════════════════════════════════
          SIDEBAR — Mobile: slide-in drawer | Desktop: collapsible panel
      ═══════════════════════════════════════ */}

      {/* MOBILE: Fixed drawer with slide animation */}
      <aside
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-sidebar)',
          width: 'min(260px, 85vw)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        className={`md:hidden flex flex-col h-[100dvh] shrink-0 z-40 fixed top-0 left-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Brand Identity */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-[--border-sidebar]">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md select-none"
              style={{ background: 'linear-gradient(135deg, #ffd700, #b08d28)' }}
            >
              B
            </div>
            <span 
              className="font-black text-xs tracking-wider uppercase select-none"
              style={{
                background: 'linear-gradient(to right, #ffd700, #b08d28)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BUL Assistant
            </span>
          </div>
          <button
            onClick={() => setSidebar(false)}
            title="Fermer le menu"
            className="p-1.5 rounded-lg text-[--fg-sidebar-secondary] hover:bg-[--bg-sidebar-hover] transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Primary Button */}
        <div className="px-3 pt-4 pb-2 shrink-0">
          <button
            onClick={newConvo}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[--border-sidebar] text-sm font-semibold hover:bg-[--bg-sidebar-hover] hover:border-[--accent] transition-all duration-200 group active:scale-[0.98]"
            style={{ color: 'var(--fg-sidebar-primary)' }}
          >
            <Plus className="w-4 h-4 text-[--accent] group-hover:scale-110 transition-transform duration-200" />
            <span>Nouvelle discussion</span>
          </button>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {[
            { label: "Aujourd'hui", items: today },
            { label: '7 derniers jours', items: last7 },
            { label: 'Plus ancien', items: older },
          ].map(group => group.items.length > 0 && (
            <div key={group.label}>
              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--fg-sidebar-tertiary)' }}>
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(c => {
                  const isActive = c.id === activeId;
                  const isEditing = c.id === editId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => !isEditing && selectConvo(c.id)}
                      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-[--bg-sidebar-active] border-l-2 border-[--accent] rounded-l-none pl-2 font-medium shadow-sm'
                          : 'hover:bg-[--bg-sidebar-hover]'
                      }`}
                    >
                      {/* Icon bubble */}
                      <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[--accent]' : 'text-[--fg-sidebar-tertiary] group-hover:text-[--fg-sidebar-primary]'}`} />

                      {isEditing ? (
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onBlur={() => commitRename(c.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitRename(c.id);
                            if (e.key === 'Escape') setEditId(null);
                          }}
                          onClick={e => e.stopPropagation()}
                          className="flex-1 min-w-0 text-sm bg-transparent border-b focus:outline-none"
                          style={{ color: 'var(--fg-sidebar-primary)', borderColor: 'var(--accent)' }}
                        />
                      ) : (
                        <span className="flex-1 truncate text-sm" style={{ color: isActive ? 'var(--fg-sidebar-primary)' : 'var(--fg-sidebar-secondary)' }}>
                          {c.title}
                        </span>
                      )}

                      {/* Hover actions */}
                      {!isEditing && (
                        <div 
                          className="absolute right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-0.5"
                          style={{ 
                            background: isActive ? 'var(--bg-sidebar-active)' : 'var(--bg-sidebar-hover)',
                            boxShadow: isActive ? 'none' : '-8px 0 8px -4px var(--bg-sidebar-hover)' 
                          }}
                        >
                          <button
                            onClick={e => { e.stopPropagation(); setEditId(c.id); setEditTitle(c.title); }}
                            className="p-1 rounded hover:bg-[--bg-sidebar-active] text-[--fg-sidebar-tertiary] hover:text-[--fg-sidebar-primary] transition-all duration-150"
                            title="Renommer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => deleteConvo(c.id, e)}
                            className="p-1 rounded hover:bg-[--bg-sidebar-active] text-[--fg-sidebar-tertiary] hover:text-[#ef4444] transition-all duration-150"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="shrink-0 px-3 pb-4 pt-3 border-t border-[--border-sidebar] bg-[--bg-sidebar]">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[--bg-sidebar-hover] text-[--fg-sidebar-secondary] hover:text-[--fg-sidebar-primary] transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4 text-[--fg-sidebar-tertiary]" />
              <span>Retour au site</span>
            </button>
            
            {/* User Profile Card */}
            <div 
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl border border-[--border-sidebar] text-sm font-medium select-none bg-[--bg-sidebar-hover]"
              style={{ color: 'var(--fg-sidebar-primary)' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black uppercase shadow-inner text-white select-none"
                style={{ background: 'linear-gradient(135deg, #ffd700, #b08d28)' }}
              >
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'B'}
              </div>
              <div className="flex flex-col min-w-0 flex-1 leading-tight select-none">
                <span className="truncate text-xs font-semibold" style={{ color: 'var(--fg-sidebar-primary)' }}>
                  {userEmail ? userEmail.split('@')[0] : 'BUL Fan'}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--fg-sidebar-tertiary)' }}>
                  {userEmail ? 'Membre connecté' : 'Visiteur'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* DESKTOP: Collapsible sidebar that shrinks to 0 width */}
      <aside
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: sidebarOpen ? '1px solid var(--border-sidebar)' : 'none',
        }}
        className={`hidden md:flex flex-col h-full shrink-0 z-40 sidebar-desktop ${
          sidebarOpen ? 'open' : 'closed'
        }`}
      >
        {/* Top Header: Brand Identity */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-[--border-sidebar]" style={{ minWidth: 260 }}>
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md select-none"
              style={{ background: 'linear-gradient(135deg, #ffd700, #b08d28)' }}
            >
              B
            </div>
            <span 
              className="font-black text-xs tracking-wider uppercase select-none"
              style={{
                background: 'linear-gradient(to right, #ffd700, #b08d28)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BUL Assistant
            </span>
          </div>
          <button
            onClick={() => setSidebar(false)}
            title="Fermer le menu"
            className="p-1.5 rounded-lg text-[--fg-sidebar-secondary] hover:bg-[--bg-sidebar-hover] transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Primary Button */}
        <div className="px-3 pt-4 pb-2 shrink-0" style={{ minWidth: 260 }}>
          <button
            onClick={newConvo}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[--border-sidebar] text-sm font-semibold hover:bg-[--bg-sidebar-hover] hover:border-[--accent] transition-all duration-200 group active:scale-[0.98]"
            style={{ color: 'var(--fg-sidebar-primary)' }}
          >
            <Plus className="w-4 h-4 text-[--accent] group-hover:scale-110 transition-transform duration-200" />
            <span>Nouvelle discussion</span>
          </button>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6" style={{ minWidth: 260 }}>
          {[
            { label: "Aujourd'hui", items: today },
            { label: '7 derniers jours', items: last7 },
            { label: 'Plus ancien', items: older },
          ].map(group => group.items.length > 0 && (
            <div key={group.label}>
              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--fg-sidebar-tertiary)' }}>
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(c => {
                  const isActive = c.id === activeId;
                  const isEditing = c.id === editId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => !isEditing && selectConvo(c.id)}
                      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-[--bg-sidebar-active] border-l-2 border-[--accent] rounded-l-none pl-2 font-medium shadow-sm'
                          : 'hover:bg-[--bg-sidebar-hover]'
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[--accent]' : 'text-[--fg-sidebar-tertiary] group-hover:text-[--fg-sidebar-primary]'}`} />

                      {isEditing ? (
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onBlur={() => commitRename(c.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitRename(c.id);
                            if (e.key === 'Escape') setEditId(null);
                          }}
                          onClick={e => e.stopPropagation()}
                          className="flex-1 min-w-0 text-sm bg-transparent border-b focus:outline-none"
                          style={{ color: 'var(--fg-sidebar-primary)', borderColor: 'var(--accent)' }}
                        />
                      ) : (
                        <span className="flex-1 truncate text-sm" style={{ color: isActive ? 'var(--fg-sidebar-primary)' : 'var(--fg-sidebar-secondary)' }}>
                          {c.title}
                        </span>
                      )}

                      {!isEditing && (
                        <div 
                          className="absolute right-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-0.5"
                          style={{ 
                            background: isActive ? 'var(--bg-sidebar-active)' : 'var(--bg-sidebar-hover)',
                            boxShadow: isActive ? 'none' : '-8px 0 8px -4px var(--bg-sidebar-hover)' 
                          }}
                        >
                          <button
                            onClick={e => { e.stopPropagation(); setEditId(c.id); setEditTitle(c.title); }}
                            className="p-1 rounded hover:bg-[--bg-sidebar-active] text-[--fg-sidebar-tertiary] hover:text-[--fg-sidebar-primary] transition-all duration-150"
                            title="Renommer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={e => deleteConvo(c.id, e)}
                            className="p-1 rounded hover:bg-[--bg-sidebar-active] text-[--fg-sidebar-tertiary] hover:text-[#ef4444] transition-all duration-150"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="shrink-0 px-3 pb-4 pt-3 border-t border-[--border-sidebar] bg-[--bg-sidebar]" style={{ minWidth: 260 }}>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-[--bg-sidebar-hover] text-[--fg-sidebar-secondary] hover:text-[--fg-sidebar-primary] transition-all duration-150"
            >
              <ChevronLeft className="w-4 h-4 text-[--fg-sidebar-tertiary]" />
              <span>Retour au site</span>
            </button>
            
            {/* User Profile Card */}
            <div 
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl border border-[--border-sidebar] text-sm font-medium select-none bg-[--bg-sidebar-hover]"
              style={{ color: 'var(--fg-sidebar-primary)' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black uppercase shadow-inner text-white select-none"
                style={{ background: 'linear-gradient(135deg, #ffd700, #b08d28)' }}
              >
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'B'}
              </div>
              <div className="flex flex-col min-w-0 flex-1 leading-tight select-none">
                <span className="truncate text-xs font-semibold" style={{ color: 'var(--fg-sidebar-primary)' }}>
                  {userEmail ? userEmail.split('@')[0] : 'BUL Fan'}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--fg-sidebar-tertiary)' }}>
                  {userEmail ? 'Membre connecté' : 'Visiteur'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN PANEL
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ background: 'var(--bg-primary)' }}>

        {/* ── Topbar ── */}
        <header
          className="topbar-safe flex items-center px-3 shrink-0"
          style={{
            borderBottom: '1px solid var(--border)',
            minHeight: 52,
          }}
        >
          {/* Open sidebar button — always shown when sidebar is closed */}
          <button
            onClick={() => setSidebar(true)}
            className={`p-2.5 rounded-xl sidebar-item mr-1 transition-all ${
              sidebarOpen ? 'md:hidden opacity-0 pointer-events-none w-0 p-0 mr-0 overflow-hidden' : 'opacity-100'
            }`}
            style={{ color: 'var(--fg-tertiary)' }}
            title="Ouvrir le menu"
            aria-label="Ouvrir le menu"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          {/* Logo + title */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-black text-[10px] shadow-sm select-none"
              style={{ background: 'linear-gradient(135deg, #ffd700, #b08d28)' }}
            >
              B
            </div>
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'var(--fg-secondary)' }}>
              BUL Assistant
            </span>
          </div>

          {/* New chat — always shown on mobile */}
          <button
            onClick={newConvo}
            className="p-2.5 rounded-xl sidebar-item"
            style={{ color: 'var(--fg-tertiary)' }}
            title="Nouveau chat"
            aria-label="Nouveau chat"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        </header>

        {/* ── Message feed ── */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'max(140px, calc(140px + env(safe-area-inset-bottom)))' }}>
          <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

            {/* Empty state / Splash */}
            {isOnlyWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center text-center pt-4 sm:pt-8 pb-6 sm:pb-10"
              >
                <h1 className="text-xl sm:text-2xl font-bold mb-1.5" style={{ color: 'var(--fg-primary)' }}>
                  Comment puis-je vous aider ?
                </h1>
                <p className="text-xs sm:text-sm mb-6 sm:mb-10 max-w-xs sm:max-w-sm" style={{ color: 'var(--fg-tertiary)' }}>
                  Assistant IA officiel de la Basketball University League
                </p>

                {/* Suggestion cards — always 2×2 on mobile too */}
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-lg text-left">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s.body)}
                      className="suggestion-card flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl border text-left group transition-all duration-200"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                    >
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(176,141,40,0.25))', border: '1px solid rgba(212,175,55,0.3)' }}
                      >
                        <s.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs sm:text-sm font-semibold leading-tight" style={{ color: 'var(--fg-primary)' }}>{s.heading}</span>
                        <span className="text-[10px] sm:text-xs leading-snug hidden sm:block" style={{ color: 'var(--fg-tertiary)' }}>{s.body}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence initial={false}>
              {messages.map(msg => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    className={`msg-row mb-6 flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >

                    <div className={`flex flex-col ${isUser ? 'items-end max-w-[80%]' : 'items-start flex-1 min-w-0'}`}>
                      {/* Bubble / content */}
                      {isUser ? (
                        <div
                          className="px-4 py-3 rounded-3xl text-sm leading-relaxed"
                          style={{ background: 'var(--bg-user-bubble)', color: 'var(--fg-primary)', maxWidth: '100%', wordBreak: 'break-word' }}
                        >
                          {msg.content}
                        </div>
                      ) : (
                        <div className="w-full">
                          {/* Ticket card */}
                          {msg.kind === 'ticket' && msg.payload && !ticketDone[msg.id] ? (
                            <div
                              className="rounded-2xl border p-5 max-w-sm mt-1"
                              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Ticket className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Billet de Match</span>
                              </div>
                              <p className="font-bold text-base mb-1" style={{ color: 'var(--fg-primary)' }}>
                                {msg.payload.homeTeam?.name} vs {msg.payload.awayTeam?.name}
                              </p>
                              <p className="text-xs mb-4" style={{ color: 'var(--fg-tertiary)' }}>
                                {msg.payload.date} à {msg.payload.time} · {msg.payload.venue}
                              </p>
                              <button
                                onClick={() => {
                                  setTicketDone(prev => ({ ...prev, [msg.id]: true }));
                                  const confirmMsg: ChatMessage = { id: uid(), role: 'assistant', kind: 'text', content: `✅ Ticket réservé pour **${msg.payload.homeTeam?.name} vs ${msg.payload.awayTeam?.name}** ! Un QR code vous sera envoyé par e-mail.`, createdAt: Date.now() };
                                  setConvos(prev => {
                                    const updated = prev.map(c => c.id !== activeId ? c : { ...c, messages: [...c.messages, confirmMsg] });
                                    localStorage.setItem(STORAGE_CONVOS, JSON.stringify(updated));
                                    return updated;
                                  });
                                }}
                                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white send-btn"
                                style={{ background: 'var(--accent)' }}
                              >
                                Réserver ce billet
                              </button>
                            </div>
                          ) : msg.kind === 'product' && msg.payload ? (
                            /* Product card */
                            <div
                              className="rounded-2xl border p-4 max-w-xs mt-1"
                              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                            >
                              {msg.payload.image && (
                                <div className="w-full h-32 rounded-xl mb-3 flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                                  <img src={msg.payload.image} alt={msg.payload.name} className="max-h-full object-contain" />
                                </div>
                              )}
                              <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--fg-primary)' }}>{msg.payload.name}</p>
                              <p className="text-sm font-bold mb-3" style={{ color: 'var(--accent)' }}>{msg.payload.price?.toLocaleString('fr-FR')} FCFA</p>
                              <button
                                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white send-btn flex items-center justify-center gap-2"
                                style={{ background: 'var(--accent)' }}
                                onClick={() => {
                                  const cart = JSON.parse(localStorage.getItem('bul_cart') ?? '[]');
                                  cart.push(msg.payload);
                                  localStorage.setItem('bul_cart', JSON.stringify(cart));
                                  const confirmMsg: ChatMessage = { id: uid(), role: 'assistant', kind: 'text', content: `🛍️ **${msg.payload.name}** ajouté au panier !`, createdAt: Date.now() };
                                  setConvos(prev => {
                                    const updated = prev.map(c => c.id !== activeId ? c : { ...c, messages: [...c.messages, confirmMsg] });
                                    localStorage.setItem(STORAGE_CONVOS, JSON.stringify(updated));
                                    return updated;
                                  });
                                }}
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Ajouter au panier
                              </button>
                            </div>
                          ) : (
                            /* Standard text */
                            <div className="space-y-1 pt-0.5">
                              {renderMarkdown(msg.content)}
                            </div>
                          )}

                          {/* Message actions */}
                          <div className="msg-action flex items-center gap-1 mt-2">
                            <button
                              onClick={() => copyText(msg.id, msg.content)}
                              className="p-1.5 rounded-lg sidebar-item"
                              style={{ color: 'var(--fg-muted)' }}
                              title="Copier"
                            >
                              {copied === msg.id
                                ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => setLiked(p => ({ ...p, [msg.id]: p[msg.id] === 'up' ? null : 'up' }))}
                              className="p-1.5 rounded-lg sidebar-item"
                              style={{ color: liked[msg.id] === 'up' ? 'var(--accent)' : 'var(--fg-muted)' }}
                              title="J'aime"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setLiked(p => ({ ...p, [msg.id]: p[msg.id] === 'down' ? null : 'down' }))}
                              className="p-1.5 rounded-lg sidebar-item"
                              style={{ color: liked[msg.id] === 'down' ? '#ef4444' : 'var(--fg-muted)' }}
                              title="Je n'aime pas"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 mb-6"
              >
                <div className="flex items-center gap-1 pt-2">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--fg-muted)' }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ── Input area ── */}
        <div
          className="input-safe absolute bottom-0 left-0 right-0 px-3 sm:px-4 pt-6"
          style={{ background: `linear-gradient(to top, var(--bg-primary) 70%, transparent)` }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="relative flex items-end gap-2 rounded-2xl px-3 py-2.5 shadow-sm"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.08)',
              }}
            >
              {/* Attach button (decorative) */}
              <button
                className="p-1.5 rounded-lg sidebar-item shrink-0 mb-0.5"
                style={{ color: 'var(--fg-muted)' }}
                title="Joindre un fichier"
                type="button"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envoyer un message…"
                className="flex-1 bg-transparent text-sm leading-relaxed py-1 max-h-52 overflow-y-auto"
                style={{
                  color: 'var(--fg-primary)',
                  caretColor: 'var(--accent)',
                  lineHeight: '1.6',
                }}
              />

              {/* Send / Stop */}
              {loading ? (
                <button
                  onClick={() => { abortRef.current = true; setLoading(false); }}
                  className="shrink-0 mb-0.5 p-1.5 rounded-lg sidebar-item"
                  style={{ color: 'var(--fg-tertiary)' }}
                  title="Arrêter"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="shrink-0 mb-0.5 w-8 h-8 rounded-full flex items-center justify-center send-btn"
                  style={{
                    background: input.trim() ? 'var(--fg-primary)' : 'var(--bg-hover)',
                    color: input.trim() ? 'var(--bg-primary)' : 'var(--fg-muted)',
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                  }}
                  title="Envoyer (Entrée)"
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[11px] mt-2.5" style={{ color: 'var(--fg-muted)' }}>
              BUL Assistant peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;