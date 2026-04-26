const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.register(email, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res) {
    res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        _id: req.user._id
      }
    });
  }
}

module.exports = new AuthController();
