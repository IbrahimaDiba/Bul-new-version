import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vider le panier après un paiement réussi
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-navy-900 mb-4 uppercase tracking-tight">
          Paiement Réussi !
        </h1>
        <p className="text-gray-600 mb-8">
          Merci pour votre achat. Votre commande a été confirmée et sera traitée dans les plus brefs délais.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="w-full flex items-center justify-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mr-2" /> Retour à la boutique
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
