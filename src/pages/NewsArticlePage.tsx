import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Tag, 
  Share2, 
  Twitter, 
  Facebook, 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  MessageCircle,
  Bookmark,
  Heart,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { newsArticles as mockNewsArticles } from '../data/mockData';

const NewsArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase.from('news').select('*');
      if (!error && data && data.length > 0) {
        setNewsArticles(data);
      } else {
        setNewsArticles(mockNewsArticles);
      }
    };
    fetchNews();
  }, []);

  const article = newsArticles.find(a => a.id === articleId);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  if (!article) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-crimson-900 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="text-center max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Article Not Found
            </h1>
          </motion.div>
          <p className="text-white/80 mb-8 text-lg">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/news" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-crimson-500 to-purple-600 text-white rounded-xl hover:from-crimson-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="mr-3 h-6 w-6" />
              Back to News
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
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
    return `${minutes} min read`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section with 3D Parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-navy-900/60 to-navy-900/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-crimson-500/20 to-purple-600/20" />
        </motion.div>

        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
            <motion.div 
              className="max-w-5xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Link 
                  to="/news" 
                  className="inline-flex items-center text-white/90 hover:text-white transition-all duration-300 mb-8 group"
                >
                  <motion.div
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowLeft className="mr-3 h-6 w-6" />
                  </motion.div>
                  <span className="text-lg font-medium">Back to News</span>
                </Link>
              </motion.div>

              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.span 
                  className="inline-block px-6 py-2 bg-gradient-to-r from-crimson-500 to-purple-600 text-white rounded-full text-sm font-semibold tracking-wide capitalize shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {article.category}
                </motion.span>
                
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
                  variants={itemVariants}
                >
                  {article.title}
                </motion.h1>
                
                <motion.div 
                  className="flex flex-wrap items-center gap-6 text-white/90"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>By {article.author}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDate(article.date)}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{formatReadingTime(article.content)}</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content with 3D Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div 
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 md:p-16">
            {/* Action Bar */}
            <motion.div 
              className="flex items-center justify-between mb-12 pb-8 border-b border-gray-200"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-yellow-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </motion.button>
              </div>
              
              <motion.div className="relative">
                <motion.button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-crimson-500 to-purple-600 text-white rounded-full hover:from-crimson-600 hover:to-purple-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </motion.button>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50"
                    >
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Article Content */}
            <motion.div 
              className="prose prose-lg md:prose-xl max-w-none"
              variants={itemVariants}
            >
              <motion.p 
                className="text-xl md:text-2xl text-gray-700 leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:text-navy-900 first-letter:mr-4 first-letter:float-left first-letter:leading-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {article.content}
              </motion.p>
            </motion.div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <motion.div 
                className="mt-16 pt-8 border-t border-gray-200"
                variants={itemVariants}
              >
                <div className="flex items-center mb-6">
                  <Tag className="h-6 w-6 text-crimson-500 mr-3" />
                  <h3 className="text-xl font-semibold text-navy-900">Related Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag: string, index: number) => (
                    <motion.span 
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-crimson-100 hover:to-purple-100 hover:text-crimson-700 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/news" 
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-xl hover:from-navy-800 hover:to-navy-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="mr-3 h-6 w-6" />
                    Back to News
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Related Articles with 3D Cards */}
        <motion.div 
          className="mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-4xl font-bold text-navy-900 mb-12 text-center"
            variants={itemVariants}
          >
            Related Articles
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsArticles
              .filter(a => a.id !== article.id && a.category === article.category)
              .slice(0, 2)
              .map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  className="group block bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20"
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Link to={`/news/${relatedArticle.id}`}>
                    <div className="h-64 overflow-hidden relative">
                      <motion.img 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <motion.div
                        className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-crimson-500 to-purple-600 text-white rounded-full text-xs font-semibold"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {relatedArticle.category}
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <motion.h3 
                        className="text-2xl font-bold text-navy-900 mb-3 group-hover:text-crimson-500 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {relatedArticle.title}
                      </motion.h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedArticle.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(relatedArticle.date)}
                        </div>
                        <motion.div
                          className="flex items-center text-crimson-500 font-medium"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          Read More
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsArticlePage;
