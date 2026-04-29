import React, { useState, useEffect } from 'react';
import { getManagedGames, getManagedProducts, getManagedNewsArticles, getManagedPlayers, getManagedTeams, getManagedSponsors, getAdminTickets, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import { motion, AnimatePresence } from 'framer-motion';

type ChatMessage = { from: 'user' | 'bot'; text: string; type?: 'text' | 'ticket' | 'product'; data?: any };

const getBotResponse = (question: string): ChatMessage => {
  const q = question.toLowerCase();
  const dbGames = getManagedGames();
  const dbProducts = getManagedProducts();
  const dbNews = getManagedNewsArticles();
  const dbPlayers = getManagedPlayers();
  const dbTeams = getManagedTeams();
  const dbSponsors = getManagedSponsors();
  const dbTickets = getAdminTickets();

  // 1. Recherche dynamique : Équipe
  const matchedTeam = dbTeams.find(t => q.includes(t.name.toLowerCase()) || q.includes(t.abbreviation.toLowerCase()));
  if (matchedTeam && !q.includes('match') && !q.includes('joueur')) {
    return {
      from: 'bot',
      text: `🏀 Équipe : ${matchedTeam.name} (${matchedTeam.abbreviation})\n- Conférence : ${matchedTeam.conference}\n- Bilan : ${matchedTeam.record}\n- Classement : ${matchedTeam.standing}e\n- Mascotte : ${matchedTeam.mascot}`,
      type: 'text'
    };
  }

  // 2. Recherche dynamique : Joueur
  const matchedPlayer = dbPlayers.find(p => q.includes(p.name.toLowerCase()));
  if (matchedPlayer) {
    const teamName = dbTeams.find(t => t.id === matchedPlayer.team)?.name || 'Inconnue';
    return {
      from: 'bot',
      text: `⛹️ Joueur : ${matchedPlayer.name} (${matchedPlayer.position})\n- Équipe : ${teamName}\n- Points (PPG) : ${matchedPlayer.stats.ppg}\n- Rebonds (RPG) : ${matchedPlayer.stats.rpg}\n- Passes (APG) : ${matchedPlayer.stats.apg}\n- Taille : ${matchedPlayer.height}`,
      type: 'text'
    };
  }

  // 3. Recherche dynamique : Sponsor
  const matchedSponsor = dbSponsors.find(s => q.includes(s.name.toLowerCase()));
  if (matchedSponsor) {
    return {
      from: 'bot',
      text: `🤝 Sponsor : ${matchedSponsor.name} (${matchedSponsor.category})\n- Description : ${matchedSponsor.description}\n- Avantages : ${matchedSponsor.benefits.join(', ')}`,
      type: 'text'
    };
  }

  // 4. Recherche dynamique : Produit Spécifique
  const matchedProduct = dbProducts.find(p => q.includes(p.name.toLowerCase()));
  if (matchedProduct && (q.includes('acheter') || q.includes('prix') || q.includes('combien'))) {
    return {
      from: 'bot',
      text: `🛍️ Produit : ${matchedProduct.name}\n- Prix : ${matchedProduct.price.toLocaleString('fr-FR')} FCFA\n- Catégorie : ${matchedProduct.category}\nClique sur "Ajouter au panier" pour l'acheter.`,
      type: 'product',
      data: matchedProduct,
    };
  }

  // 5. Mots-clés : Tickets & Billets
  if (q.includes('ticket') || q.includes('billet')) {
    if (dbTickets.length > 0) {
      const ticket = dbTickets[0];
      return {
        from: 'bot',
        text: `🎟️ Ticket disponible : ${ticket.name}\n- Prix : ${ticket.price.toLocaleString('fr-FR')} FCFA\n- Type : ${ticket.type === 'season' ? 'Pass Saison' : 'Billet Match'}\nPour acheter, visite la page Tickets.`,
        type: 'text'
      };
    } else {
      const upcoming = dbGames.filter(g => !g.isCompleted);
      if (upcoming.length === 0) return { from: 'bot', text: "Il n'y a pas de tickets ou de matchs à venir actuellement.", type: 'text' };
      return {
        from: 'bot',
        text: `🎟️ Prochain match disponible :\n${upcoming[0].homeTeam.name} vs ${upcoming[0].awayTeam.name} le ${upcoming[0].date}.`,
        type: 'ticket',
        data: upcoming[0],
      };
    }
  }

  // 6. Mots-clés : Matchs à venir
  if (q.includes('match') && (q.includes('venir') || q.includes('prochain') || q.includes('quand'))) {
    const upcoming = dbGames.filter(g => !g.isCompleted);
    if (upcoming.length === 0) return { from: 'bot', text: "Il n'y a pas de matchs à venir.", type: 'text' };
    return {
      from: 'bot',
      text: '📅 Prochains matchs :\n' + upcoming.slice(0, 3).map(g => `- ${g.homeTeam.name} vs ${g.awayTeam.name} le ${g.date} à ${g.time}`).join('\n'),
      type: 'text',
    };
  }

  // 7. Mots-clés : Matchs terminés / Résultats
  if (q.includes('score') || q.includes('resultat') || (q.includes('match') && q.includes('fini'))) {
    const completed = dbGames.filter(g => g.isCompleted);
    if (completed.length === 0) return { from: 'bot', text: "Aucun résultat de match disponible.", type: 'text' };
    return {
      from: 'bot',
      text: '🏆 Derniers résultats :\n' + completed.slice(0, 3).map(g => `- ${g.homeTeam.name} ${g.homeScore} - ${g.awayScore} ${g.awayTeam.name}`).join('\n'),
      type: 'text',
    };
  }

  // 8. Mots-clés : Boutique générale
  if (q.includes('produit') || q.includes('shop') || q.includes('boutique') || q.includes('maillot') || q.includes('short')) {
    if (dbProducts.length === 0) return { from: 'bot', text: "La boutique est vide pour le moment.", type: 'text' };
    return {
      from: 'bot',
      text: '🛍️ Voici quelques produits disponibles :\n' + dbProducts.slice(0, 5).map(p => `- ${p.name} (${p.price.toLocaleString('fr-FR')} FCFA)`).join('\n'),
      type: 'text',
    };
  }

  // 9. Mots-clés : Actualités générales
  if (q.includes('news') || q.includes('actualité') || q.includes('article')) {
    if (dbNews.length === 0) return { from: 'bot', text: "Il n'y a aucune actualité pour le moment.", type: 'text' };
    return {
      from: 'bot',
      text: '📰 Dernières actualités :\n' + dbNews.slice(0, 3).map(n => `- ${n.title}`).join('\n'),
      type: 'text',
    };
  }
  
  // 10. Mots-clés : Sponsors généraux
  if (q.includes('sponsor') || q.includes('partenaire')) {
    if (dbSponsors.length === 0) return { from: 'bot', text: "Nous n'avons pas encore de sponsors enregistrés.", type: 'text' };
    return {
      from: 'bot',
      text: '🤝 Nos partenaires :\n' + dbSponsors.map(s => `- ${s.name} (${s.category})`).join('\n'),
      type: 'text',
    };
  }

  // Fallback global
  return { 
    from: 'bot', 
    text: "Je parcours la base de données de la ligue ! Pose-moi une question sur :\n- Un joueur précis (ex: 'stats de Diallo')\n- Une équipe (ex: 'infos UCAO')\n- Les matchs (ex: 'résultats', 'prochain match')\n- Les tickets, sponsors, ou la boutique.", 
    type: 'text' 
  };
};

const generateSystemContext = () => {
  const teams = getManagedTeams().map(t => `${t.name} (${t.abbreviation}) - Bilan: ${t.record}, Conférence: ${t.conference}`).join('\n');
  const players = getManagedPlayers().map(p => `${p.name} (${p.position}) - Equipe: ${getManagedTeams().find(t=>t.id===p.team)?.name}, Stats: ${p.stats.ppg} PPG, ${p.stats.rpg} RPG`).join('\n');
  const games = getManagedGames().map(g => `${g.homeTeam.name} vs ${g.awayTeam.name} - Date: ${g.date} à ${g.time} (${g.venue}) - Statut: ${g.status} - Score: ${g.homeScore}-${g.awayScore}`).join('\n');
  const products = getManagedProducts().map(p => `${p.name} - Prix: ${p.price} FCFA - Catégorie: ${p.category}`).join('\n');
  const tickets = getAdminTickets().map(t => `${t.name} - ${t.price} FCFA`).join('\n');
  const news = getManagedNewsArticles().map(n => `${n.title} (${n.date}) - ${n.category}`).join('\n');
  const sponsors = getManagedSponsors().map(s => `${s.name} (${s.category}) - ${s.description}`).join('\n');
  
  return `Tu es BUL Assistant, l'IA experte de la ligue de basketball BUL (Basketball University League).
Tu dois répondre aux questions de l'utilisateur avec précision en utilisant UNIQUEMENT les données suivantes:

ÉQUIPES:
${teams}

JOUEURS:
${players}

MATCHS:
${games}

BOUTIQUE & BILLETS:
${products}
${tickets}

ACTUALITÉS:
${news}

SPONSORS & PARTENAIRES:
${sponsors}

Règles:
1. Sois concis, professionnel et utilise des emojis.
2. Tu as l'interdiction formelle de répondre à des questions générales (recettes, culture générale, autres sports, etc.).
3. Réponds UNIQUEMENT aux questions concernant la Basketball University League (BUL) en te basant sur les données fournies.
4. Si la question sort du cadre de la ligue ou si tu n'as pas l'information, réponds poliment : "Désolé, en tant qu'assistant officiel de la BUL, je ne peux répondre qu'aux questions concernant la ligue."
5. Si l'utilisateur veut acheter, dis-lui de se rendre sur la page correspondante du site.`;
};

const callLLM = async (userMessage: string, openAiKey?: string, geminiKey?: string, groqKey?: string): Promise<string> => {
  const context = generateSystemContext();

  if (groqKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || "Erreur Groq inconnue");
    return data.choices[0].message.content;
  }

  if (openAiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  } 
  
  if (geminiKey) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: context }] },
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  }

  // 4. Si aucune clé locale n'est trouvée, on tente d'appeler la Supabase Edge Function sécurisée
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey
        },
        body: JSON.stringify({
          message: userMessage,
          context: context
        })
      });
      const data = await res.json();
      if (data.text) return data.text;
      if (data.error) throw new Error(data.error);
    } catch (e: any) {
      // En cas d'échec du serveur Edge Function, on laisse l'erreur remonter pour le moteur local
      console.warn("Échec Supabase Edge Function:", e.message);
    }
  }

  throw new Error("Clé API manquante ou serveur inaccessible");
};

