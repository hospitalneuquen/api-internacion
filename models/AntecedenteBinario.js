var mongoose = require('mongoose'),
    schema = require('../schemas/AntecedenteBinario.js');

module.exports = mongoose.model('AntecedenteBinario', schema, 'antecedentes');
