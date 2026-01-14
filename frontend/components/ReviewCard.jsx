import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirmation } from '../context/ConfirmationContext.jsx';
import { API_BASE_URL } from '../constants.js';

const ReviewCard = ({ review, onEdit, onDelete, onUpdate }) => {
  const { user, token } = useAuth();
  const { confirm } = useConfirmation();
  const isOwner = user && review.user?._id === user._id;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {getInitials(review.user?.name || 'User')}
          </div>
          <div>
            <h4 className="font-bold text-brand-black">{review.user?.name || 'Anonymous'}</h4>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} readonly={true} size="sm" />
          {isOwner && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 text-gray-400 hover:text-brand-blue transition-colors rounded-lg hover:bg-blue-50"
                title="Edit review"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={async () => {
                  const confirmed = await confirm({
                    title: 'Delete Review',
                    message: 'Are you sure you want to delete this review? This action cannot be undone.',
                    confirmText: 'Delete',
                    cancelText: 'Cancel',
                    type: 'danger',
                  });
                  
                  if (confirmed) {
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/reviews/${review._id}`, {
                        method: 'DELETE',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                        },
                      });
                      if (res.ok) {
                        onDelete(review._id);
                        if (onUpdate) onUpdate();
                      }
                    } catch (err) {
                      alert('Failed to delete review');
                    }
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                title="Delete review"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed">{review.review}</p>
    </div>
  );
};

export default ReviewCard;

