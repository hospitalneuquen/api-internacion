var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UbicacionSchema = require('../modelSchemas/Ubicacion.js');

var schema = new Schema({
    paciente: {
        id: Schema.Types.ObjectId,
        apellido: String,
        nombre: String,
        documento: Number,
        obrasSociales: [String]
    },
    estado: {
        type: String,
        enum: ['Espera', 'Ingresado', 'Egresado']
    },
    ingreso: {
        fecha: Date,
        tipo: String,
        ubicacion: UbicacionSchema,
        motivo: String,
        diagnosticoPresuntivo: String,
        situacionPaciente: {
            educacion: String,
            trabajo: String,
            ocupacion: String,
        },
        antecedentes: {
            hta: Boolean,
            diabetes: Boolean,
            alergias: String,
            estiloVida: String,
            obstetricos: {
                gestas: Number,
                partos: Number,
                cesareas: Number,
                abortos: Number,
            },
            quirurgicos: String
        },
    }
});

module.exports = mongoose.model('Internacion', schema, 'internaciones')
