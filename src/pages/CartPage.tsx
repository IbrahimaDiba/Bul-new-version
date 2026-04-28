import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { addAdminOrder } from '../data/adminContent';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.address) {
      alert("Veuillez remplir vos informations.");
      return;
    }
    
    // Create order
    addAdminOrder({
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: customer.address,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.qty || 1,
        priceAtPurchase: item.price,
        name: item.name
      })),
      totalAmount: total,
      status: 'pending',
      date: new Date().toISOString()
    });

    setTimeout(() => {
      setPaymentSuccess(true);
      localStorage.removeItem('cart');
      setCart([]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 px-4 sm:px-6 sm:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-10 relative">
        {/* Left: Cart Items */}
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-navy-900 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-6 flex items-center flex-wrap gap-2">
            <ShoppingCart className="w-7 h-7 shrink-0" /> My Cart
          </h1>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.map((item) => (
                <li key={item.id} className="flex flex-row flex-wrap sm:flex-nowrap sm:items-center gap-3 sm:gap-4 py-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-[60%] sm:min-w-0">
                    <div className="font-semibold text-navy-900 text-base sm:text-lg break-words">{item.name}</div>
                    <div className="text-gray-600 text-sm mb-1">
                      {item.price.toLocaleString('fr-FR')} FCFA × {item.qty || 1}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Category: {item.category}</span>
                      {item.team && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Team: {item.team}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto sm:ml-auto flex justify-end sm:justify-start font-bold text-crimson-500 text-base sm:text-lg shrink-0 tabular-nums">
                    {(item.price * (item.qty || 1)).toLocaleString('fr-FR')} FCFA
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Right: Summary & Payment */}
        <div className="w-full md:w-96 bg-gradient-to-br from-navy-900 to-crimson-900 rounded-2xl shadow-lg p-5 sm:p-8 flex flex-col justify-between text-white min-h-0">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Total</span>
            <span className="text-2xl font-bold">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <form onSubmit={handlePayment} className="flex flex-col gap-4 mt-8">
            <div className="space-y-3 bg-white/10 p-4 rounded-xl">
               <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-3">Informations de livraison</h3>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                 <input required value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="Nom complet" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40" />
               </div>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                 <input required type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40" />
               </div>
               <div className="relative">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                 <input required value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} placeholder="Téléphone" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40" />
               </div>
               <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                 <textarea required value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} placeholder="Adresse complète" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40 min-h-[60px]" />
               </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-3 rounded-lg text-lg transition-colors disabled:opacity-50 mt-2"
              disabled={cart.length === 0 || paymentSuccess}
            >
              <CreditCard className="w-6 h-6 mr-2" /> Valider la commande
            </button>
          </form>
          {paymentSuccess && (
            <div className="mt-6 text-center text-green-300 font-bold text-lg">Payment successful! Thank you for your order.</div>
          )}
        </div>
        {/* Payment Modal (fake) */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Paiement</h2>
              <p className="mb-4 text-gray-700">(Simulation) Merci de votre achat !</p>
              <button
                className="w-full bg-crimson-500 hover:bg-crimson-600 text-white py-2 rounded-md font-semibold"
                onClick={() => { setShowPaymentModal(false); setPaymentSuccess(true); localStorage.removeItem('cart'); setCart([]); }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;