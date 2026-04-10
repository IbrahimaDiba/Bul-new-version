import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Fonction pour ajouter au panier
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Vérifier si le produit est déjà dans le panier
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Product Image */}
        <div className="h-64 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Quick Add Button (appears on hover) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-crimson-500 text-white py-3 flex items-center justify-center transform translate-y-full group-hover:translate-y-0 transition-transform focus:outline-none"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          <span>Quick Add</span>
        </button>
        
        {/* Team Badge */}
        {product.team && (
          <span className="absolute top-3 left-3 bg-white text-navy-900 px-2 py-1 text-sm font-medium rounded-md">
            {product.team}
          </span>
        )}
        
        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-md font-bold transform -rotate-6 text-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Product Category */}
        <div className="mb-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
        </div>
        
        {/* Product Name */}
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-navy-900 hover:text-crimson-500 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Product Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        
        {/* Product Price */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-navy-900">{product.price.toLocaleString('fr-FR')} FCFA</span>
          
          {/* Size Options - if available */}
          {product.sizes && (
            <div className="text-sm text-gray-500">
              {product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'}
            </div>
          )}
        </div>
        
        {/* Color Options - if available */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex items-center">
            <span className="text-xs text-gray-600 mr-2">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.map((color) => (
                <div 
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'navy' ? '#1a365d' :
                                    color.toLowerCase() === 'red' ? '#e53e3e' :
                                    color.toLowerCase() === 'black' ? '#000000' :
                                    color.toLowerCase() === 'white' ? '#ffffff' :
                                    color.toLowerCase() === 'green' ? '#047857' :
                                    color.toLowerCase() === 'gold' ? '#ffd700' : color
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;