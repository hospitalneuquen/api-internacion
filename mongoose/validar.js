// DataObjectParser = require('../node_modules/dataobject-parser');
// Plugin para validar propidades y opcionalmente resolverlas a un objeto completo
module.exports = function(schema, opciones) {
    // Define un método que debe llamarse para inicializar los datos
    schema.methods.validar = function(propiedad, valor) {
        // console.log("propiedad/valor: " + propiedad + " / " + valor);
        if (!this[propiedad])
            this[propiedad] = {};

        this[propiedad]._id = valor;

        if (propiedad == 'egreso.derivadoHacia') {
            console.log(propiedad)
            console.log("this[propiedad]: " + this[propiedad]._id);
        }
    };



    schema.eachPath(function(path, type) {
        // console.log("Path: " + path + " / Type: " + type);
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
                //console.log("SELF[PATH]", self[path]);

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
                            if (!data) {
                                //console.log("No pudo validar la propiedad " + path + " para el valor " + id);
                                return done(new Error("No pudo validar la propiedad " + path));
                            }

                            // ¿Reemplaza el ID por el objeto entero?
                            if (validar.resolver) {
                                self[path] = data;
//                                 var _path = path.split('.');
//
//                                 if (_path.length > 1) {
// //                                     var d = new DataObjectParser();
// //                                     d.set(path, data);
// // console.log(d.data());
// //                                     Object.defineProperty(self, 'algo', d.data());
//                                     // console.log(d.data());
//                                     // // self.push(d.data());
//                                     // var arr = ['algo']
//                                     // console.log(self);
//                                     // self.push(arr);
//                                     for (var i = 0; i <= _path.length; i++){
//                                         // console.log(_path[i]);
//                                         self._path[i] = {};
//                                         self = self[]
//                                         // self[_path[i]] = new Object();
//                                         // console.log(self);
//
//                                     }
//                                     //
//                                     //
//                                     // self[_path[i-1]] = data;
//
//                                     // self.egreso.derivadoHacia = data;
//                                     // console.log("PATH:" + path);
//                                     // self[path] = data;
//                                     // console.log(self.path);
//
//                                     // self[_path[_path.length-1]] = data;
//                                     // self["hola_que_ace"] = "HOla";
//                                     // self.hola_que_aces = "HOla2";
//                                     //  console.log(self);
//                                     //  console.log(data);
//
//                                     // self.push(arr);
//                                 } else {
//                                     self[path] = data;
//                                 }
                            }

                            done();
                        }
                    );
                }
                next();
            });
        }
    });
};

function setValue(object) {
  for(var key in object) {
    if (object[key] instanceof Object) {
      iterate(object[key]);
    }
    else {
      console.log(key + ": " + object[key]);
    }
  }
}

var dotSet = function(str, value, obj) {
    console.log("*****************################################################################################################################### INGRESO");
    var keys = str.split('.');
    var parent = obj;

    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];

        if (!(key in parent)) {
            parent[key] = {};
            parent = parent[key];
        }
    }

    parent[keys[keys.length - 1]] = value;
    // console.log(parent, keys, keys[keys.length-1]);
    // console.log("MODIFICADO: ", parent);
    console.log(keys);
    console.log(keys[keys.length-1]);
    console.log(value);
}
