const Note = require('../models/notesModel.js');
const {
   verificaToken
} = require('../middlewares/authMiddleware');

module.exports = (app) => {

   app.get('/api/note/:id', verificaToken, (req, res) => {
      let id = req.params.id;

      if (id) {
         Note.findNote(id, (error, success) => {
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
      }
   });

   app.post('/api/note', verificaToken, (req, res) => {
      const body = req.body;
      Note.createNote(body, (error, success) => {

         if (error) {
            res.status(400).json({
               ok: false,
               err: error,
               message: error.errors.message,
               status:400
            });
         } else {
            res.status(200).json({
               ok: true,
               status:200,
               success
            });
         }

      });
   });

}