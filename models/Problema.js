var mongoose = require('mongoose'),
    schemaProblema = require('../schemas/Problema.js');

module.exports = mongoose.model('Problema', schemaProblema);
