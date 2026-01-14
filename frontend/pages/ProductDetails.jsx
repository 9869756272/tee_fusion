import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { API_BASE_URL } from '../constants.js';
import StarRating from '../components/StarRating.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import ReviewModal from '../components/ReviewModal.jsx';

const MOCK_PRODUCTS = [
  {
    _id: "1",
    name: "Classic White Tee",
    price: 29.99,
    description: "The essential white t-shirt. Made from 100% organic heavyweight cotton.",
    stock: 100,
    category: "Basics",
    color: "#FFFFFF",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb"
  },
  {
    _id: "2",
    name: "Midnight Black Tee",
    price: 34.99,
    description: "Deep, rich black dye that resists fading. Minimalist and sleek.",
    stock: 85,
    category: "Basics",
    color: "#111111",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb"
  },
  {
    _id: "3",
    name: "Urban Blue Tee",
    price: 32.99,
    description: "A vibrant blue hue inspired by city lights. Modern cut.",
    stock: 50,
    category: "Streetwear",
    color: "#3B82F6",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    modelPath: "/tshirt.glb"
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        if (data.availableSizes && data.availableSizes.length > 0) {
          setSelectedSize(data.availableSizes[0]);
        }
      } catch (err) {
        console.warn("Backend unreachable, utilizing Mock Data.");
        const mock = MOCK_PRODUCTS.find(p => p._id === id);
        if (mock) {
          setProduct(mock);
          if (mock.sizes && mock.sizes.length > 0) {
            setSelectedSize(mock.sizes[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      setLoadingReviews(true);
      try {
        // Fetch rating data
        const ratingRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}/rating`);
        if (ratingRes.ok) {
          const ratingData = await ratingRes.json();
          setRatingData(ratingData);
        }

        // Fetch reviews (first 4)
        const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}?limit=4`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
        }
      } catch (err) {
        console.warn('Failed to fetch reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleReviewSubmitted = async () => {
    // Refresh reviews after submission
    try {
      const ratingRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}/rating`);
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        setRatingData(ratingData);
      }

      const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}?limit=4`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (err) {
      console.warn('Failed to refresh reviews:', err);
    }
  };

  const handleViewAllReviews = async () => {
    if (showAllReviews) {
      setShowAllReviews(false);
      return;
    }

    try {
      const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}?limit=100`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
        setShowAllReviews(true);
      }
    } catch (err) {
      console.warn('Failed to fetch all reviews:', err);
    }
  };

  const handleAddToCart = () => {
    const sizes = product.availableSizes || product.sizes || [];
    if (!selectedSize && sizes.length > 0) {
      showToast('Please select a size', 'warning');
      return;
    }
    addToCart(product, 1);
    showToast('Added to cart', 'success');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-brand-black mb-4">Product not found</h2>
          <Link to="/shop" className="text-brand-blue hover:text-purple-600 font-medium">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-100 h-[500px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-brand-blue tracking-wide uppercase mb-2">
                {product.category}
              </h2>
              <h1 className="text-4xl font-black text-brand-black mb-4">{product.name}</h1>
              <p className="text-2xl font-black text-brand-black">Rs. {product.price.toFixed(2)}</p>
            </div>

            <div className="prose text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Color Display */}
            {product.color && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: product.color }}
                  ></div>
                  <span className="text-sm text-gray-600 font-mono">{product.color}</span>
                </div>
              </div>
            )}

            {/* Rating Display */}
            {ratingData && ratingData.totalReviews > 0 && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(ratingData.averageRating)} readonly={true} size="md" />
                  <span className="text-lg font-bold text-brand-black">
                    {ratingData.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({ratingData.totalReviews} {ratingData.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}

            {/* Size Selection */}
            {(product.availableSizes || product.sizes) && (product.availableSizes || product.sizes).length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {(product.availableSizes || product.sizes).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-brand-blue text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Stock:</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {user && (
                <button
                  onClick={async () => {
                    try {
                      if (isInWishlist(product._id)) {
                        await removeFromWishlist(product._id);
                        showToast('Removed from wishlist', 'info');
                      } else {
                        await addToWishlist(product._id);
                        showToast('Added to wishlist', 'success');
                      }
                    } catch (err) {
                      showToast(err.message || 'Failed to update wishlist', 'error');
                    }
                  }}
                  className={`px-6 py-4 rounded-full font-bold transition-all border-2 ${
                    isInWishlist(product._id)
                      ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-400 text-center sm:text-left">
              Free shipping on all customized orders over Rs. 100.
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-brand-black mb-2">Customer Reviews</h2>
              {ratingData && ratingData.totalReviews > 0 && (
                <div className="flex items-center gap-3">
                  <StarRating rating={Math.round(ratingData.averageRating)} readonly={true} size="md" />
                  <span className="text-lg font-bold text-brand-black">
                    {ratingData.averageRating.toFixed(1)} out of 5
                  </span>
                  <span className="text-sm text-gray-500">
                    ({ratingData.totalReviews} {ratingData.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
            {user ? (
              <button
                onClick={() => {
                  setEditReview(null);
                  setIsReviewModalOpen(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Write a Review
              </button>
            ) : (
              <Link to="/login">
                <button className="px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Login to Review
                </button>
              </Link>
            )}
          </div>

          {loadingReviews ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
              {user ? (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Write a Review
                </button>
              ) : (
                <Link to="/login">
                  <button className="px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                    Login to Review
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {reviews.slice(0, showAllReviews ? reviews.length : 4).map((review) => (
                  <ReviewCard 
                    key={review._id} 
                    review={review}
                    onEdit={(review) => {
                      setEditReview(review);
                      setIsReviewModalOpen(true);
                    }}
                    onDelete={(reviewId) => {
                      setReviews(reviews.filter(r => r._id !== reviewId));
                      handleReviewSubmitted();
                    }}
                    onUpdate={handleReviewSubmitted}
                  />
                ))}
              </div>

              {reviews.length > 4 && !showAllReviews && (
                <div className="text-center">
                  <button
                    onClick={handleViewAllReviews}
                    className="px-8 py-3 border-2 border-brand-black text-brand-black rounded-full font-bold hover:bg-brand-black hover:text-white transition-all"
                  >
                    View All Reviews
                  </button>
                </div>
              )}

              {showAllReviews && reviews.length > 4 && (
                <div className="text-center">
                  <button
                    onClick={handleViewAllReviews}
                    className="px-8 py-3 border-2 border-brand-black text-brand-black rounded-full font-bold hover:bg-brand-black hover:text-white transition-all"
                  >
                    Show Less
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setEditReview(null);
        }}
        productId={id}
        onReviewSubmitted={handleReviewSubmitted}
        editReview={editReview}
      />
    </div>
  );
};

export default ProductDetails;
