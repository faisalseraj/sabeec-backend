const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
  '/updateUserStatus',
  authController.protect,
  userController.updateUserStatus
);
// router.route('/userStats').get(protect, getUserStats)
router.get('/userStats', authController.protect, userController.getUserStats);
router.get('/getAllUsers', authController.protect, userController.getAllUsers);
router.get('/getMe', authController.protect, userController.getMe);

router.post('/findUser', authController.findUser);
router.post('/sendResetPasswordCode', authController.sendResetPasswordCode);
router.post('/validateResetCode', authController.validateResetCode);
router.post('/changePassword', authController.changePassword);

router.patch('/updateUser/:id', userController.updateUser);
router.delete('/deleteUser/:id', userController.deleteUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
