const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reader = require('../models/readerModel.js');
const moment = require('moment');
const multer = require('multer');
const stream = require('stream');
const path = require('path');
const { google } = require('googleapis');

const upload = multer();

const KEYFILEPATH = path.join(__dirname, 'credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
});

const uploadVideoFromMobile = async fileObject => {
  try {
    const buf = new Buffer.from(fileObject.uri, 'base64'); // Added
    const bs = new stream.PassThrough(); // Added
    bs.end(buf); // Added
    const { data } = await google.drive({ version: 'v3', auth }).files.create({
      media: {
        mimeType: 'media/mp4',
        body: bs
      },
      requestBody: {
        mimeType: 'media/mp4',

        name: fileObject.name,
        parents: ['1u-rByt3_nUt5U8JhyiWbx-DBiBIU2253']
        // parents: ['12MLP7gnxWG3FdJQhZefip0jdA761O6Ui']
      },
      fields: 'id,name'
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
    return `https://drive.google.com/uc?id=${data.id}`;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const uploadFile = async fileObject => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: 'v3', auth }).files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ['1u-rByt3_nUt5U8JhyiWbx-DBiBIU2253']
      // parents: ['12MLP7gnxWG3FdJQhZefip0jdA761O6Ui']
    },
    fields: 'id,name'
  });
  return `https://drive.google.com/uc?id=${data.id}`;
};

const uploadFileMobile = async fileObject => {
  try {
    const buf = new Buffer.from(fileObject.uri, 'base64'); // Added
    const bs = new stream.PassThrough(); // Added
    bs.end(buf); // Added
    const { data } = await google.drive({ version: 'v3', auth }).files.create({
      media: {
        mimeType: 'application/octet-stream',
        body: bs
      },
      requestBody: {
        mimeType: 'application/octet-stream',

        name: fileObject.name,
        parents: ['1u-rByt3_nUt5U8JhyiWbx-DBiBIU2253']
        // parents: ['12MLP7gnxWG3FdJQhZefip0jdA761O6Ui']
      },
      fields: 'id,name'
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
    return `https://drive.google.com/uc?id=${data.id}`;
  } catch (e) {
    console.log(e);
    return null;
  }
};

exports.uploadData = upload.any();

exports.uploadToDrive = async (req, res, next) => {
  try {
    const { files } = req;
    const images = [];
    for (let f = 0; f < files.length; f += 1) {
      const value = await uploadFile(files[f]);
      images.push(value);
    }

    res.json(images);
  } catch (f) {
    res.send(f.message);
  }
};

exports.uploadToDriveFromMobile = async (req, res, next) => {
  try {
    const { files } = req.body;
    const images = [];
    for (let f = 0; f < files.length; f += 1) {
      if (files[f] !== null && files[f] !== undefined) {
        const value = await uploadFileMobile(files[f]);
        images.push(value);
      }
    }

    res.json(images);
  } catch (f) {
    res.send(f.message);
  }
};

exports.uploadVideoToDriveFromMobile = async (req, res, next) => {
  try {
    const { files } = req.body;
    const images = [];
    for (let f = 0; f < files.length; f += 1) {
      if (files[f] !== null && files[f] !== undefined) {
        const value = await uploadVideoFromMobile(files[f]);
        images.push(value);
      }
    }

    res.json(images);
  } catch (f) {
    res.send(f.message);
  }
};

exports.getUploadDatabySiteId = async (req, res, next) => {
  const siteId = req.params.id;
  const start = moment()
    .startOf('month')
    .format();
  const end = moment()
    .endOf('month')
    .format();
  let singleUpload;
  try {
    singleUpload = await Reader.findOne({
      createdAt: { $gte: start, $lte: end },
      siteId
    });

    } catch (err) {
    return console.log(err);
  }
  if (!singleUpload) {
    return res.status(404).json({ message: 'No site Found by this reader' });
  }
  return res.status(200).json(singleUpload);
};
//previous month data
exports.getPreviousMonthSiteData = catchAsync(async (req, res, next) => {
  const siteId = req.params.id;
  const start = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format();
  const end = moment()
    .subtract(1, 'months')
    .endOf('month')
    .format();
  const filterData = await Reader.findOne({
    createdAt: { $gte: start, $lte: end },
    siteId
  });
  res.status(200).json({
    status: 'success',
    length: filterData?.length,
    filterData
  });
});

//updateUploadDatabySiteId
exports.updateUploadDatabySiteId = async (req, res, next) => {
  // const siteId = req.params.id;
  let updateUploadData;
  try {
    updateUploadData = await Reader.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  } catch (err) {
    return console.log(err);
  }
  if (!updateUploadData) {
    return res.status(404).json({ message: 'No site Found by this upload' });
  }
  return res.status(200).json(updateUploadData);
};

exports.createUploadData = catchAsync(async (req, res, next) => {
  const data = await Reader.create(req.body);

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.getAllUploadData = catchAsync(async (req, res, next) => {
  console.log(req.body.Fromdate);
  let upload;
  if (req.user.role === 'admin') {
    const start = moment(req.body.Fromdate).format();
    const end = moment(req.body.Todate).format();
    upload = await Reader.find({ createdAt: { $gte: start, $lte: end } });
  } else {
    const start = moment()
      .startOf('month')
      .format();
    const end = moment()
      .endOf('month')
      .format();
    upload = await Reader.find({
      createdAt: { $gte: start, $lte: end },
      DATA_COLLECTOR_CODE: req.user.FDCCode
    });
  }
  res.status(200).json({
    status: 'success',
    length: upload.length,
    upload
  });
});
// exports.getAllUploadData = catchAsync(async (req, res, next) => {
//   const start = moment(req.body.Fromdate).format();
//   const end = moment(req.body.Todate).format();
//   let upload;

//   upload = await Reader.find({ createdAt: { $gte: start, $lte: end } });

//   res.status(200).json({
//     status: 'success',
//     length: upload.length,
//     upload
//   });
// });
