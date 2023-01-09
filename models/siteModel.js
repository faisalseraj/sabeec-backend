const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    Client: {
      type: String
    },
    SiteID: {
      type: String
    },
    billRef: {
      type: String
    },
    ConsumerID: {
      type: String
    },
    Batch: {
      type: String
    },
    DISCO: {
      type: String
    },
    Circle: {
      type: String
    },
    Division: {
      type: String
    },
    SubDivision: {
      type: String
    },
    SMStatus: {
      type: String
    },
    LAT: {
      type: String
    },
    LONG: {
      type: String
    },
    // FDCName: {
    //   type: String
    // },
    FDCCode: {
      type: String,
      default: 'none'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'redo'],
      default: 'pending'
    },
    DMRCode: {
      type: String
    },
    formStatus: {
      type: String,
      enum: ['pending', 'completed', 'prioritized'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const Site = mongoose.model('Site', dataSchema);
module.exports = Site;
