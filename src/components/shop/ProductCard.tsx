import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Custom non-intrusive notification logic could go here
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-white group relative flex flex-col h-full border border-gray-100 hover:border-crimson-200 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
      
      {/* ══════════════ PRODUCT IMAGE ══════════════ */}
      <div className="relative aspect-[1/1] overflow-hidden bg-gray-50 border-b border-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Les badges équipe/autre pourront être rajoutés proprement ici plus tard si besoin */}
          {product.category === 'Jerseys' && (
            <span className="px-3 py-1 bg-crimson-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Authentic
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px] hidden md:flex gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-white hover:bg-navy-900 hover:text-white text-navy-900 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
          <Link 
            to={`/shop/product/${product.id}`}
            className="w-12 bg-white/20 hover:bg-white text-white hover:text-navy-900 border border-white/30 hover:border-white transition-all rounded-sm flex items-center justify-center shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile quick add button */}
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="md:hidden absolute bottom-3 right-3 w-12 h-12 bg-crimson-600 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform disabled:bg-gray-400"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center p-4">
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-black uppercase tracking-tighter rotate-[-4deg] border-2 border-white shadow-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ══════════════ PRODUCT INFO ══════════════ */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 text-gold-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-[10px] font-bold text-gray-700">4.9</span>
          </div>
        </div>

        <Link to={`/shop/product/${product.id}`}>
          <h3 className="text-lg font-black text-navy-900 uppercase tracking-tight group-hover:text-crimson-600 transition-colors leading-tight mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 font-medium italic">
          {product.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
          <span className="text-xl font-black text-navy-900 tabular-nums">
            {product.price.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">FCFA</span>
          </span>
            </div>
          
          {product.sizes && (
            <div className="flex -space-x-1">
              {product.sizes.slice(0, 3).map((s, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 group-hover:border-gray-200 transition-colors">
                  {s}
                </div>
              ))}
              {product.sizes.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[9px] font-bold text-navy-900">
                  +{product.sizes.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Brand accent bottom bar */}
      <div className="h-1 w-0 group-hover:w-full bg-crimson-600 transition-all duration-500 absolute bottom-0 left-0" />
    </div>
  );
};

export default ProductCard;