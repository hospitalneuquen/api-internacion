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
        type: Schema.Types.ObjectId,
        ref: 'Diagnostico'
    },
    diagnosticoTexto: String,
    descripcion: {
        type: String
    },
    fechaDesde: {
        type: Date,
        //required: true
    },
    esCronico: Boolean,
    estado: String,
    activo: Boolean,
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Ubicacion'
    }
});

schema.plugin(require('../mongoose/audit'));
//schema.plugin(require('../mongoose/validar'));
schema.plugin(require('mongoose-merge-plugin'));
module.exports = schema;
