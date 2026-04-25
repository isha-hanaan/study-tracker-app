const { body, validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array().map(e => ({
        field: e.param,
        message: e.msg
      }))
    });
  }
  next();
};

const authValidators = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

const planValidators = {
  createPlan: [
    body('weekStartDate')
      .isISO8601()
      .withMessage('Invalid date format'),
    body('subjects')
      .isArray()
      .withMessage('Subjects must be an array'),
    body('goals')
      .isArray()
      .withMessage('Goals must be an array')
  ],
  updatePlan: [
    body('subjects')
      .optional()
      .isArray()
      .withMessage('Subjects must be an array'),
    body('goals')
      .optional()
      .isArray()
      .withMessage('Goals must be an array')
  ]
};

const taskValidators = {
  createTask: [
    body('subject')
      .notEmpty()
      .withMessage('Subject is required')
      .trim(),
    body('description')
      .optional()
      .trim(),
    body('deadline')
      .isISO8601()
      .withMessage('Invalid deadline format'),
    body('priority')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high')
  ],
  updateTask: [
    body('subject')
      .optional()
      .notEmpty()
      .withMessage('Subject cannot be empty')
      .trim(),
    body('description')
      .optional()
      .trim(),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Invalid deadline format'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be pending, in-progress, or completed')
  ]
};

module.exports = {
  validationHandler,
  authValidators,
  planValidators,
  taskValidators
};
