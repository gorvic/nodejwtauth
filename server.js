var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config 	   = require('./config');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.use(require('./app/middlewares/headers'));
app.use(require('./app/controllers')); // routing

app.use(morgan('dev')); //logging

mongoose.connect(config.database, function () {
    require('./app/seed');
    require('./app/helpers/acl');
}); //db


app.listen(config.port);
console.log('Listening on port: ' + config.port);