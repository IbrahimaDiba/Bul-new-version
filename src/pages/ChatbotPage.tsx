import React, { useState, useEffect } from 'react';
import { games as mockGames, products as mockProducts, newsArticles as mockNews } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

type ChatMessage = { from: 'user' | 'bot'; text: string; type?: 'text' | 'ticket' | 'product'; data?: any };

const getBotResponse = (question: string): ChatMessage => {
  const q = question.toLowerCase();
  // Ticket
  if ((q.includes('ticket') || q.includes('billet')) && (q.includes('acheter') || q.includes('buy'))) {
    // Chercher le prochain match
    const upcoming = mockGames.filter(g => !g.isCompleted);
    if (upcoming.length === 0) return { from: 'bot', text: "Il n'y a pas de matchs à venir.", type: 'text' };
    return {
      from: 'bot',
      text: `Prochain match : ${upcoming[0].homeTeam.name} vs ${upcoming[0].awayTeam.name} le ${upcoming[0].date} à ${upcoming[0].time} (${upcoming[0].venue})` + '\nClique sur "Acheter un ticket" pour réserver.',
      type: 'ticket',
      data: upcoming[0],
    };
  }
  // Produit
  if ((q.includes('acheter') || q.includes('add') || q.includes('panier')) && (q.includes('produit') || q.includes('maillot') || q.includes('short') || q.includes('t-shirt'))) {
    const prod = mockProducts[0];
    return {
      from: 'bot',
      text: `Produit : ${prod.name} (${prod.price.toLocaleString('fr-FR')} FCFA)\nClique sur "Ajouter au panier" pour l'ajouter.`,
      type: 'product',
      data: prod,
    };
  }
  // Matchs à venir
  if (q.includes('match') && (q.includes('venir') || q.includes('prochain') || q.includes('upcoming'))) {
    const upcoming = mockGames.filter(g => !g.isCompleted);
    if (upcoming.length === 0) return { from: 'bot', text: "Il n'y a pas de matchs à venir.", type: 'text' };
    return {
      from: 'bot',
      text: 'Matchs à venir :\n' + upcoming.map(g => `- ${g.homeTeam.name} vs ${g.awayTeam.name} le ${g.date} à ${g.time} (${g.venue})`).join('\n'),
      type: 'text',
    };
  }
  // Produits
  if (q.includes('produit') || q.includes('shop') || q.includes('boutique') || q.includes('maillot') || q.includes('short')) {
    return {
      from: 'bot',
      text: 'Voici quelques produits disponibles :\n' + mockProducts.slice(0, 5).map(p => `- ${p.name} (${p.price.toLocaleString('fr-FR')} FCFA)`).join('\n'),
      type: 'text',
    };
  }
  // News
  if (q.includes('news') || q.includes('actualité') || q.includes('article')) {
    return {
      from: 'bot',
      text: 'Dernières actualités :\n' + mockNews.slice(0, 3).map(n => `- ${n.title}`).join('\n'),
      type: 'text',
    };
  }
  // Aide générale
  if (q.includes('acheter') && q.includes('ticket')) {
    return { from: 'bot', text: "Pour acheter un ticket, va sur la page d'un match et clique sur 'Acheter un ticket'. Un QR code te sera généré après l'achat.", type: 'text' };
  }
  if (q.includes('panier') || q.includes('cart')) {
    return { from: 'bot', text: "Clique sur l'icône panier en haut à droite pour voir ou modifier ton panier.", type: 'text' };
  }
  // Fallback
  return { from: 'bot', text: "Je suis un assistant local et je peux répondre aux questions sur les matchs, produits, news, tickets, etc. Pose-moi une question précise !", type: 'text' };
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
  const [cart, setCart] = useState<any[]>([]);
  const [ticketBought, setTicketBought] = useState(false);

  useEffect(() => {
    // Sync cart with localStorage
    localStorage.setItem('chatbot_cart', JSON.stringify(cart));
  }, [cart]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = { from: 'user', text: input, type: 'text' };
    const botMsg: ChatMessage = getBotResponse(input);
    setMessages((msgs: ChatMessage[]) => [...msgs, userMsg, botMsg]);
    setInput('');
    setTicketBought(false);
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 relative overflow-hidden">
      {/* Animated 3D background */}
      <motion.div
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fbc2eb 100%)',
          filter: 'blur(0px)',
        }}
      >
        <motion.div
          className="absolute w-[120vw] h-[120vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          style={{
            background: 'radial-gradient(circle at 60% 40%, #a5b4fc 0%, #fbc2eb 100%)',
            opacity: 0.25,
            borderRadius: '50%',
          }}
        />
      </motion.div>
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-6 flex flex-col h-[70vh] z-10 backdrop-blur-md border border-white/30">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">BUL Assistant</h1>
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
                    className="bg-gradient-to-br from-blue-200 to-purple-100 border border-blue-300 shadow-2xl rounded-2xl p-4 max-w-[80%] flex flex-col items-start"
                    style={{ perspective: 600 }}
                  >
                    <div className="font-bold text-lg mb-1">{msg.data.homeTeam.name} vs {msg.data.awayTeam.name}</div>
                    <div className="text-sm mb-2">{msg.data.date} à {msg.data.time} - {msg.data.venue}</div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                      onClick={() => handleBuyTicket(msg.data)}
                    >
                      Acheter un ticket
                    </motion.button>
                  </motion.div>
                ) : msg.type === 'product' && msg.data ? (
                  <motion.div
                    whileHover={{ scale: 1.04, rotateY: -5 }}
                    className="bg-gradient-to-br from-pink-100 to-blue-100 border border-pink-200 shadow-2xl rounded-2xl p-4 max-w-[80%] flex flex-col items-start"
                    style={{ perspective: 600 }}
                  >
                    <div className="font-bold text-lg mb-1">{msg.data.name}</div>
                    <div className="text-sm mb-2">Prix : {msg.data.price.toLocaleString('fr-FR')} FCFA</div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                      onClick={() => handleAddToCart(msg.data)}
                    >
                      Ajouter au panier
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.04, rotateY: msg.from === 'user' ? -5 : 5 }}
                    className={`px-4 py-2 rounded-xl max-w-[80%] shadow-lg ${msg.from === 'user' ? 'bg-crimson-500 text-white' : 'bg-white text-navy-900 border border-navy-100'}`}
                    style={{ perspective: 600 }}
                  >
                    {msg.text.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pose ta question..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-crimson-500 shadow"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="bg-crimson-500 hover:bg-crimson-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Envoyer
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPage; 