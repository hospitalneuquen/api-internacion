var mongoose = require('mongoose'),
    schemaFlebitis = require('../schemas/Flebitis.js');

module.exports = mongoose.model('Flebitis', schemaFlebitis);
