// Plugin para validar y opcionalmente resolver una cama
module.exports = function(schema, resolver) {
    schema.pre('validate', true, function(next, done) {
        var Cama = require('../models/Cama.js');
        var self = this;

        if (!self.cama)
            done();
        else
            Cama.findOne({
                    _id: (self.cama._id || self.cama).toString()
                },
                function(err, data) {
                    if (err)
                        return done(err);

                    if (!data) {
                        done(new Error("Cama no encontrada"));
                    } else {
                        if (resolver)
                            self.cama = data;
                        done();
                    }
                }
            );
        next();
    });
};