const messageVariants = {
  hidden: { opacity: 0, y: 30, rotateY: 30 },
  visible: { opacity: 1, y: 0, rotateY: 0, transition: { type: "spring" as const, stiffness: 120, damping: 12 } },
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: 'Bonjour ! Je suis BUL Assistant, l’assistant IA du site. Pose-moi une question sur les matchs, la boutique, les tickets, etc.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [ticketBought, setTicketBought] = useState(false);

  useEffect(() => {
    // Sync cart with localStorage
    localStorage.setItem('chatbot_cart', JSON.stringify(cart));
  }, [cart]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { from: 'user', text: input, type: 'text' };
    setMessages((msgs: ChatMessage[]) => [...msgs, userMsg]);
    const currentInput = input;
    setInput('');
    setTicketBought(false);
    setIsLoading(true);

    try {
      const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;

      // On tente toujours l'appel au LLM. callLLM va gérer les clés locales OU la Supabase Edge Function
      const responseText = await callLLM(currentInput, openAiKey, geminiKey, groqKey);
      setMessages((msgs: ChatMessage[]) => [...msgs, { from: 'bot', text: responseText, type: 'text' }]);
    } catch (error: any) {
      console.error("Erreur API IA, basculement sur le moteur local :", error);
      const botMsg = getBotResponse(currentInput);
      setMessages((msgs: ChatMessage[]) => [...msgs, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = (match: any) => {
    setMessages(msgs => [...msgs, { from: 'bot', text: `Ticket acheté pour ${match.homeTeam.name} vs ${match.awayTeam.name} ! Un QR code te sera envoyé par email.`, type: 'text' }]);
    setTicketBought(true);
  };

  const handleAddToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    setMessages(msgs => [...msgs, { from: 'bot', text: `${product.name} ajouté au panier !`, type: 'text' }]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-6 px-2 sm:px-4 relative overflow-hidden">
      <motion.div
        className="fixed inset-0 z-0 bg-navy-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute w-[150vw] h-[150vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, #dc2626 90deg, transparent 180deg, #eab308 270deg, transparent 360deg)',
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </motion.div>
      <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl p-3 sm:p-6 flex flex-col h-[calc(100vh-8rem)] sm:h-[75vh] z-10 backdrop-blur-md border border-white/50">
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 mb-3 sm:mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">BUL Assistant</h1>
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={messageVariants}
              >
                {msg.type === 'ticket' && msg.data && !ticketBought ? (
                  <motion.div
                    whileHover={{ scale: 1.04, rotateY: 5 }}
                    className="bg-navy-900 border border-crimson-600 shadow-2xl rounded-2xl p-4 max-w-[80%] flex flex-col items-start text-white"
                    style={{ perspective: 600 }}
                  >
                    <div className="font-bold text-lg mb-1 text-gold-500">{msg.data.homeTeam.name} vs {msg.data.awayTeam.name}</div>
                    <div className="text-sm mb-3 text-gray-300">{msg.data.date} à {msg.data.time} - {msg.data.venue}</div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-crimson-600 hover:bg-crimson-700 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs shadow transition-colors"
                      onClick={() => handleBuyTicket(msg.data)}
                    >
                      Acheter un ticket
                    </motion.button>
                  </motion.div>
                ) : msg.type === 'product' && msg.data ? (
                  <motion.div
                    whileHover={{ scale: 1.04, rotateY: -5 }}
                    className="bg-white border-2 border-gold-500 shadow-2xl rounded-2xl p-4 max-w-[80%] flex flex-col items-start text-navy-900"
                    style={{ perspective: 600 }}
                  >
                    <div className="font-black text-lg mb-1 uppercase tracking-tight">{msg.data.name}</div>
                    <div className="text-sm font-bold text-gray-500 mb-3">Prix : <span className="text-crimson-600">{msg.data.price.toLocaleString('fr-FR')} FCFA</span></div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-navy-900 hover:bg-gold-500 hover:text-navy-900 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs shadow transition-colors"
                      onClick={() => handleAddToCart(msg.data)}
                    >
                      Ajouter au panier
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: msg.from === 'user' ? -2 : 2 }}
                    className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm text-sm sm:text-base ${msg.from === 'user' ? 'bg-crimson-600 text-white rounded-br-sm' : 'bg-gray-50 text-navy-900 border border-gray-200 rounded-bl-sm'}`}
                    style={{ perspective: 600 }}
                  >
                    {msg.text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-4 shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pose ta question..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-crimson-600 shadow-sm text-sm sm:text-base bg-gray-50"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="bg-navy-900 hover:bg-crimson-600 text-white px-5 sm:px-8 py-3 rounded-xl font-black shadow-sm transition-colors flex items-center justify-center uppercase tracking-widest text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Envoyer</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage; 