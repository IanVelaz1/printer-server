const { PaymentModel } = require("../models/paymentsModel");
const Note = require("../models/notesModel");
const mongoose = require("mongoose");

const create = async (req, res) => {
  const payload = {
    ...req.body,
  };

  if (!payload.note || !payload.amount) {
    return res.status(400).json("Payment and amount are required");
  }

  try {
    const createdPayment = await PaymentModel.create(payload);
    const paymentComplete = await checkIfPaymentIsComplete(
      createdPayment.note,
      payload.amount
    );
    return res.status(200).json({
      createdPayment,
      note: paymentComplete,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const checkIfPaymentIsComplete = async (paymentId, paymentAmount) => {
  const id = mongoose.Types.ObjectId(paymentId);
  let updatedNote;
  let total = 0;
  try {
    const paymentsMade = await PaymentModel.find({ note: id }).lean();
    for (const payment of paymentsMade) {
      total += payment.amount;
    }

    updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      { amountPayed: total },
      { new: true }
    ).lean();
    if (total >= updatedNote.totalSalePrice) {
      updatedNote = await Note.findOneAndUpdate(
        { _id: id },
        { status: "Pagado" },
        { new: true }
      ).lean();
    } else {
      updatedNote = await Note.findOneAndUpdate(
        { _id: id },
        { status: "Por pagar" },
        { new: true }
      ).lean();
    }
    return updatedNote;
  } catch (error) {
    return error;
  }
};

const getPaymentsByNote = async (req, res) => {
  const { note } = req.params;

  if (!note) {
    return res.status(400).json("note is required");
  }

  try {
    const payments = await PaymentModel.find({ note }).lean();
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const editPayment = async (req, res) => {
  const { id } = req.params;

  const payload = req.body;

  if (!id) {
    return res.status(400).json("id is required");
  }

  try {
    const editedPayment = await PaymentModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    await checkIfPaymentIsComplete(editedPayment.note);
    return res.status(200).json(editedPayment);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deletePayment = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("id is required");
  }

  try {
    const deletedPayment = await PaymentModel.findByIdAndRemove(id);
    await checkIfPaymentIsComplete(deletedPayment.note);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const checkIfPaymentCanBeAdded = async(req, res) => {
  const { note } = req.params;

  const noteId = mongoose.Types.ObjectId(note);

  if(!note) {
    return res.status(400).json("note is required");
  }

  try {
    let total = 0;
    const note = await Note.findById(noteId).lean();
    const payments = await PaymentModel.find({ note: noteId }).lean()
    for (const payment of payments) {
      total += payment.amount;
    }

    if(total >= note.totalSalePrice) {
      return res.status(200).json({
        canAdd: false,
        remaining: note.totalSalePrice - total
      })
    }

    return res.status(200).json({
      canAdd: true,
      remaining: note.totalSalePrice - total
    })
  }catch(error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  create,
  getPaymentsByNote,
  editPayment,
  checkIfPaymentCanBeAdded,
  deletePayment,
  checkIfPaymentIsComplete
};
