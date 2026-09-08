import authService from '../services/authService.js';

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req, res, next) {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required',
        });
      }
      const result = await authService.sendOtp(phone);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { phone, code } = req.body;
      if (!phone || !code) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and code are required',
        });
      }
      const result = await authService.verifyOtp(phone, code);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
