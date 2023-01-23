const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const readerController = require('../controllers/readerController');

router
  .route('/uploadToDrive')
  .post(readerController.uploadData, readerController.uploadToDrive);
router
  .route('/uploadToDriveFromMobile')
  .post(readerController.uploadData, readerController.uploadToDriveFromMobile);
router.route('/uploadData').post(readerController.createUploadData);
router
  .route('/getuploadDataByRange')
  .post(authController.protect, readerController.getAllUploadData);

router
  .route('/uploadData/:id')
  .get(authController.protect, readerController.getUploadDatabySiteId)
  .patch(authController.protect, readerController.updateUploadDatabySiteId);
router
  .route('/getPreviousMonthSiteData/:id')
  .get(readerController.getPreviousMonthSiteData);
module.exports = router;
