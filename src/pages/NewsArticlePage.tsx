import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Tag, 
  Share2, 
  Twitter, 
  Facebook, 
  Calendar, 
  User, 
  Clock, 
  Bookmark,
  Heart,
  ChevronRight,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedNewsArticles } from '../data/adminContent';
import { NewsArticle } from '../types';

const NewsArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  const article = articles.find(a => a.id === articleId);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  useEffect(() => {
    const reload = () => setArticles(getManagedNewsArticles());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 max-w-md text-center">
          <h1 className="text-3xl font-black text-navy-900 mb-4 uppercase tracking-tight">Article Not Found</h1>
          <p className="text-gray-500 mb-8">The story you're looking for does not exist or has been removed.</p>
          <Link 
            to="/news" 
            className="inline-flex items-center px-6 py-3 bg-navy-900 text-white font-bold rounded-sm hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to News
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} MIN READ`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO IMAGE HEADER ══════════════ */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] bg-navy-900 overflow-hidden pt-20 sm:pt-24">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Professional Editorial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
        <div className="absolute inset-0 bg-navy-900/20" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 text-center sm:text-left">
            <span className="inline-block px-4 py-1.5 bg-crimson-600 text-white text-xs font-bold uppercase tracking-widest mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-gray-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5 text-crimson-500" />
                BY {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                {formatDate(article.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                {formatReadingTime(article.content)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ ARTICLE CONTENT BODY ══════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
          
          {/* Social Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 py-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start mb-4 sm:mb-0">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-colors ${
                  isLiked 
                    ? 'border-crimson-600 text-crimson-600 bg-crimson-50' 
                    : 'border-gray-200 text-gray-500 hover:text-navy-900 hover:border-gray-300 bg-white'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-colors ${
                  isBookmarked 
                    ? 'border-navy-900 text-navy-900 bg-gray-100' 
                    : 'border-gray-200 text-gray-500 hover:text-navy-900 hover:border-gray-300 bg-white'
                }`}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-navy-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Story
              </button>
              
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg p-2 z-50 flex gap-2 w-full sm:w-auto justify-center"
                  >
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-700 hover:bg-gray-50 transition-colors">
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                      <LinkIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actual Text Content */}
          <div className="px-6 sm:px-12 py-10 sm:py-16">
            <article className="prose prose-lg prose-gray max-w-none prose-headings:font-black prose-headings:text-navy-900 prose-a:text-crimson-600 hover:prose-a:text-crimson-700">
              {/* Preserve line breaks and spacing from admin entry with editorial drop-cap */}
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:text-navy-900 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                {article.content}
              </div>
            </article>

            {/* Tags area */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Story Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-navy-900 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════ RELATED ARTICLES ══════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t-2 border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-crimson-600" />
          <h2 className="text-2xl font-black text-navy-900 uppercase tracking-tight">
            More Related News
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles
            .filter(a => a.id !== article.id && a.category === article.category)
            .slice(0, 3)
            .map((relatedArticle) => (
              <Link 
                key={relatedArticle.id} 
                to={`/news/${relatedArticle.id}`}
                className="group bg-white border border-gray-200 flex flex-col shadow-sm hover:shadow-md hover:border-crimson-300 transition-all overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={relatedArticle.image} 
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {relatedArticle.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-navy-900 mb-2 leading-tight group-hover:text-crimson-600 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <div className="mt-auto flex items-center text-[#999999] text-xs font-semibold uppercase tracking-wider pt-4">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {formatDate(relatedArticle.date)}
                  </div>
                </div>
              </Link>
            ))}
            
          {/* Fallback if no specific category matches are found */}
          {articles.filter(a => a.id !== article.id && a.category === article.category).length === 0 &&
            articles.filter(a => a.id !== article.id).slice(0, 3).map((relatedArticle) => (
              <Link 
                key={relatedArticle.id} 
                to={`/news/${relatedArticle.id}`}
                className="group bg-white border border-gray-200 flex flex-col shadow-sm hover:shadow-md hover:border-crimson-300 transition-all overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={relatedArticle.image} 
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {relatedArticle.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-navy-900 mb-2 leading-tight group-hover:text-crimson-600 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <div className="mt-auto flex items-center text-[#999999] text-xs font-semibold uppercase tracking-wider pt-4">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {formatDate(relatedArticle.date)}
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
      
    </div>
  );
};

export default NewsArticlePage;
