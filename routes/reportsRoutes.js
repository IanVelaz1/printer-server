const express = require('express');
const ReportController = require('../controllers/reportsControllers');
const router = express();

router.get('/', ReportController.generateReports);
router.get('/reportsByDates', ReportController.generateReportsByDates);

module.exports = (app) => {
  app.use('/api/reports', router);
}
