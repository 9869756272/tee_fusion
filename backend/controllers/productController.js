const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, search } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by color (check if any colorVariant matches)
    if (color && color !== 'all') {
      query['colorVariants.color'] = color;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    // Convert sizeStock objects to Maps if needed
    if (req.body.colorVariants) {
      req.body.colorVariants = req.body.colorVariants.map(variant => {
        if (variant.sizeStock && typeof variant.sizeStock === 'object' && !(variant.sizeStock instanceof Map)) {
          const sizeStockMap = new Map();
          Object.entries(variant.sizeStock).forEach(([size, qty]) => {
            sizeStockMap.set(size, qty);
          });
          variant.sizeStock = sizeStockMap;
        }
        return variant;
      });
    }
    
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Convert sizeStock objects to Maps if needed
      if (req.body.colorVariants) {
        req.body.colorVariants = req.body.colorVariants.map(variant => {
          if (variant.sizeStock && typeof variant.sizeStock === 'object' && !(variant.sizeStock instanceof Map)) {
            const sizeStockMap = new Map();
            Object.entries(variant.sizeStock).forEach(([size, qty]) => {
              sizeStockMap.set(size, qty);
            });
            variant.sizeStock = sizeStockMap;
          }
          return variant;
        });
      }
      
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product colors
// @route   GET /api/products/colors/list
// @access  Public
const getColors = async (req, res) => {
  try {
    const products = await Product.find({}, 'colorVariants');
    const colors = [...new Set(
      products.flatMap(p => p.colorVariants?.map(v => v.color) || [])
    )];
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getColors
};
