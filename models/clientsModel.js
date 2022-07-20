const mongoose = require('mongoose');

const clientsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    address: {
        phone: String,
        contact1: {
            name: String,
            phone: String
        },
        contact2: {
            name: String,
            phone: String
        },
        address: String
    },
    fiscalData: {
        rfc: String,
        fiscalAddress: String,
        postalCode: String,
        socialReason: String,
        regime: String
    }
});

const Client = module.exports = mongoose.model('clients', clientsSchema);

const ClientModel = mongoose.model('clients', clientsSchema);

module.exports.saveClient = (client, callback) => {
    Client.create(client, callback);
}

module.exports.getClientById = (id, callback) => {
    Client.findById(id, callback);
}


module.exports.findOneClient = (name,callback) => {
    Client.findOne({name:name},callback);
}

module.exports.getClientByName = (name, callback) => {
    Client.find({
        name: {
            $regex: name,
            $options: '/^/i'
        }
    }, callback);
}

module.exports.ClientModel = {
    ClientModel
}