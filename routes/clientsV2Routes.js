const express = require('express');
const clientsController = require('../controllers/clientsController');
const {
  verificaToken
} = require('../middlewares/authMiddleware');
const router = express();

router.post('/', clientsController.createClient);
router.get('/', clientsController.getClients);
router.get('/:id', clientsController.querySpecificClient);
router.put('/:id', clientsController.editClient);
router.delete('/:id', clientsController.deleteClient);

module.exports = (app) => {
  app.use('/api/clientsV2', router);
}