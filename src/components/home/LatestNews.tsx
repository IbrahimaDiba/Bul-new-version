import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsArticle } from '../../types';
import { ADMIN_CONTENT_EVENT, getManagedNewsArticles } from '../../data/adminContent';

const LatestNews: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const reload = () => setNewsArticles(getManagedNewsArticles());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-8 sm:mb-12 border-b-2 border-gray-200 pb-4 relative"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 uppercase tracking-tight">Latest News</h2>
            <div className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-crimson-600"></div>
          </div>
          <Link 
            to="/news" 
            className="group flex items-center text-sm font-bold text-navy-900 uppercase tracking-widest hover:text-crimson-600 transition-colors pb-1"
          >
            Toutes les news
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {newsArticles.slice(0, 4).map((article) => (
            <motion.div 
              key={article.id}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="bg-white border border-gray-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-crimson-300 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2"
                >
                  {formatDate(article.date)}
                </motion.span>
                <Link to={`/news/${article.id}`}>
                  <motion.h3 
                    className="text-lg font-black text-navy-900 leading-tight mb-3 line-clamp-2 group-hover:text-crimson-600 transition-colors"
                  >
                    {article.title}
                  </motion.h3>
                </Link>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-sm mb-6 line-clamp-3"
                >
                  {article.summary}
                </motion.p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link 
                    to={`/news/${article.id}`} 
                    className="flex items-center justify-between text-xs font-bold text-navy-900 uppercase tracking-widest hover:text-crimson-600 transition-colors w-full"
                  >
                    <span>Découvrir l'article</span>
                    <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-crimson-50 transition-colors">
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:text-crimson-600 transition-all" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LatestNews;