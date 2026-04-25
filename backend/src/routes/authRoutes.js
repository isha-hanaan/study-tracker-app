const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authValidators, validationHandler } = require('../validators/validators');

const router = express.Router();

router.post('/register', authValidators.register, validationHandler, authController.register);
router.post('/login', authValidators.login, validationHandler, authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
