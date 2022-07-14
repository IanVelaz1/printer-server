const express = require('express');
const ReportController = require('../controllers/reportsControllers');
const router = express();

router.get('/', ReportController.generateReports)

module.exports = (app) => {
  app.use('/api/reports', router);
}
