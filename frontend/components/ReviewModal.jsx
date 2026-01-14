import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL } from '../constants.js';

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmitted, editReview = null }) => {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(editReview?.rating || 0);
  const [review, setReview] = useState(editReview?.review || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update state when editReview changes
  React.useEffect(() => {
    if (editReview) {
      setRating(editReview.rating);
      setReview(editReview.review);
    } else {
      setRating(0);
      setReview('');
    }
  }, [editReview]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!review.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = editReview 
        ? `${API_BASE_URL}/api/reviews/${editReview._id}`
        : `${API_BASE_URL}/api/reviews`;
      const method = editReview ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(editReview ? {} : { productId }),
          rating,
          review: review.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${editReview ? 'update' : 'submit'} review`);
      }

      // Reset form
      setRating(0);
      setReview('');
      onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${editReview ? 'update' : 'submit'} review`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-brand-black">
              {editReview ? 'Edit Review' : 'Write a Review'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-brand-black transition-colors rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Your Rating *
              </label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                readonly={false}
                size="lg"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Your Review *
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none transition-all"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                {review.length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0 || !review.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  editReview ? 'Update Review' : 'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

