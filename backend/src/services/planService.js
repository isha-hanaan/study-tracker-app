const WeeklyPlan = require('../models/WeeklyPlan');
const Task = require('../models/Task');

class PlanService {
  async createPlan(userId, weekStartDate, subjects, goals) {
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Check if plan already exists for this week
    const existingPlan = await WeeklyPlan.findOne({
      userId,
      weekStartDate: { $lte: weekStart },
      weekEndDate: { $gte: weekStart }
    });

    if (existingPlan) {
      const error = new Error('Plan already exists for this week');
      error.statusCode = 400;
      throw error;
    }

    const plan = new WeeklyPlan({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      subjects,
      goals
    });

    await plan.save();
    return plan;
  }

  async getPlan(planId, userId) {
    const plan = await WeeklyPlan.findById(planId)
      .populate('tasks')
      .populate('userId', 'email');

    if (!plan) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }

    if (plan.userId._id.toString() !== userId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    return plan;
  }

  async getUserPlans(userId) {
    return await WeeklyPlan.find({ userId })
      .populate('tasks')
      .sort({ weekStartDate: -1 });
  }

  async updatePlan(planId, userId, updateData) {
    let plan = await WeeklyPlan.findById(planId);

    if (!plan) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }

    if (plan.userId.toString() !== userId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    Object.assign(plan, updateData);
    await plan.save();
    return plan;
  }

  async deletePlan(planId, userId) {
    const plan = await WeeklyPlan.findById(planId);

    if (!plan) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }

    if (plan.userId.toString() !== userId) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    // Delete all tasks in this plan
    await Task.deleteMany({ planId });

    await WeeklyPlan.findByIdAndDelete(planId);
    return { message: 'Plan deleted successfully' };
  }
}

module.exports = new PlanService();
