const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verificaToken = (req,res,next) => {
   
  let token = req.get('token');

  jwt.verify(token,config.secretTk,(err,decoded)=> {

    if(err){
        return res.status(401).json({
            ok:false,
            err:err,
            status:401
        });
    }
    req.user = decoded.user;
    next();
  });
}

module.exports = {
    verificaToken
}


