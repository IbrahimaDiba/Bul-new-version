import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CreditCard, User, Mail, Phone, MapPin, Trash2, Plus, Minus, Package } from 'lucide-react';
import { addAdminOrder } from '../data/adminContent';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  // Load cart from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  // Sync cart to localStorage and dispatch event
  const syncCart = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, (updated[index].qty || 1) + delta);
    syncCart(updated);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    syncCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const itemCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!customer.name || !customer.email || !customer.address || !customer.phone) {
      setPaymentError("Veuillez remplir toutes vos informations.");
      return;
    }

    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

      const res = await fetch(`${supabaseUrl}/functions/v1/naboopay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.qty || 1,
          })),
          success_url: window.location.origin.includes('localhost')
            ? 'https://bul-league.vercel.app/paiement-reussi'
            : `${window.location.origin}/paiement-reussi`,
          error_url: window.location.origin.includes('localhost')
            ? 'https://bul-league.vercel.app/paiement-echoue'
            : `${window.location.origin}/paiement-echoue`,
          method_of_payment: [paymentMethod],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || "Impossible de créer la transaction NabooPay.");
      }

      window.location.href = data.checkout_url;

    } catch (err: any) {
      setPaymentError(err.message || "Une erreur est survenue. Réessayez.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 px-4 sm:px-6 sm:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Shop
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

          {/* ════════ LEFT: CART ITEMS ════════ */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-navy-900" />
                <h1 className="text-xl font-black text-navy-900 uppercase tracking-tight">
                  Mon Panier
                </h1>
                {itemCount > 0 && (
                  <span className="ml-auto text-sm text-gray-500 font-medium">
                    {itemCount} article{itemCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <Package className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium text-lg mb-2">Votre panier est vide</p>
                  <p className="text-gray-400 text-sm mb-6">Ajoutez des articles depuis la boutique</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-navy-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-navy-800 transition-colors"
                  >
                    Voir la boutique
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {cart.map((item, index) => (
                    <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-4 px-6 py-5">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-navy-900 text-sm sm:text-base leading-tight truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.selectedSize && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                              Taille: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                              Couleur: {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <p className="text-crimson-600 font-black text-sm mt-1.5">
                          {(item.price * (item.qty || 1)).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>

                      {/* Quantity + Delete */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-navy-900 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-navy-900 tabular-nums">
                            {item.qty || 1}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-navy-900 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ════════ RIGHT: ORDER SUMMARY + PAYMENT ════════ */}
          <div className="w-full md:w-96 shrink-0">
            <div className="bg-gradient-to-br from-navy-900 to-crimson-900 rounded-2xl shadow-xl p-6 text-white sticky top-28">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6">Récapitulatif</h2>

              {/* Price breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                <div className="flex justify-between text-sm text-white/70">
                  <span>Sous-total ({itemCount} art.)</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>Livraison</span>
                  <span className="text-green-400 font-bold">Gratuite</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-black">Total</span>
                <span className="text-2xl font-black">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {/* Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2 bg-white/10 p-4 rounded-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2 mb-3">
                    Informations de livraison
                  </h3>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Nom complet"
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="Email"
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="Téléphone (ex: 770000000)"
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                    <textarea
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Adresse complète"
                      rows={2}
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-white/30 placeholder-white/40 resize-none"
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wave')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${
                      paymentMethod === 'wave'
                        ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    💙 Wave
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${
                      paymentMethod === 'orange_money'
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-white/5 border-white/15 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    🟠 Orange Money
                  </button>
                </div>

                {/* Error */}
                {paymentError && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-xl px-4 py-3">
                    ⚠️ {paymentError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || isLoading}
                  className="w-full flex items-center justify-center bg-gold-400 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-black py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-100 shadow-lg shadow-gold-400/30"
                >
                  {isLoading ? (
                    <><span className="animate-spin mr-2">⏳</span> Connexion à NabooPay...</>
                  ) : (
                    <><CreditCard className="w-5 h-5 mr-2" /> Payer {total.toLocaleString('fr-FR')} FCFA</>
                  )}
                </button>

                <p className="text-center text-white/40 text-xs">
                  🔒 Paiement sécurisé via NabooPay
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
