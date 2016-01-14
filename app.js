var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var MongoClient = require('mongodb').MongoClient;
var mongoose=require("mongoose");
mongoose.connect("mongodb://desarrollo:27017/hospital");
var Schema=mongoose.Schema;

var robotSchema=new Schema({
  name        : { type:String, index: { unique: true } },
  description : String,
  occupation  : { type:String, default:"General Purpose" },
  age         : { type: Number, min:18, max:60 },
  dangerous   : Boolean,
  added       : { type: Date, default: Date.now },
});
robotSchema.set('toJSON', { virtuals: true });

var Robot = mongoose.model('Robot',robotSchema);

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
