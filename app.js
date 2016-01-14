var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var MongoClient = require('mongodb').MongoClient;
var mongoose=require("mongoose");
mongoose.connect("mongodb://desarrollo:27017/hospital");
var Schema=mongoose.Schema;

// Define esquema pacientes
var personaSchema = new Schema({
  activo: Boolean,
  apellido: String,
  nombre: String,
  documento: Number,
  contacto: {
    celular: {
        numero: Number,
        carrier: String
    },
    email: String,
    telefono: String
  },
  sexo: String,
  nacionalidad: String,
  fechaNacimiento: Date,
  fechaNacimientoEstimada: Boolean
  fallecido: Boolean,
  fechaFallecimiento: Date,
  archivo: Number,
  domicilio: {
    texto: String,
    codigoPostal: String,
    barrio: String,
    localidad: String,
    departamento: String,
    provincia: String,
    pais: String
    coordenadas: [Number, Number]
  },
  estadoCivil: String,
  contactoReferencia:{
    texto: String,
    relacion: String,
  },
  obrasSociales: [String],
  relaciones: [{
    tipo: String,
    apellido: String,
    nombre: String,
    idPersona: ObjectId
  }],
  codigoExterno: {
    sisa: Number,
    renaper: Number
  }
});






app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/robots', function(req, res){
  var query = Robot.find( { dangerous:true });
  query.where('age').gt(30);
  query.limit(10);
  query.select({name: true});
  query.exec(function(err,results) {
    res.json(results);
  });
});

app.get('/pacientes/:apellido', function(req, res){
  MongoClient.connect('mongodb://desarrollo:27017/hospital', function(err, db) {
    if (err) {
      throw err;
    }
    var pacientes = db.collection('pacientes');
    pacientes.findOne({apellido: req.params.apellido}, function(err, doc) {
      doc.propiedad = "Hola";
      pacientes.save(doc);
      res.json(doc);
    });

    //pacientes.save({apellido: req.params.apellido}, {$set: {apellido: req.params.apellido + 'X'}});
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
