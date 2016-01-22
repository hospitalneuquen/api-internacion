var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require("mongoose"),
    requireDir = require('require-dir'),
    cors = require('cors');

// Express config
var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Routes
var routes = requireDir('./routes/');
for (var route in routes)
    app.use('/', routes[route]);

// Connect to MongoDB
mongoose.connect("mongodb://desarrollo:27017/hospital");

// Error handlers
// ... 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// ... development
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// ... production
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
