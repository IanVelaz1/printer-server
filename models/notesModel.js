const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

    fileName: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    pieceMeasures: {
        type: Array,
        default: []
    },
    priceMeterSquares: {
        type: Number,
        default: 0
    },
    totalMeterSquares: {
        type:Number,
        default: 0
    },
    unitPrice: {
        type:Number,
        default: 0
    },
    unitTotalPrice: {
        type:Number,
        default: 0
    }

});

const Note = module.exports = mongoose.model('notes',notesSchema);


module.exports.createNote = (note,callback) => {
    Note.create(note,callback);
}

module.exports.findNote = (id,callback) => {
    Note.findById(id, callback);
}

module.exports.editNote = (id,note,callback) => {
    Note.findByIdAndUpdate(id,note,callback);
}

module.exports.deleteNote = (id,callback) => {
    Note.findByIdAndRemove(id,callback);
}