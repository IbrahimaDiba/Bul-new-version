import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Shield, User, Eye, EyeOff, Mail, Lock, UserCircle } from 'lucide-react';

type Mode = 'login' | 'signup';
type Role = 'user' | 'admin';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // ─── SIGN UP ───────────────────────────────────────────────
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        setIsLoading(false);
        return;
      }

      // 1. Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { role, full_name: fullName.trim() }
        }
      });

      if (signUpError) {
        // Handle common error codes with friendly messages
        if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
          setError('Un compte avec cet email existe déjà. Veuillez vous connecter.');
        } else if (signUpError.message.includes('invalid email')) {
          setError('Adresse email invalide.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      // 2. Save profile to `profiles` table
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName.trim(),
          role: role
        });
      }

      // 3. Try to auto-login (works if email confirmation is disabled in Supabase)
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (!loginError && loginData.user) {
        // Auto-login succeeded → redirect immediately
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email.trim().toLowerCase());
        localStorage.setItem('userName', fullName.trim());
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        setIsLoading(false);
        return;
      }

      // 4. If auto-login failed (email confirmation required), show success message
      setSuccess('🎉 Compte créé avec succès ! Vérifiez votre email pour confirmer votre inscription, puis connectez-vous.');
      setMode('login');
      setEmail(email.trim().toLowerCase());
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setIsLoading(false);
      return;
    }

    // ─── LOG IN ────────────────────────────────────────────────
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    if (loginError) {
      if (loginError.message.includes('Email not confirmed')) {
        setError('Votre email n\'est pas encore confirmé. Vérifiez votre boîte mail et cliquez sur le lien de confirmation.');
      } else if (loginError.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect. Vérifiez vos informations.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
      setIsLoading(false);
      return;
    }

    if (data.user) {
      // Fetch role from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single();

      const userRole = profileData?.role || 'user';
      const userName = profileData?.full_name || data.user.email || '';

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', data.user.email || '');
      localStorage.setItem('userName', userName);

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    setIsLoading(false);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson-600 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-crimson-500 opacity-5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">BUL</span>
            <span className="text-4xl font-black text-crimson-500 tracking-tighter">HOOPS</span>
          </Link>
          <p className="text-white/40 text-sm mt-2 uppercase tracking-widest font-semibold">Portail Officiel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-colors ${
                mode === 'login'
                  ? 'bg-navy-900 text-white'
                  : 'bg-gray-50 text-gray-400 hover:text-navy-900 hover:bg-gray-100'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-colors ${
                mode === 'signup'
                  ? 'bg-crimson-600 text-white'
                  : 'bg-gray-50 text-gray-400 hover:text-crimson-600 hover:bg-gray-100'
              }`}
            >
              S'inscrire
            </button>
          </div>

          {/* Form */}
          <div className="px-8 py-8">

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">



              {/* Full name — signup only */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-black text-navy-900 uppercase tracking-widest mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Votre nom et prénom"
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-navy-900 uppercase tracking-widest mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-black text-navy-900 uppercase tracking-widest">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <a href="#" className="text-xs text-crimson-600 font-semibold hover:text-crimson-700 transition">
                      Oublié ?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-12 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">Minimum 6 caractères</p>
                )}
              </div>

              {/* Confirm password — signup only */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-black text-navy-900 uppercase tracking-widest mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full border bg-gray-50 rounded-xl pl-10 pr-12 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:bg-white transition ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-300 focus:ring-red-300'
                          : confirmPassword && password === confirmPassword
                          ? 'border-green-300 focus:ring-green-400'
                          : 'border-gray-200 focus:ring-crimson-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900 transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-red-500 mt-1 ml-1">Les mots de passe ne correspondent pas</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[10px] text-green-600 mt-1 ml-1">✓ Les mots de passe correspondent</p>
                  )}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-black uppercase tracking-widest py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg mt-2 ${
                  mode === 'signup' && role === 'admin'
                    ? 'bg-crimson-600 hover:bg-crimson-700 shadow-crimson-600/30'
                    : 'bg-navy-900 hover:bg-navy-800 shadow-navy-900/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {mode === 'login' ? 'Connexion…' : 'Création du compte…'}
                  </>
                ) : (
                  mode === 'login' ? 'Se connecter' : `Créer mon compte ${role === 'admin' ? 'Admin' : 'Utilisateur'}`
                )}
              </button>

              {/* Switch mode hint */}
              <p className="text-center text-xs text-gray-400">
                {mode === 'login' ? (
                  <>Pas encore de compte ?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="text-crimson-600 font-bold hover:underline">
                      S'inscrire
                    </button>
                  </>
                ) : (
                  <>Déjà un compte ?{' '}
                    <button type="button" onClick={() => switchMode('login')} className="text-navy-900 font-bold hover:underline">
                      Se connecter
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-8 py-4 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-navy-900 font-semibold uppercase tracking-widest transition">
              ← Retour au site
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
