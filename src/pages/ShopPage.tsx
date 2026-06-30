import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, Tag, Users, DollarSign, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';
import { ADMIN_CONTENT_EVENT, getManagedProducts, getManagedTeams, getIsSupabaseLoaded } from '../data/adminContent';
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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (event.matches) setShowFilters(false);
    };
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const reload = () => {
      const prods = getManagedProducts();
      setAllProducts(prods);
      setAllTeams(getManagedTeams());
      if (prods.length > 0 || getIsSupabaseLoaded()) {
        setIsLoading(false);
      }
    }
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    // Fallback: stop loading after 8s even if Supabase returns nothing
    const timeout = setTimeout(() => setIsLoading(false), 8000);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
      clearTimeout(timeout);
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:flex-1 sm:max-w-md lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search gear, jerseys, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-4 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
             <div className="relative flex-1 min-w-0 sm:flex-none sm:min-w-[180px]">
               <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'name')}
                className="w-full appearance-none bg-white border border-gray-200 py-2.5 pl-3 sm:pl-4 pr-9 sm:pr-10 rounded-md text-xs sm:text-sm font-bold text-navy-900 focus:outline-none focus:border-navy-900 transition-all cursor-pointer truncate"
               >
                 <option value="name">Sort by: Name</option>
                 <option value="price-asc">Price: Low to High</option>
                 <option value="price-desc">Price: High to Low</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>

             <button 
              type="button"
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-navy-900 text-white px-3 sm:px-4 py-2.5 rounded-md font-bold text-xs sm:text-sm shadow-md shrink-0"
             >
               <SlidersHorizontal className="w-4 h-4" />
               <span className="hidden sm:inline">Filters</span>
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Desktop sidebar */}
          {isDesktop && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-24">
                <FilterPanel
                  categories={categories}
                  teamList={teamList}
                  selectedCategory={selectedCategory}
                  selectedTeam={selectedTeam}
                  priceRange={priceRange}
                  onCategoryChange={setSelectedCategory}
                  onTeamChange={setSelectedTeam}
                  onPriceChange={setPriceRange}
                />
              </div>
            </aside>
          )}

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {!isDesktop && showFilters && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close filters"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setShowFilters(false)}
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  className="fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,320px)] bg-white shadow-2xl flex flex-col lg:hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Filters</h2>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                      aria-label="Close filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterPanel
                      categories={categories}
                      teamList={teamList}
                      selectedCategory={selectedCategory}
                      selectedTeam={selectedTeam}
                      priceRange={priceRange}
                      onCategoryChange={setSelectedCategory}
                      onTeamChange={setSelectedTeam}
                      onPriceChange={setPriceRange}
                    />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-md font-bold text-sm uppercase tracking-widest"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.aside>
              </>
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
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 sm:p-12 lg:p-20 text-center">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-black text-navy-900 mb-2 uppercase tracking-tight">No Items Found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find any products matching your current filters. Try resetting or adjusting your search.</p>
                <button 
                  onClick={() => {setSelectedCategory('all'); setSelectedTeam('all'); setPriceRange(100000); setSearchQuery('')}}
                  className="px-8 py-3 bg-navy-900 text-white font-black uppercase tracking-widest text-xs hover:bg-navy-800 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

type FilterPanelProps = {
  categories: string[];
  teamList: { id: string; name: string }[];
  selectedCategory: string;
  selectedTeam: string;
  priceRange: number;
  onCategoryChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  onPriceChange: (value: number) => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  teamList,
  selectedCategory,
  selectedTeam,
  priceRange,
  onCategoryChange,
  onTeamChange,
  onPriceChange
}) => (
  <>
    <div className="mb-6 sm:mb-8">
      <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
        <Tag className="w-4 h-4 text-crimson-600 shrink-0" />
        Categories
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`w-full text-left px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-all rounded-sm ${
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

    <div className="mb-6 sm:mb-8">
      <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
        <Users className="w-4 h-4 text-crimson-600 shrink-0" />
        Filter by Team
      </h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {teamList.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => onTeamChange(team.id)}
            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase transition-all flex items-center justify-between gap-2 ${
              selectedTeam === team.id
                ? 'text-crimson-600 border-l-4 border-crimson-600 pl-4'
                : 'text-gray-500 hover:text-navy-900 pl-3 border-l-4 border-transparent'
            }`}
          >
            <span className="truncate">{team.name}</span>
            {selectedTeam === team.id && <ChevronRight className="w-4 h-4 shrink-0" />}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="flex items-center gap-2 text-xs font-black text-navy-900 uppercase tracking-widest mb-4">
        <DollarSign className="w-4 h-4 text-crimson-600 shrink-0" />
        Max Price
      </h3>
      <input
        type="range"
        min={0}
        max={100000}
        step={5000}
        value={priceRange}
        onChange={(e) => onPriceChange(Number(e.target.value))}
        className="w-full h-2 sm:h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-navy-900 touch-manipulation"
      />
      <div className="mt-3 flex justify-between font-bold text-navy-900 text-xs gap-2">
        <span className="shrink-0">0 FCFA</span>
        <span className="text-crimson-600 bg-crimson-50 px-2 py-0.5 rounded truncate">
          {priceRange.toLocaleString('fr-FR')} FCFA
        </span>
      </div>
    </div>
  </>
);

export default ShopPage;
