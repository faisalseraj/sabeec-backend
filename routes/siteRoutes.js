const express = require('express');
const router = express.Router();
const siteController = require('./../controllers/siteController');
const authController = require('./../controllers/authController');

router
  .route('/')
  .get(siteController.findSitedata)
  .post(siteController.createSite);
router.route('/updateSite/:id').patch(siteController.updateSite);
router.route('/deleteSite/:id').delete(siteController.deleteSite);
router.route('/updateMany/:code').patch(siteController.updateRecord);
router.route('/alldata').get(siteController.allData);
router.route('/readerStatus/:code').get(siteController.readerData);

router
  .route('/loginUserData')
  .get(authController.protect, siteController.loginUserData);

module.exports = router;
