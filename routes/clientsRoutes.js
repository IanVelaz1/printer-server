const Client = require('../models/clientsModel');
const {
    verificaToken
} = require('../middlewares/authMiddleware');

module.exports = (app) => {

    app.get('/api/client/:name', verificaToken, (req, res) => {
        let clientName = req.params.name;   
        Client.getClientByName(clientName, (error, success) => {
            if (error) {
                res.status(400).json({
                    ok: false,
                    err: error,
                    status: 400
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

    app.post('/api/client', (req, res) => {
        let client = req.body;
        Client.saveClient(client, (error, success) => {
            if(error){
                res.status(400).json({
                    ok:false,
                    status:400,
                    err:error
                });
            }else{
                res.status(200).json({
                    ok: true,
                    status: 200,
                    success
                });
            }
        });
    });

}