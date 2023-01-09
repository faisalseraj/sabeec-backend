const mongoose = require('mongoose');

const healthformSchema = new mongoose.Schema(
  {
    project: {
      type: String
    },
    siteRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'Site'
    },
    date: {
      type: String
    },
    time: {
      type: String
    },
    client: {
      type: String
    },
    ratio: {
      type: String
    },
    refNo: {
      type: String
    },
    meterNo: {
      type: String
    },
    make: {
      type: String
    },
    meterType: {
      type: String
    },
    condition: {
      type: String
    },
    meterBody: {
      type: String
    },
    displayScreen: {
      type: String
    },
    terminalSlide: {
      type: String
    },
    terminalConnection: {
      type: String
    },
    defective: {
      type: String
    },
    installation: {
      type: String
    },
    otherCheck: [],
    remarks: {
      type: String
    },
    voltageR: {
      type: String
    },
    voltageY: {
      type: String
    },
    voltageB: {
      type: String
    },
    voltageN: {
      type: String
    },
    voltageTaken: {
      type: String
    },
    currentR: {
      type: String
    },
    currentY: {
      type: String
    },
    currentB: {
      type: String
    },
    currentN: {
      type: String
    },
    currentTaken: {
      type: String
    },
    wiringR: {
      type: String
    },
    wiringY: {
      type: String
    },
    wiringB: {
      type: String
    },
    wiringN: {
      type: String
    },
    wiringTaken: {
      type: String
    },
    comment: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Healthform = mongoose.model('Healthform', healthformSchema);
module.exports = Healthform;
