import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Check, Tag, Shirt } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  product: Product | null;
  teamName?: string | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, teamName, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setIsAdded(false);
    }
  }, [product]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(
      (item: any) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1, selectedSize, selectedColor });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const colorMap: Record<string, string> = {
    navy: '#1a365d',
    red: '#c41e3a',
    black: '#000000',
    white: '#ffffff',
    green: '#047857',
    gold: '#ffd700',
    gray: '#6b7280',
    blue: '#2563eb',
    orange: '#ea580c',
    purple: '#7c3aed',
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
    >
      {/* Modal panel */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        {/* ── LEFT: Image ── */}
        <div className="w-full md:w-[45%] bg-gray-50 flex items-center justify-center p-10 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 md:h-full object-contain mix-blend-multiply drop-shadow-lg"
            style={{ maxHeight: '420px' }}
          />
        </div>

        {/* ── RIGHT: Details ── */}
        <div className="flex flex-col gap-5 p-8 overflow-y-auto flex-1">
          {/* Category & badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-bold text-crimson-600 uppercase tracking-widest bg-crimson-50 px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>
            {teamName && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-navy-700 uppercase tracking-widest bg-navy-50 px-2.5 py-1 rounded-full">
                <Shirt className="w-3 h-3" />
                {teamName}
              </span>
            )}
            {product.isNew && (
              <span className="text-[10px] font-black text-white bg-emerald-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                New
              </span>
            )}
            {!product.inStock && (
              <span className="text-[10px] font-black text-white bg-gray-500 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Sold Out
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 uppercase tracking-tight leading-tight">
            {product.name}
          </h2>

          {/* Price */}
          <p className="text-2xl font-bold text-navy-900">
            {product.price.toLocaleString('fr-FR')}{' '}
            <span className="text-sm font-semibold text-gray-400">FCFA</span>
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-3">
                Taille : <span className="text-crimson-600">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 rounded-full border text-sm font-bold transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-navy-900 border-navy-900 text-white shadow'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-navy-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-3">
                Couleur : <span className="text-crimson-600">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-200 shadow-sm ${
                      selectedColor === color
                        ? 'border-navy-900 scale-110'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor:
                        colorMap[color.toLowerCase()] ?? color,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                product.inStock
                  ? isAdded
                    ? 'bg-emerald-500 text-white scale-[1.01]'
                    : 'bg-crimson-600 hover:bg-crimson-700 text-white hover:scale-[1.02] shadow-lg shadow-crimson-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
