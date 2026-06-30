import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle, User, Mail, Phone, CreditCard, X, ShieldCheck, Crown, ArrowRight, Info } from 'lucide-react';
import { getAdminTickets, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import { Ticket } from '../types';

// Only real data from Admin will be displayed

const TicketsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'season' | 'game'>('season');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const reload = () => {
      const adminTickets = getAdminTickets();
      setTickets(adminTickets);
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  // Auto-open modal if gameId is present in URL
  useEffect(() => {
    const gameId = searchParams.get('gameId');
    if (gameId && tickets.length > 0 && !showModal) {
      const ticketForGame = tickets.find(t => t.type === 'game' && t.gameId === gameId);
      if (ticketForGame) {
        setActiveTab('game');
        setSelectedTicket(ticketForGame);
        setCustomer({ name: '', email: '', phone: '' });
        setError(null);
        setPaymentMethod('wave');
        setShowModal(true);
        // Clear param so it doesn't reopen if closed
        setSearchParams({});
      }
    }
  }, [searchParams, tickets, showModal, setSearchParams]);

  const openModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCustomer({ name: '', email: '', phone: '' });
    setError(null);
    setPaymentMethod('wave');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setIsLoading(false);
    setError(null);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setError(null);
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      localStorage.setItem('pendingTicket', JSON.stringify({
        ticketId: selectedTicket.id,
        ticketName: selectedTicket.name,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        amount: selectedTicket.price,
        paymentMethod,
      }));

      const res = await fetch(`${supabaseUrl}/functions/v1/naboopay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          products: [{
            name: selectedTicket.name,
            price: selectedTicket.price,
            quantity: 1,
          }],
          success_url: window.location.origin.includes('localhost')
            ? 'http://localhost:5173/ticket-reussi'
            : `${window.location.origin}/ticket-reussi`,
          error_url: window.location.origin.includes('localhost')
            ? 'http://localhost:5173/ticket-echoue'
            : `${window.location.origin}/ticket-echoue`,
          method_of_payment: [paymentMethod],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || 'Impossible de créer la transaction.');
      }

      window.location.href = data.checkout_url;
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-24">
      {/* ── HERO SECTION IMMERSIVE ── */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Basketball Arena" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-white font-bold text-sm tracking-wide uppercase">
              <TicketIcon className="w-4 h-4 text-crimson-500" />
              Billetterie Officielle
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6 leading-[1.1]">
              Ne ratez <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-500 to-orange-500">aucune seconde</span> de l'action.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 font-medium max-w-xl">
              Réservez vos places maintenant. Que ce soit pour un match décisif ou pour toute la saison, sécurisez votre accès VIP.
            </p>
          </div>
          <div className="hidden lg:block relative w-72 h-72">
            <div className="absolute inset-0 bg-gradient-to-tr from-crimson-600 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <ShieldCheck className="w-full h-full text-white/10 relative z-10" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        {/* ── TABS CAPSULE ── */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-white p-1 sm:p-1.5 rounded-3xl sm:rounded-full shadow-xl shadow-navy-900/5 flex flex-col sm:flex-row items-stretch sm:items-center border border-gray-100 gap-1 sm:gap-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('season')}
              className={`px-4 sm:px-8 py-3 sm:py-3.5 rounded-2xl sm:rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${
                activeTab === 'season' 
                  ? 'bg-navy-900 text-white shadow-md transform scale-100 sm:scale-105' 
                  : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'
              }`}
            >
              Season Passes
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`px-4 sm:px-8 py-3 sm:py-3.5 rounded-2xl sm:rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${
                activeTab === 'game' 
                  ? 'bg-navy-900 text-white shadow-md transform scale-100 sm:scale-105' 
                  : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'
              }`}
            >
              Match par Match
            </button>
          </div>
        </div>

        {/* ── TICKETS GRID ── */}
        {tickets.filter(t => t.type === activeTab).length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-sm text-center border border-gray-100 mt-8">
            <TicketIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Aucun billet disponible</h3>
            <p className="text-gray-500">Revenez plus tard pour de nouveaux événements ou pass.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tickets.filter(t => t.type === activeTab).map(ticket => {
              const isVIP = ticket.name.toLowerCase().includes('vip');
            const isSoldOut = !ticket.inStock;

            return (
              <div 
                key={ticket.id} 
                className={`relative group rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isVIP 
                    ? 'bg-gradient-to-br from-gray-900 to-black text-white border border-yellow-500/30' 
                    : 'bg-white text-navy-900 border border-gray-200'
                } ${isSoldOut ? 'opacity-75 grayscale' : ''}`}
              >
                {/* Glow effect on hover */}
                {!isSoldOut && (
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isVIP ? 'bg-gradient-to-br from-yellow-500/10 to-transparent' : 'bg-gradient-to-br from-crimson-600/5 to-transparent'}`}></div>
                )}

                {/* Badges */}
                <div className="absolute top-6 right-6 flex gap-2">
                  {isVIP && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Crown className="w-3 h-3" /> VIP
                    </div>
                  )}
                  {isSoldOut && (
                    <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      Épuisé
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-10 flex flex-col h-full relative z-10">
                  <div className="mb-6 sm:mb-8">
                    <h3 className={`text-3xl font-black mb-4 tracking-tight ${isVIP ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 'text-navy-900'}`}>
                      {ticket.name}
                    </h3>
                    
                    {ticket.type === 'game' && (
                      <div className={`space-y-2 mb-6 text-sm font-medium ${isVIP ? 'text-gray-300' : 'text-gray-600'}`}>
                        {ticket.date && <p className="flex items-center gap-3"><Calendar className={`w-5 h-5 ${isVIP ? 'text-yellow-500' : 'text-crimson-600'}`} /> {ticket.date}</p>}
                        {ticket.venue && <p className="flex items-center gap-3"><MapPin className={`w-5 h-5 ${isVIP ? 'text-yellow-500' : 'text-crimson-600'}`} /> {ticket.venue}</p>}
                      </div>
                    )}
                    
                    {ticket.description && <p className={`text-sm leading-relaxed mb-6 ${isVIP ? 'text-gray-400' : 'text-gray-500'}`}>{ticket.description}</p>}
                    
                    {ticket.type === 'season' && (
                      <ul className="space-y-3 mb-6">
                        <li className={`flex items-center gap-3 text-sm font-medium ${isVIP ? 'text-gray-300' : 'text-gray-600'}`}>
                          <CheckCircle className={`w-5 h-5 ${isVIP ? 'text-yellow-500' : 'text-green-500'}`} /> 
                          Siège garanti à l'année
                        </li>
                        <li className={`flex items-center gap-3 text-sm font-medium ${isVIP ? 'text-gray-300' : 'text-gray-600'}`}>
                          <CheckCircle className={`w-5 h-5 ${isVIP ? 'text-yellow-500' : 'text-green-500'}`} /> 
                          Accès prioritaire Boutique
                        </li>
                        {isVIP && (
                          <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                            <Crown className="w-5 h-5 text-yellow-500" /> 
                            Rencontres privées & Lounge
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="mt-auto pt-6 sm:pt-8 border-t border-gray-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div>
                      <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${isVIP ? 'text-gray-400' : 'text-gray-500'}`}>Prix total</p>
                      <span className={`text-3xl sm:text-4xl font-black ${isVIP ? 'text-white' : 'text-navy-900'}`}>
                        {ticket.price.toLocaleString('fr-FR')} <span className="text-lg sm:text-xl font-bold">FCFA</span>
                      </span>
                    </div>
                    <button
                      disabled={isSoldOut}
                      onClick={() => openModal(ticket)}
                      className={`
                        w-full sm:w-auto group/btn relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all
                        ${isSoldOut ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                          isVIP 
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]' 
                            : 'bg-navy-900 hover:bg-crimson-600 text-white shadow-lg'
                        }
                      `}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSoldOut ? 'Épuisé' : 'Réserver'}
                        {!isSoldOut && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ── MODAL DE PAIEMENT PREMIUM (GLASSMORPHISM) ── */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Colonne Gauche : Résumé (Dark) */}
            <div className="md:w-5/12 bg-navy-900 p-6 sm:p-10 text-white flex flex-col relative overflow-hidden">
              {/* Bg Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
              
              <button onClick={closeModal} className="absolute top-6 left-6 text-white/50 hover:text-white md:hidden">
                <X className="w-6 h-6" />
              </button>

              <div className="mt-8 md:mt-0 relative z-10 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-6">
                  <TicketIcon className="w-3 h-3" /> Résumé Commande
                </div>
                
                <h3 className="text-3xl font-black mb-2">{selectedTicket.name}</h3>
                <p className="text-white/60 text-sm mb-8">{selectedTicket.description}</p>
                
                <div className="space-y-4 mb-8 text-sm font-medium text-white/80">
                  {selectedTicket.date && <p className="flex items-center gap-3"><Calendar className="w-5 h-5 text-white/40" /> {selectedTicket.date}</p>}
                  {selectedTicket.venue && <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-white/40" /> {selectedTicket.venue}</p>}
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-6 mt-auto">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-white/50">Total</span>
                  <span className="text-4xl font-black text-white">{selectedTicket.price.toLocaleString('fr-FR')} <span className="text-xl">FCFA</span></span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire (Light) */}
            <div className="md:w-7/12 p-6 sm:p-10 bg-white overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-navy-900">Informations & Paiement</h3>
                <button onClick={closeModal} className="hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePurchase} className="space-y-6">
                
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
                    <input
                      required
                      value={customer.name}
                      onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Nom complet sur le billet"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-navy-900 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="Adresse Email (pour l'envoi)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-navy-900 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-navy-900 transition-colors" />
                    <input
                      required
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="Numéro de téléphone (ex: 77 000 00 00)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-navy-900 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Moyens de paiement */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Sélectionnez le paiement</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wave')}
                      className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 bg-white'
                      }`}
                    >
                      {paymentMethod === 'wave' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></div>}
                      <span className="font-black text-blue-600 text-lg tracking-tight">Wave</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange_money')}
                      className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'orange_money' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200 bg-white'
                      }`}
                    >
                      {paymentMethod === 'orange_money' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500"></div>}
                      <span className="font-black text-orange-500 text-sm tracking-tight text-center leading-none">Orange<br/>Money</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-navy-900 hover:bg-navy-800 disabled:opacity-70 text-white font-black py-5 rounded-xl text-base transition-all active:scale-[0.98] shadow-lg shadow-navy-900/20"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <><span className="animate-spin text-xl">⚙️</span> Sécurisation...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5" /> Confirmer le paiement</>
                    )}
                  </span>
                </button>

                <p className="text-center text-gray-400 text-xs font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Paiement chiffré par NabooPay
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
