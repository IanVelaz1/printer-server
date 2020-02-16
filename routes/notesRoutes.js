const Note = require('../models/notesModel.js');
const Client = require('../models/clientsModel.js');

const {
   verificaToken
} = require('../middlewares/authMiddleware');

module.exports = (app) => {

   app.get('/api/note/search', verificaToken, (req, res) => {
      let id = req.query.id || '';
      let date = req.query.date || '';
      let client = req.query.client || '';

      console.log(date);
      

      Note.findNotes(id, date, client,(error, success) => {
         if (error) {
            return res.status(400).json({
               ok: false,
               err: error,
               status: 400
            });
         }
         res.status(200).json({
            ok: true,
            success
         });
      });

   });


   app.post('/api/note', verificaToken, (req, res) => {
      const body = req.body;
      console.log(body);
      Note.createNote(body, (error, success) => {

         if (error) {
            res.status(400).json({
               ok: false,
               err: error,
               message: error.errors.message,
               status: 400
            });
         } else {
            if(body.client){
               saveClient(body.client);
            }
         res.status(200).json({
               ok: true,
               status: 200,
               success
            }); 
         }

      });
   });

    saveClient = (client) => {
      Client.findOneClient(client,(error,success) =>{ 

         let objClient = {
            name:client
         }
         
         if(error){
            res.status(400).json({
               ok:false,
               err:error,
               status: 400
            })
         }else {

            if(success === null){
               Client.saveClient(objClient,(error,succ) => {
                
               });
            }
         }

      });
   }

   app.get('api/note/:id', verificaToken, (req, res) => {
      let id = req.params.id;
      Note.findNoteById(id, (error, success) => {
         if (error) {
            res.status(400).json({
               ok: false,
               err: error,
               status: 400
            });
         } else {
            res.status(200).json({
               ok: true,
               success
            });
         }
      });
   });

   app.put('api/note/:id',(req,res)=>{
      let id = req.params.id;
      let note = req.body;

      Note.editNote(id,note,(error,success)=> {
         if (error) {
            res.status(400).json({
               ok: false,
               err: error,
               status: 400
            });
         } else {
            res.status(200).json({
               ok: true,
               success
            });
         }
      });

   });

}