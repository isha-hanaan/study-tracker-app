const express = require('express');
const planController = require('../controllers/planController');
const authenticate = require('../middleware/authenticate');
const { planValidators, validationHandler } = require('../validators/validators');

const router = express.Router();

router.post(
  '/',
  authenticate,
  planValidators.createPlan,
  validationHandler,
  planController.createPlan
);

router.get('/', authenticate, planController.getUserPlans);

router.get('/:planId', authenticate, planController.getPlan);

router.put(
  '/:planId',
  authenticate,
  planValidators.updatePlan,
  validationHandler,
  planController.updatePlan
);

router.delete('/:planId', authenticate, planController.deletePlan);

module.exports = router;
