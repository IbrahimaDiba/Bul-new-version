import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { NavItem } from '../../types';
import { supabase } from '../../config/supabase';

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { 
    title: 'Teams', 
    href: '/teams',
    subItems: [
      { title: 'All Teams', href: '/teams' },
      { title: 'Standings', href: '/teams/standings' },
      { title: 'Statistics', href: '/teams/stats' },
      { title: 'Rosters', href: '/teams/rosters' },
    ] 
  },
  { 
    title: 'Players', 
    href: '/players',
    subItems: [
      { title: 'All Players', href: '/players' },
      { title: 'Leaders', href: '/players/leaders' },
      { title: 'Statistics', href: '/players/stats' },
      { title: 'Awards', href: '/players/awards' },
    ] 
  },
  { 
    title: 'Games', 
    href: '/games',
    subItems: [
      { title: 'All Games', href: '/games' },
      { title: 'Schedule', href: '/games/schedule' },
      { title: 'Results', href: '/games/results' },
      { title: 'Highlights', href: '/games/highlights' },
    ] 
  },
  { title: 'News', href: '/news' },
  { title: 'Shop', href: '/shop' },
  { title: 'Sponsors', href: '/sponsors' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenSubMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer tous les menus à chaque changement de page
  useEffect(() => {
    setOpenSubMenu(null);
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Cart handler
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0));
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('focus', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('focus', updateCartCount);
    };
  }, []);

  // Auth state — listen to Supabase session
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || null);

        // Try profiles table first, fallback to user_metadata
        let role = 'user';
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profile?.role) {
            role = profile.role;
          } else {
            // Fallback: read role from Supabase Auth metadata (set during signup)
            role = session.user.user_metadata?.role || 'user';
          }
        } catch {
          role = session.user.user_metadata?.role || 'user';
        }

        setUserRole(role);
        setIsAdmin(role === 'admin');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);
      } else {
        setUserEmail(null);
        setIsAdmin(false);
        setUserRole('user');
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        loadUser();
      } else {
        setUserEmail(null);
        setIsAdmin(false);
        setUserRole('user');
        localStorage.removeItem('isAuthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setUserEmail(null);
    setIsAdmin(false);
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleSubMenu = (title: string) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  // Shorten email/name for display
  const displayName = userEmail ? userEmail.split('@')[0] : null;

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-900 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/bul_logo.png" alt="BUL HOOPS" className="h-20 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => item.subItems && setOpenSubMenu(item.title)}
                onMouseLeave={() => setOpenSubMenu(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-white hover:text-gold-400 font-medium transition-colors py-2"
                  onClick={(e) => {
                    if (item.subItems) {
                      if (openSubMenu !== item.title) {
                        e.preventDefault();
                        setOpenSubMenu(item.title);
                      } else {
                        setOpenSubMenu(null);
                      }
                    } else {
                      setOpenSubMenu(null);
                    }
                  }}
                >
                  {item.title}
                  {item.subItems && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSubMenu === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </Link>

                {item.subItems && openSubMenu === item.title && (
                  <div className="absolute left-0 top-full pt-2 w-48 z-50">
                    <div className="bg-white rounded-md shadow-xl py-1 border border-gray-100 animate-fade-in">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.href}
                          className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-navy-900 transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-gold-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Dashboard Button — visible directly in nav */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-crimson-600/30"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Auth Section */}
            {userEmail ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5 transition-all"
                >
                  {/* Avatar initials */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${isAdmin ? 'bg-crimson-600' : 'bg-navy-600'}`}>
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-white text-xs font-bold leading-none">{displayName}</div>
                    <div className={`text-xs font-semibold leading-none mt-0.5 ${isAdmin ? 'text-crimson-400' : 'text-gold-400'}`}>
                      {isAdmin ? 'Admin' : 'Utilisateur'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 text-white hover:text-gold-400 transition-colors text-sm font-semibold">
                <User className="w-5 h-5" />
                Connexion
              </Link>
            )}

            <Link to="/cart" className="text-white hover:text-gold-400 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gold-400 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <React.Fragment key={item.title}>
                <div className="flex items-center justify-between">
                  <Link
                    to={item.href}
                    className="text-white hover:text-gold-400 block px-3 py-2 font-medium"
                    onClick={(e) => {
                      if (item.subItems) {
                        if (openSubMenu !== item.title) {
                          e.preventDefault();
                          setOpenSubMenu(item.title);
                        }
                      } else {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {item.title}
                  </Link>
                  {item.subItems && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubMenu(item.title);
                      }} 
                      className="text-white px-4 py-2"
                    >
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${openSubMenu === item.title ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.subItems && openSubMenu === item.title && (
                  <div className="pl-4 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="text-gray-300 hover:text-white block px-3 py-2 text-sm"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile bottom bar */}
          <div className="px-4 py-3 border-t border-gray-700 space-y-2">
            {userEmail ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white ${isAdmin ? 'bg-crimson-600' : 'bg-navy-600'}`}>
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">{displayName}</div>
                    <div className={`text-xs ${isAdmin ? 'text-crimson-400' : 'text-gold-400'}`}>
                      {isAdmin ? 'Admin' : 'Utilisateur'}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-gold-400 font-bold" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 font-semibold w-full">
                  <LogOut className="w-4 h-4" /> Se déconnecter
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-3 py-2 text-white font-semibold text-sm" onClick={() => setIsOpen(false)}>
                <User className="w-5 h-5" /> Connexion
              </Link>
            )}
            <Link to="/cart" className="text-white hover:text-gold-400 transition-colors relative inline-flex items-center gap-2 px-3 py-2" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="bg-crimson-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;