import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { products } from '../../data/mockData';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-navy-900">Featured Merchandise</h2>
          <Link 
            to="/shop" 
            className="text-crimson-500 hover:text-crimson-600 font-semibold flex items-center transition-colors"
          >
            Visit Shop
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {product.team && (
                  <span className="absolute top-3 left-3 text-xs bg-white text-navy-900 px-2 py-1 rounded-md font-medium">
                    {product.team}
                  </span>
                )}
              </div>

              <div className="p-4">
                <Link to={`/shop/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-navy-900 hover:text-crimson-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-navy-900">
                    {product.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  <button className="bg-crimson-500 hover:bg-crimson-600 text-white p-2 rounded-md transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;