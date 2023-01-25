const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Site = require('../models/siteModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users
//     }
//   });
// });
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    user
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: doc
  });
});

// exports.getAllUsers = factory.getAll(User);
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('you are not authorize for this operation', 401));
  }
  const users = await User.find();
  res
    .status(200)
    .json({ length: users.length, users: users, message: 'success' });
});

exports.updateUserStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  const { userId, status } = req.body;
  if (!userId && !status) {
    return next(new AppError('userId and status is missing', 403));
  }
  const updateUser = await User.findByIdAndUpdate(
    userId,
    { status },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json(updateUser);
});

exports.getUserStats = catchAsync(async (req, res, next) => {
  const stats = await Site.aggregate([
    {
      $match: { FDCCode: req.user.FDCCode }
    },
    {
      $group: {
        _id: { $toUpper: '$FDCCode' },
        // totalSites: { $sum: 1 },
        totalSites: { $addToSet: '$SiteID' },
        Disco: { $addToSet: '$DISCO' },
        Circle: { $addToSet: '$Circle' },
        Division: { $addToSet: '$Division' },
        SubDivision: { $addToSet: '$SubDivision' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    stats
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /singup instead'
  });
};
// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };

//Note do not update password with
exports.updateUser = factory.updateOne(User);
// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!'
//   });
// };
exports.deleteUser = factory.deleteOne(User);
