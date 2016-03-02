// Plugin para validar y opcionalmente resolver el servicio
module.exports = function(schema, resolver) {
    schema.pre('validate', true, function(next, done) {
        var Ubicacion = require('../models/Ubicacion.js');
        var self = this;

        if (!self.servicio)
            done();
        else
            Ubicacion.findOne({
                    _id: (self.servicio._id || self.servicio).toString()
                },
                function(err, data) {
                    if (err)
                        return done(err);
                    if (!data)
                        return done(new Error("Servicio no encontrado"));

                    if (resolver)
                        self.servicio = data;
                    done();
                }
            );
        next();
    });
};
