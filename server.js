var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var path 	   = require('path');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

var configDB 	   = require('./config/database');
var config = require('./config/common');
mongoose.connect(configDB.url); //mongo

app.use(morgan('dev')); //logging

//Cors
var cors = require('cors');
app.use(cors());

//Basic routes
var basicRoutes = express.Router();
basicRoutes.get('/', function(req, res) {
	res.send('Home page');
});
app.use('/', basicRoutes);

// API routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

app.listen(config.port);
console.log('Listening on port: ' + config.port);