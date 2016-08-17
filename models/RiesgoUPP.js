var mongoose = require('mongoose'),
    schemaRiesgoUPP = require('../schemas/RiesgoUPP.js');

module.exports = mongoose.model('RiesgoUPP', schemaRiesgoUPP);
