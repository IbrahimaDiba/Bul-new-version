import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products as mockProducts } from '../data/mockData';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Utilise les produits mock pour le prototype
    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    setProduct(products.find((p) => p.id === productId));
  }, [products, productId]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Produit introuvable</h1>
          <button onClick={() => navigate(-1)} className="text-crimson-500 hover:text-crimson-600">Retour à la boutique</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex items-center justify-center">
          <img src={product.image} alt={product.name} className="w-full max-w-xs rounded-lg object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-navy-900 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" /> Retour
            </button>
            <h1 className="text-3xl font-bold text-navy-900 mb-2">{product.name}</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Product Description</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-xl font-bold text-crimson-500">{product.price.toLocaleString('fr-FR')} FCFA</span>
            </div>
            {product.sizes && (
              <div className="mb-2">
                <span className="text-sm text-gray-700 font-semibold">Tailles disponibles :</span>
                <span className="ml-2 text-gray-600">{product.sizes.join(', ')}</span>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-2 flex items-center">
                <span className="text-sm text-gray-700 font-semibold mr-2">Couleurs :</span>
                <div className="flex space-x-1">
                  {product.colors.map((color: string) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded-full border border-gray-300"
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
            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                className="bg-crimson-500 hover:bg-crimson-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ajouter au panier
              </button>
              {!product.inStock && (
                <span className="ml-4 text-red-600 font-bold">Rupture de stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage; 