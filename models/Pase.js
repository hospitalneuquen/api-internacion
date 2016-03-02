var mongoose = require('mongoose'),
    schema = require('../schemas/Pase.js');

module.exports = mongoose.model('Pase', schema);
