const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      console.log('[AUTH] Register attempt:', req.body.email);
      const { email, password } = req.body;
      const result = await authService.register(email, password);
      console.log('[AUTH] Register successful:', email);
      res.status(201).json(result);
    } catch (error) {
      console.error('[AUTH] Register error:', error.message);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      console.log('[AUTH] Login attempt:', req.body.email);
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      console.log('[AUTH] Login successful:', email);
      res.status(200).json(result);
    } catch (error) {
      console.error('[AUTH] Login error:', error.message);
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      console.log('[AUTH] Get current user:', req.user.email);
      res.status(200).json({
        user: {
          id: req.user._id,
          email: req.user.email,
          _id: req.user._id
        }
      });
    } catch (error) {
      console.error('[AUTH] Get current user error:', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
