import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Loader2, Ticket } from 'lucide-react';
import { supabase } from '../config/supabase';
import QRCode from 'qrcode';

const PaymentTicketSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [ticketData, setTicketData] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const processTicket = async () => {
      try {
        const raw = localStorage.getItem('pendingTicket');
        if (!raw) {
          setStatus('error');
          return;
        }

        const pending = JSON.parse(raw);

        // Générer un token UUID unique pour ce billet
        const token = crypto.randomUUID();

        // Sauvegarder dans Supabase
        const { error } = await supabase.from('ticket_purchases').insert({
          token,
          ticket_id: pending.ticketId,
          ticket_name: pending.ticketName,
          customer_name: pending.customerName,
          customer_email: pending.customerEmail,
          customer_phone: pending.customerPhone,
          amount: pending.amount,
          status: 'paid',
          used: false,
        });

        if (error) throw error;

        // Générer le QR code avec le token
        const qrPayload = JSON.stringify({
          token,
          ticket: pending.ticketName,
          holder: pending.customerName,
          league: 'BUL Basketball',
        });

        const dataUrl = await QRCode.toDataURL(qrPayload, {
          width: 300,
          margin: 2,
          color: { dark: '#0f172a', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });

        setQrDataUrl(dataUrl);
        setTicketData({ ...pending, token });
        localStorage.removeItem('pendingTicket');
        setStatus('success');
      } catch (err) {
        console.error('[TicketSuccess]', err);
        setStatus('error');
      }
    };

    processTicket();
  }, []);

  const handleDownload = () => {
    if (!qrDataUrl || !ticketData) return;

    // Créer un canvas composite (billet complet)
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d')!;

    // Fond
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 900);

    // Bande rouge
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 600, 12);

    // Titre
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUL', 300, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText('BASKETBALL LEAGUE — BILLET OFFICIEL', 300, 110);

    // Nom ticket
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(ticketData.ticketName, 300, 180);

    // Info client
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Titulaire : ${ticketData.customerName}`, 300, 230);
    ctx.fillText(`Email : ${ticketData.customerEmail}`, 300, 258);

    // QR Code
    const qrImg = new Image();
    qrImg.onload = () => {
      // Fond blanc pour QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(150, 300, 300, 300, 16);
      ctx.fill();

      ctx.drawImage(qrImg, 175, 325, 250, 250);

      // Token
      ctx.fillStyle = '#64748b';
      ctx.font = '13px monospace';
      ctx.fillText(ticketData.token, 300, 640);

      // Bas de page
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 888, 600, 12);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('Présentez ce QR code à l\'entrée · Scan unique', 300, 800);

      // Télécharger
      const link = document.createElement('a');
      link.download = `billet-bul-${ticketData.token.slice(0, 8)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    qrImg.src = qrDataUrl;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-navy-900 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Génération de votre billet...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-bold text-lg mb-4">⚠️ Une erreur est survenue</p>
          <p className="text-gray-500 text-sm mb-6">Votre paiement a été reçu mais nous n'avons pas pu générer votre billet. Contactez-nous.</p>
          <button onClick={() => navigate('/')} className="bg-navy-900 text-white px-6 py-3 rounded-xl font-bold">Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* Header succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-navy-900 uppercase tracking-tight mb-2">Billet Confirmé !</h1>
          <p className="text-gray-500">Votre paiement a été accepté. Voici votre billet sécurisé.</p>
        </div>

        {/* Billet visuel */}
        <div className="bg-navy-900 rounded-2xl overflow-hidden shadow-2xl mb-6">
          {/* Top bar */}
          <div className="bg-crimson-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-white" />
              <span className="text-white font-black text-sm uppercase tracking-widest">BUL Basketball</span>
            </div>
            <span className="text-white/70 text-xs font-mono">{ticketData?.token?.slice(0, 8).toUpperCase()}</span>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <h2 className="text-white font-black text-2xl mb-1">{ticketData?.ticketName}</h2>
            <p className="text-white/60 text-sm mb-6">{ticketData?.customerName} · {ticketData?.customerEmail}</p>

            {/* QR Code */}
            {qrDataUrl && (
              <div className="inline-block bg-white p-4 rounded-2xl shadow-lg mb-4">
                <img src={qrDataUrl} alt="QR Code billet" className="w-48 h-48" />
              </div>
            )}

            <p className="text-white/40 text-xs mb-2">Présentez ce QR code à l'entrée</p>
            <p className="text-white/30 text-[10px] font-mono break-all px-4">{ticketData?.token}</p>
          </div>

          {/* Séparateur billetterie */}
          <div className="flex items-center px-4 py-2">
            <div className="w-6 h-6 rounded-full bg-gray-50 -ml-6" />
            <div className="flex-1 border-t-2 border-dashed border-white/10 mx-2" />
            <div className="w-6 h-6 rounded-full bg-gray-50 -mr-6" />
          </div>

          <div className="px-6 pb-4 text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Billet à usage unique · Non remboursable</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center bg-navy-900 hover:bg-navy-800 text-white font-black py-4 rounded-xl transition-all"
          >
            <Download className="w-5 h-5 mr-2" /> Télécharger mon billet (PNG)
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 hover:text-navy-900 font-medium text-sm transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentTicketSuccessPage;
