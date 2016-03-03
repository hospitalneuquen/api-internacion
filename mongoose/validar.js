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
            // Cuando se usa el shorthand 'validar: require(...)'
            if (!validar.modelo)
            validar = {
                modelo: validar,
                resolver: null
            };

            //console.log('Habilitar validar para: ' + path);
            schema.pre('validate', true, function(next, done) {
                var self = this;

                if (!self[path])
                    done();
                else {
                    var id = self[path]._id || self[path];
                    validar.modelo.findOne({
                            _id: id
                        },
                        function(err, data) {
                            if (err)
                                return done(err);
                            if (!data){
                                //console.log("No pudo validar la propiedad " + path + " para el valor " + id);
                                return done(new Error("No pudo validar la propiedad " + path));
                            }

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
