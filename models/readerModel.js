const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema(
  {
    client: {
      type: String
    },
    siteId: {
      type: String
    },
    billRef: {
      type: String
    },
    consumerID: {
      type: String
    },
    batch: {
      type: String
    },
    disco: {
      type: String
    },
    circle: {
      type: String
    },
    division: {
      type: String
    },
    subDivision: {
      type: String
    },
    billMonth: {
      type: String
    },
    billDate: {
      type: String
    },
    prev_Meter_No: {
      type: String
    },
    pres_Meter_No: {
      type: String
    },
    pres_Peak: {
      type: String
    },
    pres_OP: {
      type: String
    },
    pres_Total: {
      type: String
    },
    prev_Peak: {
      type: String
    },
    prev_OP: {
      type: String
    },
    prev_Total: {
      type: String
    },
    DM_MDI: {
      type: String
    },
    DM_Cum_MDI: {
      type: String
    },
    DM_Resets: {
      type: String
    },
    DM_STATUS: {
      type: String
    },
    DM_STATUS_CODE: {
      type: String
    },
    DATA_COLLECTOR: {
      type: String
    },
    DATA_COLLECTOR_CODE: {
      type: String
    },
    Comments: {
      type: String
    },
    images: []
  },
  {
    timestamps: true
  }
);

const Reader = mongoose.model('Reader', readerSchema);
module.exports = Reader;
