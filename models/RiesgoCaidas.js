var mongoose = require('mongoose'),
    schemaRiesgoCaidas = require('../schemas/RiesgoCaidas.js');

module.exports = mongoose.model('RiesgoCaidas', schemaRiesgoCaidas);
