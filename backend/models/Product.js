const mongoose = require('mongoose');

const colorVariantSchema = mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  sizeStock: {
    type: Map,
    of: Number,
    default: {},
  },
}, { _id: false });

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Basics', 'Streetwear', 'Premium', 'Limited Edition'],
    default: 'Basics',
  },
  colorVariants: {
    type: [colorVariantSchema],
    required: true,
    default: [],
  },
  availableSizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  image: {
    type: String,
    required: true,
  },
  modelPath: {
    type: String,
    default: '/tshirt.glb',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

// Virtual for total stock (sum of all color variants)
productSchema.virtual('stock').get(function() {
  return this.colorVariants.reduce((total, variant) => {
    if (variant.sizeStock && variant.sizeStock.size > 0) {
      return total + Array.from(variant.sizeStock.values()).reduce((sum, qty) => sum + qty, 0);
    }
    return total + (variant.stock || 0);
  }, 0);
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
