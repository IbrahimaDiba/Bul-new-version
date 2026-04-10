import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import GamesPage from './pages/GamesPage';
import NewsPage from './pages/NewsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import ShopPage from './pages/ShopPage';
import StandingsPage from './pages/StandingsPage';
import RostersPage from './pages/RostersPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';
import SponsorsPage from './pages/SponsorsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ChatbotFloatingButton from './components/layout/ChatbotFloatingButton';
import ChatbotPage from './pages/ChatbotPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/teams/standings" element={<StandingsPage />} />
            <Route path="/teams/rosters" element={<RostersPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailsPage />} />
            <Route path="/players/:playerId/details" element={<PlayerDetailsPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:articleId" element={<NewsArticlePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotFloatingButton />
      </div>
    </Router>
  );
};

export default App;