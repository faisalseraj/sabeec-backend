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
  .get(healthformController.getHealthFormbySiteRef)
  .patch(healthformController.updateHealthForm);
router.route('/:id').get(healthformController.getHealthFormbyId);
module.exports = router;
