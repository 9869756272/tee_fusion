import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="relative h-80 overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-black uppercase tracking-wider">
            {product.category}
          </div>
          {product.featured && (
            <div className="absolute top-4 left-4 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold">
              Featured
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-black text-brand-black mb-1 group-hover:text-brand-blue transition-colors">
                {product.name}
              </h3>
              {product.color && (
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: product.color }}
                  ></span>
                  <span className="text-xs text-gray-500 font-mono">{product.color}</span>
                </div>
              )}
            </div>
            <span className="text-lg font-black text-brand-black">
              Rs. {product.price?.toFixed(2) || product.price}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-xs text-gray-500">
                {product.sizes.length} sizes
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
