var mongoose = require('mongoose'),
    schema = require('../schemas/AntecedenteTipo.js');

module.exports = mongoose.model('AntecedenteTipo', schema, 'antecedenteTipo');
