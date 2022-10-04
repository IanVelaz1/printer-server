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
  },
  paymentType: {
    type: String
  },
  approvalNotes: {
    type: String,
    required: false
  }
})

const PaymentModel = mongoose.model('payments', PaymentsSchema);

module.exports = {
  PaymentModel
};