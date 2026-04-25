const taskService = require('../services/taskService');

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(
        req.params.planId,
        req.user._id,
        req.body
      );
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getTask(req, res, next) {
    try {
      const task = await taskService.getTask(req.params.taskId, req.user._id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async getPlanTasks(req, res, next) {
    try {
      const tasks = await taskService.getPlanTasks(
        req.params.planId,
        req.user._id
      );
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(
        req.params.taskId,
        req.user._id,
        req.body
      );
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(
        req.params.taskId,
        req.user._id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserTasks(req, res, next) {
    try {
      const { status } = req.query;
      const tasks = await taskService.getUserTasks(req.user._id, status);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
