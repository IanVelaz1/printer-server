const router = require('express')();
const PaymentsController = require('../controllers/paymentsController');
const {
  verificaToken
} = require('../middlewares/authMiddleware');

router.post('/', verificaToken, PaymentsController.create);

router.get('/:note', verificaToken, PaymentsController.getPaymentsByNote);

router.put('/:id', verificaToken, PaymentsController.editPayment);

router.get('/paymentCanBeAdded/:note', verificaToken, PaymentsController.checkIfPaymentCanBeAdded);

router.delete('/:id', verificaToken, PaymentsController.deletePayment);

module.exports = (app) => {
  app.use('/api/payment', router);
}