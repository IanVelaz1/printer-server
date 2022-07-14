const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

    /* fileName: {
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
    },
    total: {
        type: Number,
        required: true
    },
    observations: {
        type: String,
        required: true
    } */

    client: {
        type: String,
        required: true
    },
    items:{
        type: Object,
        required: true
    },
    totalSalePrice:{
        type:Number,
        required:true
    },
    noteDate:{
        type:Date,
        required:true
    },
    amountPayed:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default: 'Por pagar'
    },
    deliveryDate: {
        type: Date
    }
});

const Note = module.exports = mongoose.model('notes', notesSchema);

const NoteModel = mongoose.model('notes', notesSchema);

module.exports.createNote = (note, callback) => {
    Note.create(note, callback);
}

module.exports.findNoteById = (id, callback) => {
    Note.findById(id, callback).lean();
}

module.exports.findNotes = (id, date, cl, callback) => {
     let petitionObj = {
         $and: [
             
         ]
     };

     if(!id && !date && !cl) {
        petitionObj = {};
     }

     if(id && id.length > 0){
         petitionObj['$and'].push({
            _id: id
          });
     }

     if(cl && cl.length > 0){
        petitionObj['$and'].push({
            client: {
                $regex:cl,
                $options:'/^/i'
            }
        });
     }

     if(date){
        petitionObj['$and'].push({
            noteDate: { $gte: date }
        });
     }

     console.log(petitionObj);
     

    Note.find(petitionObj,callback).hint({$natural:-1}).sort({_id: -1});
}

module.exports.editNote = (id, note, callback) => {
    Note.findByIdAndUpdate(id, note, callback);
}

module.exports.deleteNote = (id, callback) => {
    Note.findByIdAndRemove(id, callback);
}

module.exports.NoteModel = {
    NoteModel
}