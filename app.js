var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    mongoose = require("mongoose"),
    requireDir = require('require-dir'),
    config = require('./config'),
    passport = require('passport'),
    passportConfig = require('./passport'),
    swagger = require('swagger-jsdoc');

// Mongoose config
mongoose.connect(config.mongo);
mongoose.plugin(require('./mongoose/defaults'));
mongoose.set('debug', app.get('env') === 'development');

// Express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// swagger docs
// ... initialize swagger-jsdoc
var swaggerSpec = swagger({
    swaggerDefinition: {
        basePath: '/api/internacion'
    },
    apis: fs.readdirSync(path.join(__dirname, './routes/')).map(function(i) {
        return path.join(__dirname, './routes/') + i
    })
});

// ... routes
app.get('/docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/docs', express.static(path.join(__dirname, './node_modules/swagger-ui/dist')));

// Passport config
passportConfig();
app.use(passport.initialize());

// Configura rutas con autenticación JWT
var routes = requireDir('./routes/');
for (var route in routes)
    app.use('/', passport.authenticate('jwt', {
        session: false
    }), routes[route]);

module.exports = app;
