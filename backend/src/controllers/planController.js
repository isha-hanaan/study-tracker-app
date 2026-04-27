const planService = require('../services/planService');

class PlanController {
  async createPlan(req, res, next) {
    try {
      const { weekStartDate, title } = req.body;
      const subjects = Array.isArray(req.body.subjects)
        ? req.body.subjects
        : String(req.body.subjects || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
      const goals = Array.isArray(req.body.goals)
        ? req.body.goals
        : String(req.body.goals || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

      if (!subjects.length) {
        const error = new Error('Please provide at least one subject');
        error.statusCode = 400;
        throw error;
      }

      if (!goals.length) {
        const error = new Error('Please provide at least one goal');
        error.statusCode = 400;
        throw error;
      }

      const plan = await planService.createPlan(
        req.user._id,
        weekStartDate,
        subjects,
        goals,
        title,
        req.body.weekEndDate
      );
      res.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async getPlan(req, res, next) {
    try {
      const plan = await planService.getPlan(req.params.planId, req.user._id);
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async getUserPlans(req, res, next) {
    try {
      const plans = await planService.getUserPlans(req.user._id);
      res.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req, res, next) {
    try {
      const plan = await planService.updatePlan(
        req.params.planId,
        req.user._id,
        req.body
      );
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req, res, next) {
    try {
      const result = await planService.deletePlan(
        req.params.planId,
        req.user._id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlanController();
