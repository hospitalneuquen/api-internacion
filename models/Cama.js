var mongoose = require('mongoose'),
    schema = require('../schemas/Cama.js');

// middleware
schema.pre('validate', function(next) {
    var parent = this;

    // validamos la internacion y hacemos un populate de los datos del paciente
    if (parent.idInternacion) {
        // Por alguna razón hay que inyectar el modelo acá para no crear referencias circulares
        var Internacion = require('../models/Internacion.js');
        Internacion.findOne({
                _id: parent.idInternacion
            }).populate('paciente')
            .exec(function(err, data) {
                if (err)
                    return next("Internacion no encontrada");

                // asignamos los valores del paciente
                parent.paciente = data.paciente;
                next();
            });
    } else {
        next();
    }
});


module.exports = mongoose.model('Cama', schema);
