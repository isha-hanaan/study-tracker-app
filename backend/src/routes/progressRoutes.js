const express = require('express');
const progressController = require('../controllers/progressController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/stats', authenticate, progressController.getStats);
router.get('/weekly', authenticate, progressController.getWeeklyProgress);
router.get('/subjects', authenticate, progressController.getSubjectAnalytics);
router.get('/trends', authenticate, progressController.getTrendData);

module.exports = router;
