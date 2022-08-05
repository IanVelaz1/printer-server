const NotesModel = require('../models/notesModel');
const mongoose = require('mongoose');

const copyNote = async (req, res) => {
  let { originalId } = req.params;

  try {
    const note = await NotesModel.findById(originalId).lean();
    note._id = new mongoose.Types.ObjectId();
    note.status = "Por pagar";
    note.noteDate = new Date();

    if(note && note.items?.length > 0) {
      note.items = note.items.map(item => {
        return {
          ...item,
          deliveryDate: null,
          deliveryTime: null
        }
      })
    }
    const createdNote = await NotesModel.create(note);
    return res.status(200).json(createdNote);
  } catch(error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  copyNote
}