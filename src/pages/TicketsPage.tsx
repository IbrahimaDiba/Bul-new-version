import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle, User, Mail, Phone, CreditCard, X } from 'lucide-react';
import { getAdminTickets, ADMIN_CONTENT_EVENT } from '../data/adminContent';
import { Ticket } from '../types';

const fallbackTickets: Ticket[] = [
  { id: '1', name: 'Season Pass (VIP)', price: 150000, description: 'Accès VIP à tous les matchs à domicile. Sièges Premium. Rencontres avec les joueurs.', type: 'season', inStock: true },
  { id: '2', name: 'Season Pass (Standard)', price: 75000, description: 'Accès régulier à tous les matchs à domicile de la saison régulière.', type: 'season', inStock: true },
  { id: '3', name: 'Wildcats vs Bulls', date: '25 Oct 2024', venue: 'Wildcat Arena', price: 5000, type: 'game', inStock: true },
  { id: '4', name: 'Eagles vs Tigers', date: '28 Oct 2024', venue: 'Dakar Arena', price: 5000, type: 'game', inStock: true }
];

const TicketsPage: React.FC = () => {
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
      setTickets(adminTickets.length > 0 ? adminTickets : fallbackTickets);
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

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

      // Sauvegarder les infos du ticket en attente
      localStorage.setItem('pendingTicket', JSON.stringify({
        ticketId: selectedTicket.id,
        ticketName: selectedTicket.name,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        amount: selectedTicket.price,
        paymentMethod,
      }));

      // Appel NabooPay
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
            ? 'https://bul-league.vercel.app/ticket-reussi'
            : `${window.location.origin}/ticket-reussi`,
          error_url: window.location.origin.includes('localhost')
            ? 'https://bul-league.vercel.app/ticket-echoue'
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
    <div className="min-h-screen bg-gray-50 font-sans pb-24 pt-20">
      <div className="bg-navy-900 border-b-[6px] border-crimson-600 relative py-16 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <TicketIcon className="w-16 h-16 text-crimson-600 mx-auto mb-4" />
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">Official Ticketing</h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Réservez vos places pour ne rien manquer de l'action. Pass saison ou billets au match — paiement sécurisé.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('season')}
            className={`px-8 py-4 font-bold uppercase tracking-wide text-sm border-b-4 transition-colors ${
              activeTab === 'season' ? 'border-crimson-600 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-900'
            }`}
          >Season Passes</button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-8 py-4 font-bold uppercase tracking-wide text-sm border-b-4 transition-colors ${
              activeTab === 'game' ? 'border-crimson-600 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-900'
            }`}
          >Match par Match</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.filter(t => t.type === activeTab).map(ticket => (
            <div key={ticket.id} className="bg-white border text-left border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between">
              {ticket.type === 'season' && !ticket.inStock && <div className="absolute top-0 right-0 bg-gray-500 text-white font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-bl-lg">Sold Out</div>}
              {ticket.type === 'season' && ticket.inStock && <div className="absolute top-0 right-0 bg-gold-400 text-navy-900 font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-bl-lg">Most Popular</div>}
              {ticket.type === 'game' && !ticket.inStock && <div className="absolute top-0 right-0 bg-gray-500 text-white font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-bl-lg">Sold Out</div>}

              <div>
                <h3 className="text-2xl font-black text-navy-900 mb-2">{ticket.name}</h3>
                {ticket.type === 'game' && (
                  <div className="space-y-2 mb-4 text-sm text-gray-600 font-medium">
                    {ticket.date && <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {ticket.date}</p>}
                    {ticket.venue && <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ticket.venue}</p>}
                  </div>
                )}
                {ticket.description && <p className="text-gray-500 text-sm mb-6">{ticket.description}</p>}
                {ticket.type === 'season' && (
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Siège garanti toute la saison</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Remises Boutique -20%</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> QR Code sécurisé unique</li>
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="text-3xl font-black text-crimson-600">{ticket.price.toLocaleString('fr-FR')} FCFA</span>
                <button
                  disabled={!ticket.inStock}
                  onClick={() => openModal(ticket)}
                  className={`${ticket.inStock ? 'bg-navy-900 hover:bg-navy-800 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-6 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2`}
                >
                  <TicketIcon className="w-4 h-4" />
                  {ticket.inStock ? 'Acheter' : 'Épuisé'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL DE PAIEMENT ── */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full sm:rounded-2xl sm:max-w-md max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-black text-navy-900 text-lg">Achat de billet</h3>
                <p className="text-gray-500 text-sm truncate max-w-[220px]">{selectedTicket.name}</p>
              </div>
              <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handlePurchase} className="p-6 space-y-4">
              {/* Récap prix */}
              <div className="bg-navy-900 rounded-xl p-4 flex justify-between items-center">
                <span className="text-white/70 text-sm font-medium">Total à payer</span>
                <span className="text-white font-black text-2xl tabular-nums">{selectedTicket.price.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {/* Infos client */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Vos informations</h4>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Nom complet"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-navy-900"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={customer.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="Email"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-navy-900"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    required
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Téléphone (ex: 770000000)"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              {/* Méthode de paiement */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Moyen de paiement</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'wave', label: '💙 Wave', active: 'bg-blue-500 border-blue-500 text-white' },
                    { id: 'orange_money', label: '🟠 Orange Money', active: 'bg-orange-500 border-orange-500 text-white' },
                  ].map(({ id, label, active }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id as any)}
                      className={`py-3 rounded-xl font-black text-sm border-2 transition-all ${
                        paymentMethod === id ? active : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-crimson-600 hover:bg-crimson-700 disabled:opacity-50 text-white font-black py-4 rounded-xl text-base transition-all active:scale-95"
              >
                {isLoading
                  ? <><span className="animate-spin mr-2">⏳</span> Connexion à NabooPay...</>
                  : <><CreditCard className="w-5 h-5 mr-2" /> Payer {selectedTicket.price.toLocaleString('fr-FR')} FCFA</>
                }
              </button>

              <p className="text-center text-gray-400 text-xs">🔒 Paiement sécurisé · QR code envoyé après confirmation</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
