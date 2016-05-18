var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaUbicacion = require('./Ubicacion.js');
    schemaDiagnostico = require('./Diagnostico.js');

var schema = new Schema({
    idProblema: {  // id del problema padre, en caso que haya modificacion
        type: Schema.Types.ObjectId,
        ref: 'Problema'
    },
    diagnostico: {
        type: schemaDiagnostico,
        validar: {
            modelo: require('../models/Diagnostico.js'),
            resolver: true
        }
    },
    diagnosticoTexto: String,
    descripcion: {
        type: String,
        required: true,
    },
    fechaDesde: {
        type: Date,
        required: true
    },
    esCronico: Boolean,
    estado: String,
    servicio: {
        type: schemaUbicacion,
        validar: {
            modelo: require('../models/Ubicacion.js'),
            resolver: true
        }
    }
});

schema.plugin(require('../mongoose/audit'));
schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
