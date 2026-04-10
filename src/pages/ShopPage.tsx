import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Tag, Users, DollarSign } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';
import { supabase } from '../supabaseClient';
import { products as mockProducts } from '../data/mockData';

const ShopPage: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(mockProducts);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => 
    ['all', ...new Set(products.map(product => product.category))],
    [products]
  );

  const teams = useMemo(() => 
    ['all', ...new Set(products.map(product => product.team).filter((team): team is string => team !== undefined))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        (selectedCategory === 'all' || product.category === selectedCategory) &&
        (selectedTeam === 'all' || (product.team && product.team === selectedTeam)) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, selectedTeam, priceRange, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative bg-navy-900 text-white py-20 overflow-hidden"
        style={{ y }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-navy-900 to-crimson-900 opacity-50"
          style={{ opacity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Official BUL Shop
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get your official Basketball University League merchandise and support your favorite teams.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Menu/Filters */}
          <motion.div 
            className="lg:w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-navy-900 mb-3">
                  <Tag className="w-5 h-5 mr-2 text-crimson-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category
                          ? 'bg-crimson-500 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      {selectedCategory === category && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Teams */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-navy-900 mb-3">
                  <Users className="w-5 h-5 mr-2 text-crimson-500" />
                  Teams
                </h3>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <motion.button
                      key={team}
                      onClick={() => setSelectedTeam(team)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        selectedTeam === team
                          ? 'bg-crimson-500 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{team.charAt(0).toUpperCase() + team.slice(1)}</span>
                      {selectedTeam === team && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-navy-900 mb-3">
                  <DollarSign className="w-5 h-5 mr-2 text-crimson-500" />
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('fr-FR')} FCFA</span>
                    <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h3 
                  className="text-2xl font-semibold text-navy-900 mb-2"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  No products found
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Try adjusting your search or filter criteria
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;