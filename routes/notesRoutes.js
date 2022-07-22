const Note = require("../models/notesModel.js");
const NotesModel = require("../models/notesModel");
const Client = require("../models/clientsModel.js");
const Router = require("express");
const { PaymentModel } = require("../models/paymentsModel");
const {
  checkIfPaymentIsComplete,
} = require("../controllers/paymentsController");
const mongoose = require("mongoose");

const route = new Router();

const { verificaToken } = require("../middlewares/authMiddleware");

module.exports = (app) => {
  app.get("/api/note/search", verificaToken, async (req, res) => {
    let id = req.query.id;
    let date = req.query.date;
    let client = req.query.client;
    const queryObj = {};

    if (date && date.length > 0) {
      const splittedDate = date.split("-");
      const queryDate = new Date(
        splittedDate[0],
        Number(splittedDate[2]) - 1,
        splittedDate[1]
      ).toISOString();
      date = queryDate;
    }

    if (id) {
      queryObj["_id"] = id;
    }

    if (date) {
      queryObj["noteDate"] = { $gte: date };
    }

    if (client) {
      queryObj["client"]["name"] = {
        $regex: cl,
        $options: "/^/i",
      };
    }
    try {
      const notesFound = await NotesModel.aggregate([
        {
          $lookup: {
            from: "clients",
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $unwind: {
            path: "$client",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $match: queryObj,
        },
      ]);
      res.status(200).json({
        ok: true,
        success: notesFound,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        err: error,
        status: 400,
      });
    }
  });

  app.post("/api/note", verificaToken, (req, res) => {
    const body = req.body;
    body.client = mongoose.Types.ObjectId(body.client);
    Note.createNote(body, async (error, success) => {
      if (error) {
        debugger
        res.status(400).json({
          ok: false,
          err: error,
          message: error.errors.message,
          status: 400,
        });
      } else {
        await createInitialPayment(success._id, success.amountPayed);
        res.status(200).json({
          ok: true,
          status: 200,
          success,
        });
      }
    });
  });

  saveClient = (client) => {
    Client.findOneClient(client, (error, success) => {
      let objClient = {
        name: client,
      };

      if (error) {
        res.status(400).json({
          ok: false,
          err: error,
          status: 400,
        });
      } else {
        if (success === null) {
          Client.saveClient(objClient, (error, succ) => {});
        }
      }
    });
  };

  createInitialPayment = async (noteId, initialAmount) => {
    try {
      const createdPayment = await PaymentModel.create({
        note: noteId,
        amount: initialAmount,
      });
      await checkIfPaymentIsComplete(noteId, initialAmount);
    } catch (error) {
      return error;
    }
  };

  app.get("/api/note/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    console.log(id);
    Note.findNoteById(id, (error, success) => {
      if (error) {
        res.status(400).json({
          ok: false,
          err: error,
          status: 400,
        });
      } else {
        res.status(200).json({
          ok: true,
          success,
        });
      }
    });
  });

  app.put("/api/note/:id", async (req, res) => {
    let id = req.params.id;
    let note = req.body;

    const status = await checkIfPaymentsAreComplete(id, Number(note.totalSalePrice));

    note.status = status;

    Note.editNote(id, note, (error, success) => {
      if (error) {
        res.status(400).json({
          ok: false,
          err: error,
          status: 400,
        });
      } else {
        res.status(200).json({
          ok: true,
          success,
        });
      }
    });
  });
};

const checkIfPaymentsAreComplete = async (noteId, totalSalePrice) => {
  const id = mongoose.Types.ObjectId(noteId);
  let total = 0;
  const paymentsMade = await PaymentModel.find({ note: id }).lean();
  for (const payment of paymentsMade) {
    total += payment.amount;
  }

  if (total >= totalSalePrice) {
    return "Pagado";
  } else {
    return "Por pagar";
  }
};
