import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsArticle } from '../../types';
import { newsArticles } from '../../data/mockData';

const LatestNews: React.FC = () => {
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
          className="flex justify-between items-center mb-12"
        >
          <h2 className="text-3xl font-bold text-navy-900">Latest News</h2>
          <Link 
            to="/news" 
            className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors group"
          >
            View All News
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
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
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <motion.div 
                className="h-48 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="p-6">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-500"
                >
                  {formatDate(article.date)}
                </motion.span>
                <Link to={`/news/${article.id}`}>
                  <motion.h3 
                    whileHover={{ color: "#dc2626" }}
                    className="text-xl font-semibold text-navy-900 mt-2"
                  >
                    {article.title}
                  </motion.h3>
                </Link>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mt-2 line-clamp-3"
                >
                  {article.summary}
                </motion.p>
                <div className="mt-4 flex justify-between items-center">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize"
                  >
                    {article.category}
                  </motion.span>
                  <Link 
                    to={`/news/${article.id}`} 
                    className="mt-4 inline-block bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Découvrir l'article
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