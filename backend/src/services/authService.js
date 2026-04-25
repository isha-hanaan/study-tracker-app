const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async register(email, password) {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create new user
    user = new User({
      email,
      password
    });

    await user.save();

    const token = this.generateToken(user._id);
    return {
      token,
      user: {
        id: user._id,
        email: user.email
      }
    };
  }

  async login(email, password) {
    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user._id);
    return {
      token,
      user: {
        id: user._id,
        email: user.email
      }
    };
  }
}

module.exports = new AuthService();
