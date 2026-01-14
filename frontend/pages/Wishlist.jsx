import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { confirm } = useConfirmation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-brand-black mb-8">My Wishlist</h1>
          <div className="bg-white rounded-2xl p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-black text-brand-black mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Start adding products you love to your wishlist!</p>
            <Link to="/shop">
              <button className="px-8 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-brand-black">My Wishlist</h1>
          <span className="text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Remove from Wishlist',
                    message: `Are you sure you want to remove "${product.name}" from your wishlist?`,
                    confirmText: 'Remove',
                    cancelText: 'Cancel',
                    type: 'warning',
                  });
                  if (confirmed) {
                    removeFromWishlist(product._id);
                  }
                }}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                title="Remove from wishlist"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

