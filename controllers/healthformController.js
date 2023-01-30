const Healthform = require('../models/healthformModel.js');
const catchAsync = require('../utils/catchAsync.js');
const moment = require('moment');
var mongoose = require('mongoose');
exports.createHealthFormData = catchAsync(async (req, res, next) => {
  const data = await Healthform.create(req.body);

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.getHealthFormbySiteRef = async (req, res, next) => {
  const siteRef = mongoose.Types.ObjectId(req.params.id);

  const start = moment()
    .startOf('month')
    .format();
  const end = moment()
    .endOf('month')
    .format();
  let singleHealthForm;
  try {
    singleHealthForm = await Healthform.findOne({
      createdAt: { $gte: start, $lte: end },
      siteRef: siteRef
    });
  } catch (err) {
    return console.log(err);
  }
  if (!singleHealthForm) {
    return res
      .status(404)
      .json({ message: 'No Health Form Found by this Site' });
  }
  res.status(201).json({
    status: 'success',
    singleHealthForm
  });
};
// exports.getallHealthFormByMonth = async (req, res, next) => {
//   const start = moment(req.body.Fromdate).format();
//   const end = moment(req.body.Todate).format();
//   let healthForm;
//   try {
//     healthForm = await Healthform.find({
//       createdAt: { $gte: start, $lte: end }
//     }).populate('siteRef', {
//       DISCO: 1,
//       SiteID: 1,
//       Circle: 1,
//       Division: 1,
//       SubDivision: 1
//     });
//   } catch (err) {
//     return console.log(err);
//   }
//   if (!healthForm) {
//     return res
//       .status(404)
//       .json({ message: 'No Health Form Found by this Site' });
//   }
//   res.status(201).json({
//     status: 'success',
//     length: healthForm.length,
//     healthForm
//   });
// };
exports.getallHealthFormByMonth = async (req, res, next) => {
  const start = moment(req.body.Fromdate).format();
  const end = moment(req.body.Todate).format();
  let healthForm;
  try {
    healthForm = await Healthform.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('siteRef', {
      DISCO: 1,
      SiteID: 1,
      Circle: 1,
      Division: 1,
      SubDivision: 1
    });
  } catch (err) {
    return console.log(err);
  }
  if (!healthForm) {
    return res
      .status(404)
      .json({ message: 'No Health Form Found by this Site' });
  }
  res.status(201).json({
    status: 'success',
    length: healthForm.length,
    healthForm
  });
};

exports.updateHealthForm = catchAsync(async (req, res, next) => {
  const updatedForm = await Healthform.findOneAndUpdate(
    { siteRef: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedForm) {
    return next(new AppError('No form found with that Site ID', 404));
  }

  res.status(200).json({
    status: 'success',
    updatedForm
  });
});
