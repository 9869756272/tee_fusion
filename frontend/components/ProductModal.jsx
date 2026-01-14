import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Basics',
    image: '',
    featured: false,
    tags: '',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colorVariants: []
  });

  useEffect(() => {
    if (product) {
      // Convert sizeStock Maps to objects for form handling
      const colorVariants = (product.colorVariants || []).map(variant => ({
        ...variant,
        sizeStock: variant.sizeStock instanceof Map 
          ? Object.fromEntries(variant.sizeStock)
          : (variant.sizeStock || {})
      }));

      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        description: product.description || '',
        category: product.category || 'Basics',
        image: product.image || '',
        featured: product.featured || false,
        tags: product.tags?.join(', ') || '',
        availableSizes: product.availableSizes || ['S', 'M', 'L', 'XL', 'XXL'],
        colorVariants: colorVariants
      });
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Basics',
      image: '',
      featured: false,
      tags: '',
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colorVariants: []
    });
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size]
    }));
  };

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      colorVariants: [
        ...prev.colorVariants,
        {
          color: '#FFFFFF',
          image: '',
          stock: 0,
          sizeStock: {}
        }
      ]
    }));
  };

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter((_, i) => i !== index)
    }));
  };

  const updateColorVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const updateSizeStock = (variantIndex, size, quantity) => {
    setFormData(prev => {
      const newVariants = [...prev.colorVariants];
      const variant = { ...newVariants[variantIndex] };
      
      if (!variant.sizeStock) {
        variant.sizeStock = {};
      }
      
      const newSizeStock = { ...variant.sizeStock };
      if (quantity === '' || quantity === 0) {
        delete newSizeStock[size];
      } else {
        newSizeStock[size] = parseInt(quantity) || 0;
      }
      
      variant.sizeStock = newSizeStock;
      variant.stock = Object.values(newSizeStock).reduce((sum, qty) => sum + qty, 0);
      
      newVariants[variantIndex] = variant;
      return { ...prev, colorVariants: newVariants };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      colorVariants: formData.colorVariants.map(variant => ({
        color: variant.color,
        image: variant.image || formData.image,
        stock: variant.stock || 0,
        sizeStock: variant.sizeStock || {}
      }))
    };

    onSave(productData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-brand-black">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-brand-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="e.g., Classic White Tee"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="Basics">Basics</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Premium">Premium</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Default Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="Product description..."
                />
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">Available Sizes</label>
                <div className="flex gap-2 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        formData.availableSizes.includes(size)
                          ? 'bg-brand-blue text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Variants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-bold text-gray-700">Color Variants</label>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                  >
                    + Add Color
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.colorVariants.map((variant, variantIndex) => (
                    <div key={variantIndex} className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-brand-black">Color Variant {variantIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeColorVariant(variantIndex)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={variant.color}
                              onChange={(e) => updateColorVariant(variantIndex, 'color', e.target.value)}
                              className="w-12 h-10 border-2 border-gray-200 rounded-xl cursor-pointer"
                            />
                            <input
                              type="text"
                              value={variant.color}
                              onChange={(e) => updateColorVariant(variantIndex, 'color', e.target.value)}
                              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">Image URL (optional)</label>
                          <input
                            type="url"
                            value={variant.image}
                            onChange={(e) => updateColorVariant(variantIndex, 'image', e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="Leave empty to use default"
                          />
                        </div>
                      </div>

                      {/* Size Stock for this color */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-3">Stock per Size</label>
                        <div className="grid grid-cols-5 gap-2">
                          {formData.availableSizes.map(size => (
                            <div key={size}>
                              <label className="block text-xs text-gray-600 mb-1">{size}</label>
                              <input
                                type="number"
                                min="0"
                                value={variant.sizeStock?.[size] || ''}
                                onChange={(e) => updateSizeStock(variantIndex, size, e.target.value)}
                                className="w-full px-2 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="0"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Total stock for this color: <span className="font-bold text-brand-black">{variant.stock || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.colorVariants.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-sm text-gray-500 mb-4">No color variants added yet</p>
                      <button
                        type="button"
                        onClick={addColorVariant}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                      >
                        + Add First Color Variant
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags and Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., classic, premium, cotton"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
              >
                {product ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

