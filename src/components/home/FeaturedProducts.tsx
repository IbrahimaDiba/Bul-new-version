import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Product, Team } from '../../types';
import { ADMIN_CONTENT_EVENT, getManagedProducts, getManagedTeams } from '../../data/adminContent';
import ProductModal from './ProductModal';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getTeamName = (teamId?: string): string | null => {
    if (!teamId) return null;
    const team = teams.find(t => t.id === teamId);
    // If team not found, check if it's already a name (not a UUID)
    if (!team) return teamId.includes('-') ? null : teamId;
    return team.name;
  };

  useEffect(() => {
    const reload = () => {
      setProducts(getManagedProducts());
      setTeams(getManagedTeams());
    };
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener(ADMIN_CONTENT_EVENT, reload);
    return () => {
      window.removeEventListener('storage', reload);
      window.removeEventListener(ADMIN_CONTENT_EVENT, reload);
    };
  }, []);

  const featuredProducts = [...products]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 4);

  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-12">
            <div>
              <span className="text-crimson-600 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Official Store</span>
              <h2 className="text-4xl sm:text-5xl font-black text-navy-900 uppercase tracking-tight leading-none">Featured Merchandise</h2>
            </div>
            <Link
              to="/shop"
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-navy-900 border border-navy-900/20 bg-navy-900/5 hover:bg-navy-900 hover:text-white px-6 py-3 transition-colors shrink-0"
            >
              Visit Shop
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-[4/3] sm:aspect-auto sm:h-52 lg:h-56 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {getTeamName(product.team) && (
                    <span className="absolute top-3 left-3 text-xs bg-white text-navy-900 px-2 py-1 rounded-md font-medium shadow-sm">
                      {getTeamName(product.team)}
                    </span>
                  )}
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                      Voir le produit
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-navy-900 group-hover:text-crimson-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-navy-900">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="bg-crimson-500 hover:bg-crimson-600 text-white p-2 rounded-md transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product detail modal */}
      <ProductModal
        product={selectedProduct}
        teamName={selectedProduct ? getTeamName(selectedProduct.team) : null}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default FeaturedProducts;