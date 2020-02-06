const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (app) => {

    app.post('/api/login', (req, res) => {

        const { mail, userPassword } = req.body;
        let userResponse = {};

        User.findUserByMail(mail, (error, success) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    status: 500,
                    err: 'Usuario o contraseña incorrectos'
                });
            }

            if (success.length === 0) {
                console.log(success);
                
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    err: 'Usuario o [contraseña] incorrectos'
                });
            }


            if (!bcrypt.compareSync(userPassword, success[0].userPass)) {

                return res.status(400).json({
                    ok: false,
                    status: 400,
                    err: 'Usuario o contraseña incorrectos bc'
                });

            }

            userResponse = {
                userMail: success[0].userMail,
                userName: success[0].userName,
                id: success[0]._id
            }

            let token = jwt.sign({
                user: userResponse
            },config.secretTk,{expiresIn:config.expTime});


            userResponse['token'] = token;
           

            res.status(200).json({
                ok: true,
                status: 200,
                userResponse
            });

        });

    });

}