const progressService = require('../services/progressService');

class ProgressController {
  async getStats(req, res, next) {
    try {
      const stats = await progressService.getProgressStats(req.user._id);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getWeeklyProgress(req, res, next) {
    try {
      const { weekStartDate } = req.query;

      if (!weekStartDate) {
        return res.status(400).json({
          message: 'weekStartDate query parameter is required'
        });
      }

      const progress = await progressService.getWeeklyProgress(
        req.user._id,
        weekStartDate
      );
      res.status(200).json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getSubjectAnalytics(req, res, next) {
    try {
      const analytics = await progressService.getSubjectAnalytics(req.user._id);
      res.status(200).json(analytics);
    } catch (error) {
      next(error);
    }
  }

  async getTrendData(req, res, next) {
    try {
      const { daysBack = 30 } = req.query;
      const trends = await progressService.getTrendData(
        req.user._id,
        parseInt(daysBack)
      );
      res.status(200).json(trends);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProgressController();
