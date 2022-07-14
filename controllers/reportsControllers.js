const NotesModel = require("../models/notesModel");
const moment = require("moment");

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

  for(const dateString of datesItems) {
    let item = objectNotes[dateString];
    const splittedDate = dateString.split('-');
    const formattedDateString = `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]}`
    if(item?.length > 0) {
      const amount = getTotalAmount(item);
      const dayOfWeek = moment(formattedDateString).isoWeekday();
      totals[dayOfWeek] = amount;
    }
  }

  for(let i = 1; i <= 7; i ++) {
    if(!totals[i]) {
      totalsArrayOrdered.push(0)
    } else {
      totalsArrayOrdered.push(totals[i])
    }
  }
  return totalsArrayOrdered;
}

const getTotalAmount = (noteItem) => {
  const saleTotals = noteItem.map(item => item.amountPayed);
  return saleTotals.reduce((prev, current) => prev + current );
}

const findNotes = async (startingDate, endingDate) => {
  return NotesModel.find({
    noteDate: {
      $gte: startingDate,
      $lte: endingDate,
    },
  }).lean();
};

module.exports = {
  generateReports,
};
