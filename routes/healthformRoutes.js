const express = require('express');
const router = express.Router();
const healthformController = require('./../controllers/healthformController');

router
  .route('/')
  // .get(tourController.getAllTours)
  .post(healthformController.createHealthFormData);
router.route('/monthwise').post(healthformController.getallHealthFormByMonth);
router
  .route('/:id')
  .post(healthformController.getHealthFormbySiteRef)
  .get(healthformController.getHealthFormbySiteRefbyReader)
  .patch(healthformController.updateHealthForm);

module.exports = router;
