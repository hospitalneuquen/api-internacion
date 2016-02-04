var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    activo: {
        type: Boolean,
        required: true,
        default: true
    },
    apellido: {
        type: String,
        es_indexed: true
    },
    nombre: {
        type: String,
        es_indexed: true
    },
    documento: Number,
    contacto: {
        celular: Number,
        email: String,
        telefono: String
    },
    sexo: {
        type: String,
        enum: ['masculino', 'femenino', 'indeterminado']
    },
    nacionalidad: String,
    fechaNacimiento: Date,
    fechaNacimientoEstimada: Boolean,
    fallecido: {
        type: Boolean,
        required: true,
        default: false
    },
    fechaFallecimiento: Date,
    domicilio: {
        texto: {
            type: String,
            es_indexed: false,
        },
        barrio: String,
        localidad: String,
        departamento: String,
        provincia: String,
        pais: String,
        coordenadas: [Number, Number]
    },
    estadoCivil: {
        type: String,
        enum: ['Casado', 'Separado', 'Soltero', 'Viudo']
    },
    contactoReferencia: {
        texto: String,
        relacion: String,
    },
    obrasSociales: [String],
    relaciones: [{
        id: Schema.Types.ObjectId, // Referencia a una instancia de Persona
        tipo: String,
        apellido: String,
        nombre: String,
        documento: Number,
    }],
    idExterno: { // Referencia identificadores de sistemas externos (SQLServer, SISA, etc)
        carpeta: Number, // Número de carpeta en el archivo
        paciente: Number, // Tabla SQL.Paciente
        historiaClinica: Number, //  Tabla SQL.Historias_Clinica
        sisa: Number,
        renaper: Number
    }
});

schema.plugin(require('../common/mongoose-config'), {
    elasticSearch: true
});
module.exports = mongoose.model('Persona', schema, 'personas')
