import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setShowModal(false);
      alert('Réservation confirmée ! Vous recevrez vos e-billets par email.');
      setSelectedTicket(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 pt-20">
      <div className="bg-navy-900 border-b-[6px] border-crimson-600 relative py-16 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <TicketIcon className="w-16 h-16 text-crimson-600 mx-auto mb-4" />
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">Official Ticketing</h1>
          <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Réservez vos places pour ne rien manquer de l'action sur le parquet. Pass saison ou billets au match, choisissez votre formule.
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
          >
            Season Passes
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-8 py-4 font-bold uppercase tracking-wide text-sm border-b-4 transition-colors ${
              activeTab === 'game' ? 'border-crimson-600 text-navy-900' : 'border-transparent text-gray-500 hover:text-navy-900'
            }`}
          >
            Match par Match
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.filter(t => t.type === activeTab).map(ticket => (
            <div key={ticket.id} className="bg-white border text-left border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between">
              {ticket.type === 'season' && <div className="absolute top-0 right-0 bg-gold-400 text-navy-900 font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-bl-lg">Most Popular</div>}
              {!ticket.inStock && <div className="absolute top-0 right-0 bg-gray-500 text-white font-bold text-[10px] px-3 py-1 uppercase tracking-widest rounded-bl-lg">Sold Out</div>}
              
              <div>
                <h3 className="text-2xl font-black text-navy-900 mb-2">{ticket.name}</h3>
                {ticket.type === 'game' && (
                  <div className="space-y-2 mb-4 text-sm text-gray-600 font-medium">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {ticket.date}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ticket.venue}</p>
                  </div>
                )}
                {ticket.description && <p className="text-gray-500 text-sm mb-6">{ticket.description}</p>}
                
                {ticket.type === 'season' && (
                   <ul className="space-y-2 mb-6">
                     <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Siège garanti</li>
                     <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Remises Boutique -20%</li>
                   </ul>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <span className="text-3xl font-black text-crimson-600">{ticket.price.toLocaleString('fr-FR')} FCFA</span>
                <button
                  disabled={!ticket.inStock}
                  onClick={() => { setSelectedTicket(ticket.id); setShowModal(true); }}
                  className={`${ticket.inStock ? 'bg-navy-900 hover:bg-navy-800 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-6 py-3 rounded-lg font-bold text-sm transition-colors`}
                >
                  {ticket.inStock ? 'Buy Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
         <div className="fixed inset-0 bg-navy-900/80 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
               <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-navy-900">×</button>
               <h3 className="text-2xl font-black text-navy-900 mb-6">Détails de facturation</h3>
               <form onSubmit={handlePurchase} className="space-y-4">
                  <input required placeholder="Nom Complet" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  <input required type="email" placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  <input required placeholder="Numéro de carte ou Mobile Money" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  <button type="submit" className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold py-3 rounded-lg mt-4">Confirmer le paiement</button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default TicketsPage;
