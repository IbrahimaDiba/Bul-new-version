import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <img src="/bul_logo.png" alt="BUL HOOPS" className="h-28 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-gray-400">
              The premier basketball league for university students. Showcasing talent, fostering competition, and building future stars.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/teams" className="text-gray-400 hover:text-white transition-colors">Teams</Link>
              </li>
              <li>
                <Link to="/players" className="text-gray-400 hover:text-white transition-colors">Players</Link>
              </li>
              <li>
                <Link to="/games/schedule" className="text-gray-400 hover:text-white transition-colors">Schedule</Link>
              </li>
              <li>
                <Link to="/games/results" className="text-gray-400 hover:text-white transition-colors">Results</Link>
              </li>
              <li>
                <Link to="/games/highlights" className="text-gray-400 hover:text-white transition-colors">Highlights</Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-white transition-colors">News</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/media" className="text-gray-400 hover:text-white transition-colors">Media</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter and stay updated with the latest news and events.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-navy-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-r-md transition-colors flex items-center"
              >
                <Mail className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Basketball University League. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;