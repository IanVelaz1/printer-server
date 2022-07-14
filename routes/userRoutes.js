const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {verificaToken} = require('../middlewares/authMiddleware');


module.exports = (app) => {

  app.post('/api/user', (req, res) => {
    const {
      userName,
      userMail,
      userPass
    } = req.body;

    let userObj = {
      userName: userName,
      userMail: userMail,
      userPass: bcrypt.hashSync(userPass, 10)
    }

    User.saveUser(userObj, (error, success) => {
      if (error) {
        res.status(400).json({
          ok: false,
          status: 400,
          err: error
        });
      } else {
        let objUser = {
          id: success._id,
          userName: success.userName,
          userMail: success.userMail
        }
        res.status(200).json({
          ok: true,
          status: 200,
          objUser
        })
      }
    });
  });


  app.get('/api/user/:mail',verificaToken, (req, res) => {
    const {
      mail
    } = req.params;

    console.log(req.user);
    
    

    User.findUserByMail(mail, (error, success) => {
      if (error) {
        res.status(500).json({
          ok: false,
          status: 500,
          err: 'Error al encontrar el usuario'
        });
      } else {
        res.status(200).json({
          ok: true,
          status: 200,
          success
        });
      }
    });
  });


}