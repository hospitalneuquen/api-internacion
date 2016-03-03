// Plugin para validar propidades y opcionalmente resolverlas a un objeto completo
module.exports = function(schema, opciones) {
    // Define un método que debe llamarse para inicializar los datos
    schema.methods.validar = function(propiedad, valor) {
        if (!this[propiedad])
            this[propiedad] = {};

        this[propiedad]._id = valor;
    };

    schema.eachPath(function(path, type) {
        var validar = type.options.validar;
        if (validar) {
            // console.log('Habilitar validar para: ' + path);
            schema.pre('validate', true, function(next, done) {
                var self = this;

                if (!self[path])
                    done();
                else {
                    validar.modelo.findOne({
                            _id: self[path]._id
                        },
                        function(err, data) {
                            if (err)
                                return done(err);
                            if (!data)
                                return done(new Error("No pudo validar la propiedad " + path));

                            // ¿Reemplaza el ID por el objeto entero?
                            if (validar.resolver)
                                self[path] = data;
                            done();
                        }
                    );
                }
                next();
            });
        }
    });
};
