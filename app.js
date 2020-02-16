const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet =  require('helmet');
const mongoose = require('mongoose');
const dbConfig = require('./config/config');
const path = require('path');

const port = process.env.PORT || 8080;

mongoose.connect(dbConfig.db,{
    useNewUrlParser:true,
    useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(helmet());



require('./routes/userRoutes.js')(app);
require('./routes/loginRoutes')(app);
require('./routes/notesRoutes')(app);
require('./routes/clientsRoutes')(app);

app.use(express.static(__dirname + '/client-printer-app'));

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/client-printer-app/index.html'));
});

app.listen(port,(error,success)=>{
  console.log(port);
});

