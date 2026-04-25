const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const { taskValidators, validationHandler } = require('../validators/validators');

const router = express.Router();

router.post(
  '/plan/:planId',
  authenticate,
  taskValidators.createTask,
  validationHandler,
  taskController.createTask
);

router.get('/', authenticate, taskController.getUserTasks);

router.get('/plan/:planId', authenticate, taskController.getPlanTasks);

router.get('/:taskId', authenticate, taskController.getTask);

router.put(
  '/:taskId',
  authenticate,
  taskValidators.updateTask,
  validationHandler,
  taskController.updateTask
);

router.delete('/:taskId', authenticate, taskController.deleteTask);

module.exports = router;
