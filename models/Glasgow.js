var mongoose = require('mongoose'),
    schemaGlasgow = require('../schemas/Glasgow.js');

module.exports = mongoose.model('Glasgow', schemaGlasgow);
