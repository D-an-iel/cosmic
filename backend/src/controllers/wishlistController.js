import wishlistService from '../services/wishlistService.js';

class WishlistController {
  async add(req, res, next) {
    try {
      const { productId } = req.body;
      const result = await wishlistService.addToWishlist(req.user.id, productId);

      if (result.isDuplicate) {
        return res.status(200).json({
          success: true,
          message: 'Product is already in your wishlist',
          data: result.item,
        });
      }

      res.status(201).json({
        success: true,
        message: 'Product added to wishlist',
        data: result.item,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const wishlist = await wishlistService.getUserWishlist(req.user.id);
      res.status(200).json({
        success: true,
        data: wishlist,
        count: wishlist.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await wishlistService.removeFromWishlist(req.user.id, productId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WishlistController();
