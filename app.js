var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var device = require('express-device');
var anyDB = require('any-db');
var fs = require('fs');

var routes = require('./routes/index');
var data = require('./routes/data');
var results = require('./routes/results');

var app = express();

var conn = anyDB.createConnection('sqlite3://participants.db');

var db_schema = 
' (id INTEGER PRIMARY KEY AUTOINCREMENT,'+
' bibi_img TEXT, bibi_duration INTEGER, bibi_times_cleared INTEGER,'+
' boba_img TEXT, boba_duration INTEGER, boba_times_cleared INTEGER,'+
' kiki_img TEXT, kiki_duration INTEGER, kiki_times_cleared INTEGER,'+
' koka_img TEXT, koka_duration INTEGER, koka_times_cleared INTEGER,'+
' zizi_img TEXT, zizi_duration INTEGER, zizi_times_cleared INTEGER,'+
' zoza_img TEXT, zoza_duration INTEGER, zoza_times_cleared INTEGER,'+
' taken BOOLEAN,'+
' sex TEXT,'+
' age INTEGER,'+
' ip_address TEXT,'+
' device_type TEXT,'+
' comments TEXT);';

// conn.query("DROP TABLE participants;"); //Delete this line when finished with project
// check if a db exists. If not, make one
// fs.exists('participants.db', function(exists) {
    // if (!exists) {
        conn.query("CREATE TABLE participants"+db_schema, function() {
            console.log("made participants table");
        });
    // }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(device.capture());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/data', data);
app.use('/results', results);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;