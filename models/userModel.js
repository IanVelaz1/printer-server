const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: [true,'El nombre de usuario es obligatorio']
    },
    userMail: {
        type: String,
        required: [true,'El email es obligatorio']
    },
    userPass: {
        type: String,
        required: [true,'La contraseña es obligatoria']
    }

});


const User = module.exports = mongoose.model('user', userSchema);


module.exports.saveUser = (user, callback) => {
    User.create(user, callback);
}

module.exports.findUser = (id, callback) => {
    User.findById(id, callback);
}

module.exports.findUserByMail = (mail, callback) => {
    User.find({
        userMail: mail
    }, callback);
}

module.exports.editUser = (id, user, callback) => {
    User.findByIdAndUpdate(id, user, callback);
}