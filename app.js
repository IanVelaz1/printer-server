const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet =  require('helmet');
const mongoose = require('mongoose');
const dbConfig = require('./config/config');

const port = process.env.PORT || 3000;

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


app.listen(port,(error,success)=>{
  console.log(port);
});