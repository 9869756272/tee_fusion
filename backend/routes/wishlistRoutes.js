const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.get('/check/:productId', checkWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;










