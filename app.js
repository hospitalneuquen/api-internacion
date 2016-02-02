var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    mongoose = require("mongoose"),
    requireDir = require('require-dir');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// routes
var routes = requireDir('./routes/');
for (var route in routes)
    app.use('/', routes[route]);

// connect
mongoose.connect("mongodb://desarrollo:27017/hospital");

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
        if (!isNaN(err)) {
            var e = new Error(err == 400 ? "Parámetro incorrecto" : "No encontrado");
            e.status = err;
            err = e;
        } else if (typeof err == "string") {
            var e = new Error(err);
            e.status = 400;
            err = e;
        }
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
