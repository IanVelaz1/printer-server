const express = require('express');
const NotesController = require('../controllers/notesController');
const router = express();

router.post('/:originalId', NotesController.copyNote);

module.exports = (app) => {
  app.use('/api/notesV2', router);
}