import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { addAdminOrder } from '../data/adminContent';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    const savePendingOrder = async () => {
      try {
        // Lire la commande en attente depuis localStorage
        const pendingOrderRaw = localStorage.getItem('pendingOrder');
        if (pendingOrderRaw) {
          const pendingOrder = JSON.parse(pendingOrderRaw);
          // Sauvegarder dans Supabase maintenant que le paiement est confirmé
          await addAdminOrder(pendingOrder);
          // Nettoyer
          localStorage.removeItem('pendingOrder');
        }
      } catch (err) {
        console.error('[PaymentSuccess] Erreur lors de la sauvegarde de la commande:', err);
      } finally {
        // Vider le panier dans tous les cas
        localStorage.removeItem('cart');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        setOrderSaved(true);
      }
    };

    savePendingOrder();
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {!orderSaved ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-navy-900 animate-spin" />
            <p className="text-gray-500 font-medium">Confirmation de la commande...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-navy-900 mb-3 uppercase tracking-tight">
              Paiement Réussi !
            </h1>
            <p className="text-gray-500 mb-2">
              Merci pour votre achat. Votre commande a été confirmée.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Vous recevrez une confirmation par email sous peu.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="w-full flex items-center justify-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Retour à la boutique
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
