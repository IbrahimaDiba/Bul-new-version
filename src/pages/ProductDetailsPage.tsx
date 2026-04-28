import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import { ADMIN_CONTENT_EVENT, getManagedProducts } from '../data/adminContent';
import ProductCard from '../components/shop/ProductCard';
import { Product } from '../types';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const reload = () => setAllProducts(getManagedProducts());
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === productId);
    setProduct(foundProduct);
    if (foundProduct) {
      if (foundProduct.sizes && foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
      if (foundProduct.colors && foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
    }
    // Scroll to top on load cleanly
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [productId, allProducts]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4); // Display 4 minimalist cards if possible
  }, [product, allProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);
    
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1, selectedSize, selectedColor });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsAdded(true);
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    setTimeout(() => setIsAdded(false), 2500);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-6" strokeWidth={1} />
          <h1 className="text-2xl font-light text-gray-900 tracking-tight mb-4">Product Not Found.</h1>
          <button 
            onClick={() => navigate('/shop')} 
            className="text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-all pb-1"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      
      {/* ══════════════ NAVIGATION BAR ══════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
           onClick={() => navigate('/shop')}
           className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" strokeWidth={1.5} /> 
          Back to all products
        </button>
      </div>

      {/* ══════════════ PRODUCT HERO SECTION ══════════════ */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Image Area - Massive & Clean */}
          <div className="w-full lg:w-[60%] flex items-center justify-center bg-[#F9F9F9] rounded-3xl p-12 sm:p-24 aspect-square lg:aspect-auto">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[700px] drop-shadow-2xl mix-blend-multiply"
            />
          </div>

          {/* Details Area - Typography Focus */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center pt-8">
            
            <div className="mb-2 text-sm text-gray-500 uppercase tracking-widest">
              {product.category}
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight leading-[1.1] mb-6">
              {product.name}
            </h1>

            <div className="text-2xl font-light text-gray-900 mb-10">
              {product.price.toLocaleString('fr-FR')} FCFA
            </div>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed font-light mb-12 max-w-md">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-10 mb-12">
               
               {/* Size Selector */}
               {product.sizes && product.sizes.length > 0 && (
                 <div>
                    <div className="flex justify-between items-baseline mb-4">
                       <span className="text-sm font-medium text-black">Select Size</span>
                       <button className="text-sm text-gray-400 hover:text-black transition-colors">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                       {product.sizes.map((size: string) => (
                         <button
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`h-14 rounded-full border transition-all duration-200 text-sm font-medium ${
                             selectedSize === size 
                             ? 'border-black bg-black text-white' 
                             : 'border-gray-200 text-gray-900 hover:border-black bg-white'
                           }`}
                         >
                           {size}
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {/* Color Selector */}
               {product.colors && product.colors.length > 0 && (
                 <div>
                    <span className="block text-sm font-medium text-black mb-4">Select Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                    <div className="flex flex-wrap gap-4">
                       {product.colors.map((color: string) => (
                         <button
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={`w-12 h-12 rounded-full p-1 border transition-all ${
                             selectedColor === color ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                           }`}
                         >
                            <div 
                              className="w-full h-full rounded-full border border-gray-200 shadow-sm"
                              style={{ 
                                backgroundColor: color.toLowerCase() === 'navy' ? '#1a365d' :
                                                color.toLowerCase() === 'red' ? '#c41e3a' :
                                                color.toLowerCase() === 'black' ? '#000000' :
                                                color.toLowerCase() === 'white' ? '#ffffff' :
                                                color.toLowerCase() === 'green' ? '#047857' :
                                                color.toLowerCase() === 'gold' ? '#ffd700' : color
                              }}
                            />
                         </button>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
               <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full relative overflow-hidden rounded-full py-5 px-8 text-base font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
                    product.inStock 
                    ? 'bg-black text-white hover:bg-gray-900 hover:scale-[1.02] shadow-xl shadow-black/10' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
               >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div 
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                         Added to Bag
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="add"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                         Add to Bag
                      </motion.div>
                    )}
                  </AnimatePresence>
               </button>
               
               <p className="text-center text-xs text-gray-500 font-light mt-4">
                 Free standard shipping and returns.
               </p>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════ RELATED PRODUCTS ══════════════ */}
      {relatedProducts.length > 0 && (
        <section className="py-24 border-t border-gray-100">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                 <h2 className="text-2xl font-medium text-black tracking-tight">You Might Also Like</h2>
                 <Link to="/shop" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                    Shop All
                 </Link>
              </div>

              {/* Minimalist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                 {relatedProducts.map(p => (
                   <Link key={p.id} to={`/shop/product/${p.id}`} className="group block">
                      <div className="aspect-[4/5] bg-[#F9F9F9] rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-8 relative">
                         <img 
                           src={p.image} 
                           alt={p.name} 
                           className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" 
                         />
                         {/* Quick Add Overlay */}
                         <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="w-full bg-white/90 backdrop-blur-sm text-black rounded-xl py-3 text-sm font-medium shadow-sm hover:bg-white flex justify-center items-center gap-2">
                               <ShoppingBag className="w-4 h-4" /> Quick Add
                            </button>
                         </div>
                      </div>
                      <div>
                         <h3 className="text-base font-medium text-black mb-1">{p.name}</h3>
                         <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                         <p className="text-base font-light text-black">{p.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailsPage;