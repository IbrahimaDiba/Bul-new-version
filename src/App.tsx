import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';
import GamesSchedulePage from './pages/GamesSchedulePage';
import GamesResultsPage from './pages/GamesResultsPage';
import GamesHighlightsPage from './pages/GamesHighlightsPage';
import NewsPage from './pages/NewsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import ShopPage from './pages/ShopPage';
import TicketsPage from './pages/TicketsPage';
import StandingsPage from './pages/StandingsPage';
import RostersPage from './pages/RostersPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import TeamStatsPage from './pages/TeamStatsPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';
import LeadersPage from './pages/LeadersPage';
import AwardsPage from './pages/AwardsPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import SponsorsPage from './pages/SponsorsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ChatbotFloatingButton from './components/layout/ChatbotFloatingButton';
import ChatbotPage from './pages/ChatbotPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/layout/ScrollToTop';
import { getIsSupabaseLoaded, ADMIN_CONTENT_EVENT } from './data/adminContent';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isChatbot = location.pathname === '/chatbot';

  return (
    <div className={`flex flex-col ${isChatbot ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      <ScrollToTop />
      <Header />
      <main className="flex-grow flex flex-col relative min-h-0">
        <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Teams Routes */}
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/standings" element={<StandingsPage />} />
            <Route path="/teams/rosters" element={<RostersPage />} />
            <Route path="/teams/stats" element={<TeamStatsPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            
            {/* Players Routes */}
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/leaders" element={<LeadersPage />} />
            <Route path="/players/awards" element={<AwardsPage />} />
            <Route path="/players/stats" element={<PlayerStatsPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailsPage />} />
            <Route path="/players/:playerId/details" element={<PlayerDetailsPage />} />
            
            {/* Games Routes */}
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/schedule" element={<GamesSchedulePage />} />
            <Route path="/games/results" element={<GamesResultsPage />} />
            <Route path="/games/highlights" element={<GamesHighlightsPage />} />
            
            {/* Other Routes */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:articleId" element={<NewsArticlePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/season" element={<TicketsPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        {!isChatbot && <Footer />}
        {!isChatbot && <ChatbotFloatingButton />}
      </div>
  );
};

const App: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(getIsSupabaseLoaded());

  useEffect(() => {
    const checkLoaded = () => setIsDataLoaded(getIsSupabaseLoaded());
    window.addEventListener(ADMIN_CONTENT_EVENT, checkLoaded);
    return () => window.removeEventListener(ADMIN_CONTENT_EVENT, checkLoaded);
  }, []);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-crimson-500 animate-spin mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-widest text-center">
          Basketball<br/><span className="text-crimson-500">University</span><br/>League
        </h1>
        <p className="text-gray-400 mt-4 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;