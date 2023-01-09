const Site = require('../models/siteModel');
const XLSX = require('xlsx');
const uploadXLSX = async (req, res, next) => {
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
    // await Site.deleteMany();
    let savedData = await Site.create(jsonData);

    return res.status(201).json({
      success: true,
      message: savedData.length + ' rows added to the database'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = uploadXLSX;
