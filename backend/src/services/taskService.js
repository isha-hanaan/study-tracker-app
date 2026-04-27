const Task = require('../models/Task');
const WeeklyPlan = require('../models/WeeklyPlan');

class TaskService {
  async createTask(planId, userId, taskData) {
    // Verify plan exists and belongs to user
    const plan = await WeeklyPlan.findById(planId);

    if (!plan) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }

    if (plan.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    const task = new Task({
      planId,
      userId,
      ...taskData
    });

    await task.save();

    // Add task to plan
    plan.tasks.push(task._id);
    await plan.save();

    return task;
  }

  async getTask(taskId, userId) {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    return task;
  }

  async getPlanTasks(planId, userId) {
    const plan = await WeeklyPlan.findById(planId);

    if (!plan) {
      const error = new Error('Plan not found');
      error.statusCode = 404;
      throw error;
    }

    if (plan.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    return await Task.find({ planId }).sort({ deadline: 1 });
  }

  async updateTask(taskId, userId, updateData) {
    let task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    // Handle completion
    if (updateData.status === 'completed' && !task.completedAt) {
      updateData.completedAt = new Date();
    } else if (updateData.status !== 'completed') {
      updateData.completedAt = null;
    }

    Object.assign(task, updateData);
    await task.save();

    return task;
  }

  async deleteTask(taskId, userId) {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.userId.toString() !== userId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    // Remove from plan
    await WeeklyPlan.findByIdAndUpdate(task.planId, {
      $pull: { tasks: taskId }
    });

    await Task.findByIdAndDelete(taskId);
    return { message: 'Task deleted successfully' };
  }

  async getUserTasks(userId, status = null) {
    let query = { userId };

    if (status) {
      query.status = status;
    }

    return await Task.find(query)
      .populate('planId', 'weekStartDate weekEndDate')
      .sort({ deadline: 1 });
  }
}

module.exports = new TaskService();
