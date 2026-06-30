import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, CreditCard, User, Mail, Phone, MapPin, Trash2, Plus, Minus, Package, Lock } from 'lucide-react';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money'>('wave');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

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

      localStorage.setItem('pendingOrder', JSON.stringify({
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
        status: 'paid',
        date: new Date().toISOString()
      }));

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
    <div className="min-h-screen bg-gray-50">

      {/* ─── TOP BAR ─── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-base font-black text-navy-900 uppercase tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Mon Panier
          {itemCount > 0 && (
            <span className="bg-crimson-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-40 lg:pb-6 lg:max-w-5xl">
        {cart.length === 0 ? (

          /* ─── EMPTY CART ─── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-navy-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-400 text-sm mb-8">Ajoutez des articles depuis la boutique</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-navy-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-navy-800 transition-colors"
            >
              Voir la boutique
            </button>
          </div>

        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 lg:items-start">

            {/* ─── LEFT: CART ITEMS ─── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 lg:mb-0">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-50">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {itemCount} article{itemCount > 1 ? 's' : ''}
                </p>
              </div>

              <ul className="divide-y divide-gray-50">
                {cart.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="px-4 sm:px-6 py-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center p-1.5 sm:p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Info + Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-black text-navy-900 text-sm leading-tight line-clamp-2 flex-1">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeItem(index)}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.selectedSize && (
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                              {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>

                        {/* Price + Qty */}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-crimson-600 font-black text-sm tabular-nums">
                            {(item.price * (item.qty || 1)).toLocaleString('fr-FR')} FCFA
                          </p>
                          {/* Quantity */}
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(index, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-black text-navy-900 tabular-nums">
                              {item.qty || 1}
                            </span>
                            <button
                              onClick={() => updateQty(index, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── RIGHT: ORDER SUMMARY ─── */}
            <div className="lg:sticky lg:top-20">

              {/* Summary card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4">
                <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-4">Récapitulatif</h2>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total ({itemCount} art.)</span>
                    <span className="font-medium text-gray-900">{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Livraison</span>
                    <span className="text-green-600 font-bold">Gratuite</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-black text-navy-900">Total</span>
                  <span className="text-xl font-black text-navy-900 tabular-nums">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Payment form — collapsible on mobile */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl overflow-hidden shadow-xl">

                {/* Form header - toggle on mobile */}
                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 lg:cursor-default"
                >
                  <span className="text-sm font-black text-white uppercase tracking-widest">
                    Informations de livraison
                  </span>
                  <span className="text-white/50 text-xs lg:hidden">
                    {showForm ? '▲ Masquer' : '▼ Afficher'}
                  </span>
                </button>

                <div className={`${showForm ? 'block' : 'hidden'} lg:block px-4 sm:px-6 pb-6`}>
                  <form onSubmit={handlePayment} className="space-y-3">
                    {/* Fields */}
                    {[
                      { icon: User, key: 'name', placeholder: 'Nom complet', type: 'text' },
                      { icon: Mail, key: 'email', placeholder: 'Email', type: 'email' },
                      { icon: Phone, key: 'phone', placeholder: 'Téléphone (ex: 770000000)', type: 'tel' },
                    ].map(({ icon: Icon, key, placeholder, type }) => (
                      <div key={key} className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          required
                          type={type}
                          value={(customer as any)[key]}
                          onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
                        />
                      </div>
                    ))}
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                      <textarea
                        required
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="Adresse complète"
                        rows={2}
                        className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all resize-none"
                      />
                    </div>

                    {/* Payment method */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { id: 'wave', label: '💙 Wave', active: 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30' },
                        { id: 'orange_money', label: '🟠 Orange Money', active: 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/30' },
                      ].map(({ id, label, active }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setPaymentMethod(id as any)}
                          className={`py-3 rounded-xl font-black text-sm border-2 transition-all ${
                            paymentMethod === id
                              ? `${active} text-white`
                              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Error */}
                    {paymentError && (
                      <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-xs rounded-xl px-4 py-3 flex items-start gap-2">
                        <span className="shrink-0">⚠️</span>
                        <span>{paymentError}</span>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center bg-gold-400 hover:bg-gold-500 disabled:opacity-60 disabled:cursor-not-allowed text-navy-900 font-black py-4 rounded-xl text-sm sm:text-base transition-all active:scale-95 shadow-lg mt-2"
                    >
                      {isLoading ? (
                        <><span className="animate-spin mr-2 text-base">⏳</span> Connexion à NabooPay...</>
                      ) : (
                        <><CreditCard className="w-5 h-5 mr-2" /> Payer {total.toLocaleString('fr-FR')} FCFA</>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs pt-1">
                      <Lock className="w-3 h-3" />
                      <span>Paiement sécurisé via NabooPay</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MOBILE STICKY BOTTOM BAR ─── */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 safe-area-pb z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{itemCount} article{itemCount > 1 ? 's' : ''}</span>
            <span className="font-black text-navy-900 tabular-nums">{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <button
            onClick={() => { setShowForm(true); window.scrollTo({ top: 9999, behavior: 'smooth' }); }}
            className="w-full flex items-center justify-center bg-navy-900 hover:bg-navy-800 text-white font-black py-3.5 rounded-xl text-sm transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" /> Procéder au paiement
          </button>
        </div>
      )}

    </div>
  );
};

export default CartPage;
