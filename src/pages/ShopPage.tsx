import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronRight, Tag, Users, DollarSign, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';
import { ADMIN_CONTENT_EVENT, getManagedProducts, getManagedTeams } from '../data/adminContent';
import { Product, Team } from '../types';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

const ShopPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reload = () => {
      const prods = getManagedProducts();
      console.log('[ShopPage] Reloading products:', prods);
      setAllProducts(prods);
      setAllTeams(getManagedTeams());
      setIsLoading(false);
    }
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(allProducts.map((product) => product.category))],
    [allProducts]
  );

  const teamList = useMemo(() => {
    const uniqueTeamIds = [...new Set(allProducts.map((product) => product.team).filter((t): t is string => !!t))];
    return [
      { id: 'all', name: 'All Teams' },
      ...uniqueTeamIds.map(id => {
        const teamObj = allTeams.find(t => t.id === id);
        return { id, name: teamObj ? teamObj.name : id };
      })
    ];
  }, [allProducts, allTeams]);

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(
        (product) =>
          (selectedCategory === 'all' || product.category === selectedCategory) &&
          (selectedTeam === 'all' || (product.team && product.team === selectedTeam)) &&
          product.price <= priceRange &&
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
  }, [allProducts, selectedCategory, selectedTeam, priceRange, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* ══════════════ HERO SECTION (Brand Navy) ══════════════ */}
      <div className="bg-navy-900 border-b-4 border-crimson-600 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative overflow-hidden">


          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-none">
              BUL <span className="text-crimson-500">Official Store</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl font-medium">
              Rep your team with premium jerseys, performance gear, and exclusive league collectibles.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ══════════════ TOOLBAR: SEARCH & MOBILE TOGGLE ══════════════ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search gear, jerseys, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-4 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             {/* Sort Select */}
             <div className="relative flex-1 sm:flex-none">
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-white border border-gray-200 py-2.5 pl-4 pr-10 rounded-md text-sm font-bold text-navy-900 focus:outline-none focus:border-navy-900 transition-all cursor-pointer"
               >
                 <option value="name">Sort by: Name</option>
                 <option value="price-asc">Price: Low to High</option>
                 <option value="price-desc">Price: High to Low</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Filter Toggle (Mobile) */}
             <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 bg-navy-900 text-white px-4 py-2.5 rounded-md font-bold text-sm shadow-md"
             >
               <SlidersHorizontal className="w-4 h-4" />
               Filters
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ══════════════ SIDEBAR FILTERS (Standard Pro Desktop) ══════════════ */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${showFilters ? 'block' : 'hidden lg:block'} w-full lg:w-72 flex-shrink-0 mb-8 lg:mb-0`}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                  {/* Category Filter */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
                      <Tag className="w-4 h-4 text-crimson-600" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                       {categories.map(cat => (
                         <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                            selectedCategory === cat 
                            ? 'bg-navy-900 text-white' 
                            : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
                          }`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Team Filter */}
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
                      <Users className="w-4 h-4 text-crimson-600" />
                      Filter by Team
                    </h3>
                    <div className="space-y-1">
                       {teamList.map(team => (
                         <button
                          key={team.id}
                          onClick={() => setSelectedTeam(team.id)}
                          className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center justify-between ${
                            selectedTeam === team.id 
                            ? 'text-crimson-600 border-l-4 border-crimson-600 pl-4' 
                            : 'text-gray-500 hover:text-navy-900 pl-3 border-l-4 border-transparent'
                          }`}
                         >
                           {team.name}
                           {selectedTeam === team.id && <ChevronRight className="w-4 h-4" />}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
                      <DollarSign className="w-4 h-4 text-crimson-600" />
                      Max Price
                    </h3>
                    <input 
                      type="range"
                      min={0}
                      max={100000}
                      step={5000}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-navy-900"
                    />
                    <div className="mt-3 flex justify-between font-bold text-navy-900 text-xs">
                      <span>0 FCFA</span>
                      <span className="text-crimson-600 bg-crimson-50 px-2 py-0.5 rounded">{priceRange.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* ══════════════ PRODUCT GRID ══════════════ */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Displaying {filteredProducts.length} Results
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-20 text-center">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy-900 mb-2 font-black uppercase tracking-tight">No Items Found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find any products matching your current filters. Try resetting or adjusting your search.</p>
                <button 
                  onClick={() => {setSelectedCategory('all'); setSelectedTeam('all'); setPriceRange(100000); setSearchQuery('')}}
                  className="px-8 py-3 bg-navy-900 text-white font-black uppercase tracking-widest text-xs hover:bg-navy-800 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredProducts.map((p, index) => (
                   <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                   >
                     <ProductCard product={p} />
                   </motion.div>
                 ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShopPage;
