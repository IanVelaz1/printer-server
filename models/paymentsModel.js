const mongoose = require('mongoose');

const PaymentsSchema = new mongoose.Schema({
  note: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  amount: {
    type: Number,
    required: true
  }
})

const PaymentModel = mongoose.model('payments', PaymentsSchema);

module.exports = {
  PaymentModel
};