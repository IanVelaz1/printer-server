const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

    fileName: {
        type: String,
        required: [true, 'El nombre del archivo es necesario']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es necesaria']
    },
    pieceMeasures: {
        type: Array,
        required: [true, 'Las medidas son necesarias'],
        default: []
    },
    priceMeterSquares: {
        type: Number,
        default: 0
    },
    totalMeterSquares: {
        type: Number,
        default: 0
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    unitTotalPrice: {
        type: Number,
        default: 0
    },
    client: {
        type: String,
        required: [true, 'El cliente es necesario']
    },
    noteDate: {
        type: String,
        required: [true, 'La fecha es necesaria']
    }

});

const Note = module.exports = mongoose.model('notes', notesSchema);


module.exports.createNote = (note, callback) => {
    Note.create(note, callback);
}

module.exports.findNoteById = (id, callback) => {
    Note.findById(id, callback);
}

module.exports.findNotes = (id, date, callback) => {
    Note.find({
        $or: [{
            _id: id
        }, {
            noteDate: date
        }]
    }, callback);
}

module.exports.editNote = (id, note, callback) => {
    Note.findByIdAndUpdate(id, note, callback);
}

module.exports.deleteNote = (id, callback) => {
    Note.findByIdAndRemove(id, callback);
}