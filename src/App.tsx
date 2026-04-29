import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatbotFloatingButton from './components/layout/ChatbotFloatingButton';
import ScrollToTop from './components/layout/ScrollToTop';
import { getIsSupabaseLoaded, ADMIN_CONTENT_EVENT } from './data/adminContent';
import { Loader2 } from 'lucide-react';

// Lazy loading the routes for code splitting (massive performance boost on mobile)
const HomePage = lazy(() => import('./pages/HomePage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage'));
const PlayersPage = lazy(() => import('./pages/PlayersPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const GamesSchedulePage = lazy(() => import('./pages/GamesSchedulePage'));
const GamesResultsPage = lazy(() => import('./pages/GamesResultsPage'));
const GamesHighlightsPage = lazy(() => import('./pages/GamesHighlightsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsArticlePage = lazy(() => import('./pages/NewsArticlePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const StandingsPage = lazy(() => import('./pages/StandingsPage'));
const RostersPage = lazy(() => import('./pages/RostersPage'));
const TeamDetailsPage = lazy(() => import('./pages/TeamDetailsPage'));
const TeamStatsPage = lazy(() => import('./pages/TeamStatsPage'));
const PlayerDetailsPage = lazy(() => import('./pages/PlayerDetailsPage'));
const LeadersPage = lazy(() => import('./pages/LeadersPage'));
const AwardsPage = lazy(() => import('./pages/AwardsPage'));
const PlayerStatsPage = lazy(() => import('./pages/PlayerStatsPage'));
const SponsorsPage = lazy(() => import('./pages/SponsorsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const AppContent: React.FC = () => {
  const location = useLocation();
  const isChatbot = location.pathname === '/chatbot';

  return (
    <div className={`flex flex-col ${isChatbot ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      <ScrollToTop />
      {!isChatbot && <Header />}
      <main className="flex-grow flex flex-col relative min-h-0">
        <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="w-8 h-8 text-navy-900 animate-spin" /></div>}>
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
        </Suspense>
        </main>
        {!isChatbot && <Footer />}
        {!isChatbot && <ChatbotFloatingButton />}
      </div>
  );
};

const App: React.FC = () => {
  // Suppression du blocage global. L'application s'affiche instantanément.
  // Les composants écouteront eux-mêmes ADMIN_CONTENT_EVENT pour se rafraîchir.


  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;