const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Site = require('../models/siteModel.js');
const moment = require('moment');
const { assign } = require('nodemailer/lib/shared');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
//{field: {＄ne: value}
exports.findSitedata = catchAsync(async (req, res) => {
  const ClientData = await Site.distinct('Client');
  const Assign = await Site.find({ FDCCode: { $ne: 'none' } });
  const UnAssign = await Site.find({ FDCCode: { $eq: 'none' } });
  const Pending = await Site.find({
    FDCCode: { $ne: 'none' },
    status: 'pending'
  });
  const Completed = await Site.find({
    FDCCode: { $ne: 'none' },
    status: 'completed'
  });
  const Redo = await Site.find({ FDCCode: { $ne: 'none' }, status: 'redo' });
  const SiteIdData = await Site.distinct('SiteID');
  const DISCOData = await Site.distinct('DISCO');
  const CircleData = await Site.distinct('Circle');
  const DivisionData = await Site.distinct('Division');
  const SubDivisionData = await Site.distinct('SubDivision');
  const meterReaderData = await Site.distinct('FDCName');
  res.status(201).json({
    status: 'success',
    data: {
      datawewant: ClientData,
      ClientData: ClientData,
      SiteIdData: SiteIdData.length,
      DISCOData: DISCOData,
      CircleData: CircleData,
      DivisionData: DivisionData,
      SubDivisionData: SubDivisionData,
      meterReaderData: meterReaderData.length,
      assign: Assign.length,
      Unassign: UnAssign.length,
      pending: Pending.length,
      completed: Completed.length,
      redo: Redo.length
    }
  });
});
exports.allData = catchAsync(async (req, res) => {
  const { DISCO, Circle, Division, SubDivision, search } = req.query;
  // console.log(req.query);
  const queryObject = {};
  if (DISCO) {
    queryObject.DISCO = DISCO;
  }
  if (Circle) {
    queryObject.Circle = Circle;
  }
  if (Division) {
    queryObject.Division = Division;
  }
  if (SubDivision) {
    queryObject.SubDivision = SubDivision;
  }
  if (search) {
    queryObject.SiteID = { $regex: search, $options: 'i' };
  }
  let result = await Site.find(queryObject);

  // const allData = await Data.find({});
  res.status(200).json({
    status: 'success',
    length: result.length,
    data: {
      result
    }
  });
});

exports.readerData = catchAsync(async (req, res, next) => {
  const { code } = req.params;
  const readerData = await Site.find({ FDCCode: code });
  res.status(200).json({
    status: 'success',
    readerData
  });
});
exports.loginUserData = catchAsync(async (req, res, next) => {
  const loginUserData = await Site.find({ FDCCode: req.user.FDCCode });
  res.status(200).json({
    status: 'success',
    length: loginUserData.length,
    pending: loginUserData.filter(({ status }) => status === 'pending'),
    completed: loginUserData.filter(({ status }) => status === 'completed'),
    redo: loginUserData.filter(({ status }) => status === 'redo'),
    loginUserData
  });
});

exports.updateSite = catchAsync(async (req, res, next) => {
  const site = await Site.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!site) {
    return next(new AppError('No site found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      site
    }
  });
});

exports.deleteSite = async (req, res, next) => {
  try {
    const exists = await Site.findById(req.params.id);
    if (!exists) {
      res.status(404).end(JSON.stringify({ message: 'Data Not Found' }));
    } else {
      await Site.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Site Deleted Successfully'
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getStats = catchAsync(async (req, res, next) => {
  const stats = await Site.aggregate([
    // {
    //   $match: { ratingsAverage: { $gte: 4.5 } }
    // },
    {
      $group: {
        _id: { $toUpper: '$Client' },
        numOfdata: { $sum: 1 },
        Disco: { $addToSet: '$DISCO' },
        Circle: { $addToSet: '$Circle' },
        Division: { $addToSet: '$Division' },
        SubDivision: { $addToSet: '$SubDivision' },
        MeterReader: { $addToSet: '$FDCName' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.updateRecord = catchAsync(async (req, res, next) => {
  // console.log(req.body, 'siteeeeeeeeeeeid');
  // let myquery = { SiteID: {'MGJ007'} };
  // let myquery = { SiteID: { $in: ['MGJ007', 'MTBR10', 'MTLD02'] } };
  const { code } = req.params;
  let myquery = { SiteID: { $in: req.body } };
  let newvalues = {
    $set: { FDCCode: code, status: 'pending', formStatus: 'pending' }
  };
  const record = await Site.updateMany(myquery, newvalues);
  res.status(200).json({
    status: 'success',
    record: {
      record
    }
  });
});

exports.createSite = catchAsync(async (req, res, next) => {
  const site = await Site.create(req.body);

  res.status(201).json({
    status: 'success',
    site
  });
});
