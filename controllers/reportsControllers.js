const NotesModel = require("../models/notesModel");
const ClientModel = require("../models/clientsModel");
const moment = require("moment");
const mongoose = require("mongoose");

const generateReports = async (req, res) => {
  const today = moment();
  const from_date = today.startOf("week").format();
  const to_date = today.endOf("week").format();

  try {
    const notes = await findNotes(from_date, to_date);
    let objectNotes = {};
    for (const note of notes) {
      const noteDate = moment(note.noteDate).format("MM-DD-YYYY");
      if (objectNotes[noteDate]) {
        objectNotes[noteDate].push(note);
      } else {
        objectNotes[noteDate] = [note];
      }
    }
    let datesProps = Object.keys(objectNotes);
    datesProps = datesProps.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (b > a) {
        return -1;
      }
      return 0;
    });

    const totals = returnOrderedArrayTotals(datesProps, objectNotes);
    return res.status(200).json(totals);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const returnOrderedArrayTotals = (datesItems, objectNotes) => {
  const totals = {};
  const totalsArrayOrdered = [];

  for (const dateString of datesItems) {
    let item = objectNotes[dateString];
    const splittedDate = dateString.split("-");
    const formattedDateString = `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]}`;
    if (item?.length > 0) {
      const amount = getTotalAmount(item);
      const dayOfWeek = moment(formattedDateString).isoWeekday();
      totals[dayOfWeek] = amount;
    }
  }

  for (let i = 1; i <= 7; i++) {
    if (!totals[i]) {
      totalsArrayOrdered.push(0);
    } else {
      totalsArrayOrdered.push(totals[i]);
    }
  }
  return totalsArrayOrdered;
};

const getTotalAmount = (noteItem) => {
  const saleTotals = noteItem.map((item) => item.amountPayed);
  return saleTotals.reduce((prev, current) => prev + current);
};

const findNotes = async (startingDate, endingDate) => {
  return NotesModel.find({
    noteDate: {
      $gte: startingDate,
      $lte: endingDate,
    },
  }).lean();
};

const generateReportsByDates = async (req, res) => {
  const { initialDate, finalDate, client, status } = req.query;

  let clientMatrix = {};

  let queryObject = {};

  if (initialDate && finalDate) {
    queryObject = {
      noteDate: { $gte: new Date(initialDate), $lte: new Date(finalDate) },
    };
  }

  if (client) {
    const clientId = mongoose.Types.ObjectId(client);
    queryObject = {
      ...queryObject,
      client: clientId,
    };
  }

  if (status) {
    queryObject = {
      ...queryObject,
      status,
    };
  }

  if(queryObject.status === "Cualquiera") {
    delete queryObject.status;
  }

  try {
    const foundNotes = await NotesModel.find(queryObject).lean();

    const payedNotes = foundNotes.filter((item) => item.status === "Pagado");
    const nonPayedNotes = foundNotes.filter(
      (item) => item.status === "Por pagar"
    );

    const totalAmountPayed = getTotalAmountPayed(foundNotes);

    const totalAmountSale = getTotalAmountSale(foundNotes);

    const totalOwed = totalAmountSale - totalAmountPayed;

    const { amountsOwedArray, clientObjects } = await getTotalAmountsOwedByCustomer(
      foundNotes
    );

    let amountsOwedByCustomer = amountsOwedArray;

    for(const client of clientObjects) {
      clientMatrix[client._id] = client;
    }

    //assign customer to nonPayedNotes
    for(const [index, nonPayedNote] of nonPayedNotes.entries()) {
      nonPayedNotes[index].client = clientMatrix[nonPayedNote.client];
    }

    for(const [index, payedNote] of payedNotes.entries()) {
      payedNotes[index].client = clientMatrix[payedNote.client];
    }

    amountsOwedByCustomer = amountsOwedByCustomer.filter(item => item?.amountOwed > 0);

    const responseObj = {
      payedNotes,
      nonPayedNotes,
      totalAmountPayed,
      totalAmountSale,
      totalOwed,
      amountsOwedByCustomer
    };
    
    res.status(200).json(responseObj);
  } catch (error) {
    debugger
    res.status(500).json(error);
  }
};

const getTotalAmountPayed = (notes) => {
  let totalAmount = 0;
  if (notes?.length > 0) {
    for (const note of notes) {
      totalAmount += note.amountPayed;
    }
  }
  return totalAmount;
};

const getTotalAmountSale = (notes) => {
  let totalAmount = 0;
  if (notes?.length > 0) {
    for (const note of notes) {
      totalAmount += note.totalSalePrice;
    }
  }
  return totalAmount;
};

const getTotalAmountsOwedByCustomer = async (notes) => {
  try {
    const clientIds = notes.map((item) => item.client);
    const uniqueClientIds = new Set(clientIds);
    let amountsOwed = {};
    let clientObjects = [];
    if (uniqueClientIds?.size > 0) {
      for (const clientId of uniqueClientIds) {
        const clientObject = await ClientModel.findById(clientId)
          .select("name email _id")
          .lean();
        clientObject ? clientObjects.push(clientObject) : "";
      }
    }

    for (const note of notes) {
      const client = clientObjects.find(
        (item) => item._id.toString() === note.client.toString()
      );
      if (client) {
        if (amountsOwed[client._id]) {
          amountsOwed[client._id].amountOwed +=
            note.totalSalePrice - note.amountPayed;
        } else {
          amountsOwed[client._id] = {
            client: client,
            amountOwed: note.totalSalePrice - note.amountPayed,
          };
        }
      }
    }

    let amountsOwedArray = Object.values(amountsOwed);

    amountsOwedArray = amountsOwedArray?.sort((a, b) => {
      if (a.amountOwed > b.amountOwed) {
        return -1;
      }

      if (b.amountOwed > a.amountOwed) {
        return 1;
      }

      return 0;
    });

    return {amountsOwedArray, clientObjects};
  } catch (error) {
    return error;
  }
};

module.exports = {
  generateReports,
  generateReportsByDates,
};
