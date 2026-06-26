import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';

const PaymentErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-navy-900 mb-4 uppercase tracking-tight">
          Paiement Échoué
        </h1>
        <p className="text-gray-600 mb-8">
          Une erreur est survenue lors de votre paiement, ou vous avez annulé la transaction. Aucun montant n'a été débité.
        </p>
        <button
          onClick={() => navigate('/cart')}
          className="w-full flex items-center justify-center bg-crimson-600 hover:bg-crimson-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Réessayer le paiement
        </button>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
