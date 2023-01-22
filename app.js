const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const multer = require('multer');
const cors = require('cors');
const Reader = require('./models/readerModel');
const XLSX = require('xlsx');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const siteRouter = require('./routes/siteRoutes');
const readerRouter = require('./routes/readerRoutes');
const healthfromRouter = require('./routes/healthformRoutes');

const uploadXLSX = require('./utils/uploadXLSX');
const app = express();

const uploadXLSX2 = async (req, res, next) => {
  try {
    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'xml sheet has no data'
      });
    }
    let savedData = await Reader.create(jsonData);

    return res.status(201).json({
      success: true,
      message: savedData.length + ' rows added to the database'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(file, 'file in destination');
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    console.log(file, 'file in filenam');
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10000kb' }));

app.use('*', cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES


app.use('/api/v1/users', userRouter);
app.use('/api/v1/site', siteRouter);
app.use('/api/v1/reader', readerRouter);
app.use('/api/v1/healthform', healthfromRouter);
app.post('/upload', upload.single('xlsx'), uploadXLSX);
app.post('/readerUpload', upload.single('xlsx'), uploadXLSX2);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
