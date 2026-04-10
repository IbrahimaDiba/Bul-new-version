import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, ChevronDown } from 'lucide-react';
import { NavItem } from '../../types';

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { 
    title: 'Teams', 
    href: '/teams',
    subItems: [
      { title: 'Standings', href: '/teams/standings' },
      { title: 'Statistics', href: '/teams/stats' },
      { title: 'Rosters', href: '/teams/rosters' },
    ] 
  },
  { 
    title: 'Players', 
    href: '/players',
    subItems: [
      { title: 'Leaders', href: '/players/leaders' },
      { title: 'Statistics', href: '/players/stats' },
      { title: 'Awards', href: '/players/awards' },
    ] 
  },
  { 
    title: 'Games', 
    href: '/games',
    subItems: [
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const toggleSubMenu = (title: string) => {
    if (openSubMenu === title) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(title);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-navy-900 shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">BUL</span>
              <span className="ml-1 text-crimson-500 font-bold text-2xl">HOOPS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.title} className="relative group">
                <Link 
                  to={item.href}
                  className="text-white hover:text-gold-400 font-medium transition-colors"
                  onClick={() => item.subItems && toggleSubMenu(item.title)}
                >
                  <div className="flex items-center">
                    {item.title}
                    {item.subItems && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </Link>
                
                {item.subItems && openSubMenu === item.title && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpenSubMenu(null)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-gold-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
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
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
                    onClick={() => !item.subItems && setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={() => toggleSubMenu(item.title)}
                      className="text-white px-2"
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
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
            <button className="text-white hover:text-gold-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              to="/cart" 
              className="text-white hover:text-gold-400 transition-colors relative"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;