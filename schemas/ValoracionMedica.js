var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    examenFisico: {
        piel: String,
        cabezaCuello: String,
        torax: String,
        cardiovascular: String,
        respiratorio: String,
        abdomen: String,
        genitales: String,
        recto: String,
        osteoartromuscular: String,
        neurologico: String,
        fondoOjo: String,
    },
    estudios: {
        ecg: String,
        rx: String,
        otros: String,
    },
    impresionDiagnostica: {
        listaPositivos: [String],
        listaSindromes: [String],
        listaHipotesis: [String],
        planDiagnostico: String,
        planTerapeutico: String,
    },
    enfermedadActual: String,
});

// schema.plugin(require('../mongoose/validar'));
// schema.plugin(require('../mongoose/audit'));
module.exports = schema;
