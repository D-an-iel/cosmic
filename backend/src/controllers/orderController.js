import orderService from '../services/orderService.js';

class OrderController {
  async create(req, res, next) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
