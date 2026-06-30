import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { CheckCircle, XCircle, Scan, Loader2, RefreshCw } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

type ScanResult = 'idle' | 'scanning' | 'valid' | 'already_used' | 'invalid' | 'error';

const TicketScanPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult>('idle');
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [manualToken, setManualToken] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // Vérif auth admin
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAuthenticated(false); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      setIsAuthenticated(profile?.role === 'admin');
    };
    check();
  }, []);

  // Nettoyage caméra
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const verifyToken = async (raw: string) => {
    setScanResult('scanning');
    setTicketInfo(null);

    try {
      // Extraire le token (si c'est du JSON ou un UUID direct)
      let token = raw.trim();
      try {
        const parsed = JSON.parse(raw);
        if (parsed.token) token = parsed.token;
      } catch {}

      // Chercher dans Supabase
      const { data, error } = await supabase
        .from('ticket_purchases')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !data) {
        setScanResult('invalid');
        return;
      }

      if (data.used) {
        setTicketInfo(data);
        setScanResult('already_used');
        return;
      }

      // Marquer comme utilisé
      await supabase
        .from('ticket_purchases')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('token', token);

      setTicketInfo(data);
      setScanResult('valid');
    } catch {
      setScanResult('error');
    }
  };

  const startCamera = async () => {
    setScanResult('idle');
    setIsCameraActive(true);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decoded) => {
          await scanner.stop();
          setIsCameraActive(false);
          await verifyToken(decoded);
        },
        () => {}
      );
    } catch {
      setIsCameraActive(false);
      setScanResult('error');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
    }
    setIsCameraActive(false);
  };

  const reset = () => {
    setScanResult('idle');
    setTicketInfo(null);
    setManualToken('');
    stopCamera();
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-navy-900" /></div>;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-crimson-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Scanner de Billets</h1>
          <p className="text-gray-400 text-sm mt-1">BUL — Staff only</p>
        </div>

        {/* Résultat du scan */}
        {scanResult === 'valid' && (
          <div className="bg-green-500 rounded-2xl p-6 text-center mb-6 animate-bounce-once">
            <CheckCircle className="w-16 h-16 mx-auto mb-3" />
            <p className="text-2xl font-black">✅ VALIDE</p>
            {ticketInfo && (
              <div className="mt-3 text-sm text-green-100 space-y-1">
                <p className="font-bold">{ticketInfo.ticket_name}</p>
                <p>{ticketInfo.customer_name}</p>
                <p className="opacity-70">{ticketInfo.customer_email}</p>
              </div>
            )}
          </div>
        )}

        {scanResult === 'already_used' && (
          <div className="bg-red-600 rounded-2xl p-6 text-center mb-6">
            <XCircle className="w-16 h-16 mx-auto mb-3" />
            <p className="text-2xl font-black">🔴 DÉJÀ UTILISÉ</p>
            {ticketInfo && (
              <div className="mt-3 text-sm text-red-100 space-y-1">
                <p className="font-bold">{ticketInfo.ticket_name}</p>
                <p>{ticketInfo.customer_name}</p>
                <p className="opacity-70">Scanné le : {new Date(ticketInfo.used_at).toLocaleString('fr-FR')}</p>
              </div>
            )}
          </div>
        )}

        {scanResult === 'invalid' && (
          <div className="bg-gray-800 border border-red-500 rounded-2xl p-6 text-center mb-6">
            <XCircle className="w-16 h-16 mx-auto mb-3 text-red-500" />
            <p className="text-2xl font-black text-red-400">❌ INVALIDE</p>
            <p className="text-gray-400 text-sm mt-2">Ce billet n'existe pas dans notre système.</p>
          </div>
        )}

        {scanResult === 'scanning' && (
          <div className="bg-gray-800 rounded-2xl p-6 text-center mb-6">
            <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-blue-400" />
            <p className="text-gray-300">Vérification en cours...</p>
          </div>
        )}

        {scanResult === 'error' && (
          <div className="bg-gray-800 rounded-2xl p-6 text-center mb-6">
            <p className="text-yellow-400 font-bold">⚠️ Erreur de lecture</p>
            <p className="text-gray-400 text-sm mt-1">Réessayez ou entrez le code manuellement.</p>
          </div>
        )}

        {/* Viewfinder caméra */}
        {scanResult === 'idle' || scanResult === 'error' ? (
          <div className="space-y-4">
            {/* Zone caméra */}
            <div className={`bg-gray-900 rounded-2xl overflow-hidden ${isCameraActive ? 'block' : 'hidden'}`}>
              <div id="qr-reader" className="w-full" />
            </div>

            {!isCameraActive && (
              <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                  <Scan className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm text-center">Appuyez sur "Scanner" pour activer la caméra</p>
              </div>
            )}

            <button
              onClick={isCameraActive ? stopCamera : startCamera}
              className={`w-full py-4 rounded-xl font-black text-base transition-all ${
                isCameraActive
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-crimson-600 hover:bg-crimson-700 text-white'
              }`}
            >
              {isCameraActive ? '⏹ Arrêter la caméra' : '📷 Scanner un QR Code'}
            </button>

            {/* Saisie manuelle */}
            <div className="space-y-2">
              <p className="text-gray-500 text-xs text-center uppercase tracking-widest">ou entrer le token manuellement</p>
              <div className="flex gap-2">
                <input
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value)}
                  placeholder="Token UUID..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-crimson-500 font-mono"
                />
                <button
                  onClick={() => manualToken && verifyToken(manualToken)}
                  disabled={!manualToken}
                  className="bg-crimson-600 hover:bg-crimson-700 disabled:opacity-40 text-white px-4 rounded-xl font-bold"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Bouton reset */}
        {['valid', 'already_used', 'invalid'].includes(scanResult) && (
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-black py-4 rounded-xl transition-all mt-2"
          >
            <RefreshCw className="w-5 h-5" /> Scanner un autre billet
          </button>
        )}

      </div>
    </div>
  );
};

export default TicketScanPage;
