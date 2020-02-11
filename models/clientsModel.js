const mongoose = require('mongoose');

const clientsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Client = module.exports = mongoose.model('clients', clientsSchema);

module.exports.saveClient = (client, callback) => {
    Client.create(client, callback);
}

module.exports.getClientById = (id, callback) => {
    Client.findById(id, callback);
}

module.exports.getClientByName = (name, callback) => {
    Client.find({
        name: {
            $regex: name,
            $options: '/^/i'
        }
    }, callback);
}