var mongoose = require('mongoose'),
    schemaDolor = require('../schemas/Dolor.js');

module.exports = mongoose.model('Dolor', schemaDolor);
