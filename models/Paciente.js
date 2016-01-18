var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//{ type: String, required: true, unique: true }
var schema = new Schema({
  activo: Boolean,
  apellido: String,
  nombre: String,
  documento: Number,
  contacto: {
    celular: Number,
    email: String,
    telefono: String
  },
  sexo: String,
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
    texto: String,
    barrio: String,
    localidad: String,
    departamento: String,
    provincia: String,
    pais: String,
    coordenadas: [Number, Number]
  },
  estadoCivil: String,
  contactoReferencia: {
    texto: String,
    relacion: String,
  },
  obrasSociales: [String],
  relaciones: [{
    tipo: String,
    apellido: String,
    nombre: String,
    documento: Number,
    idPersona: Schema.Types.ObjectId
  }],
  codigoExterno: {
    archivo: Number,
    sqlPaciente: Number,
    sqlHistoriaClinica: Number,
    sisa: Number,
    renaper: Number
  }
});

module.exports = mongoose.model('Paciente', schema)
