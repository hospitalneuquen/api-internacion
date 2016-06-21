var express = require('express'),
    router = express.Router(),
    async = require('async'),
    Internacion = require('../models/Internacion.js'),
    Indicacion = require('../models/Indicacion.js'),
    TipoPrestacion = require('../models/TipoPrestacion.js');

/**
 * @swagger
 * /internacion/indicacion/tipos:
 *   get:
 *     tags:
 *       - Internación
 *     summary: Devuelve los tipos de indicacion declarados en el enum del schema
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/internacion/indicacion/tipos/:tipo', function(req, res, next) {
    sIndicacion = require('../schemas/Indicacion.js'),

        res.json(sIndicacion.path(req.params.tipo).enumValues);
});

/**
 * @swagger
 * /internacion/{idInternacion}/indicacion/{idIndicacion}:
 *   post:
 *     tags:
 *       - Pases
 *     summary: Crea / Modifica una indicacion
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: idInternacion
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: idIndicacion
 *         description: Id de la indicacion a modificar
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
// router.post('/internacion/:idInternacion/indicacion/:idIndicacion*?', function(req, res, next) {
//     async.waterfall([
//             // 1. Busca internación
//             function(asyncCallback) {
//                 Internacion.findOne({
//                     _id: req.params.idInternacion
//                 }, function(err, internacion) {
//                     if (err) return asyncCallback(err);
//                     if (!internacion) return asyncCallback(404);
//                     // return asyncCallback(404);
//
//                     // validamos que se haya cargado al menos una indicacion
//                     if (typeof req.body.indicaciones == "undefined") {
//                         // res.status(400).send({
//                         asyncCallback({
//                             status: 400,
//                             message: "Debe cargar al menos una indicación para guardar el tratamiento.",
//                             type: 'internal'
//                         });
//                     }
//
//                     // recorremos el tratamiento a ver si se ha solicitado
//                     // alguna prestacion, y de ser asi resolvemos los objetos
//                     // if (typeof req.body.indicaciones != "undefined" && req.body.indicaciones.length) {
//                     //     async.each(req.body.indicaciones, function(indicacion, callback) {
//                     //         console.log("indicacion: " + indicacion);
//                     //         console.log("id: " + typeof indicacion._id);
//                     //         if (typeof indicacion._id === "undefined"){
//                     //             var servicio = indicacion.servicio;
//                     //
//                     //             indicacion = new Indicacion(indicacion);
//                     //
//                     //             // resolvemos el servicio que ha solicitado la indicacion
//                     //             indicacion.validar('servicio', servicio);
//                     //         }
//                     //
//                     //         if (typeof indicacion.prestaciones !== "undefined") {
//                     //             TipoPrestacion.findOne({
//                     //                 _id: indicacion.prestaciones.tipoPrestacion
//                     //             }, function(err, tipoPrestacion) {
//                     //                 if (err) next(err);
//                     //
//                     //                 indicacion.prestaciones.tipoPrestacion = tipoPrestacion;
//                     //
//                     //                 // procesamos siguiente valor de la cola
//                     //                 callback();
//                     //             });
//                     //         } else {
//                     //             // procesamos siguiente valor de la cola
//                     //             callback();
//                     //         }
//                     //     }, function(err) {
//                     //         if (err) asyncCallback(err);
//                     //
//                     //         asyncCallback(null, internacion);
//                     //     });
//                     //
//                     // } else {
//                     //     asyncCallback(null, internacion);
//                     // }
//
//                 });
//             },
//             // 2. Creamos el tratamiento
//             function(internacion, asyncCallback) {
//
//                 // Crea o modifica la indicacion
//                 var indicacion;
//                 if (req.params.idIndicacion) { // Update
//
//                     indicacion = internacion.tratamiento.find(function(i) {
//                         return i._id == req.params.idIndicacion;
//                     });
//                     if (!indicacion)
//                         return asyncCallback(404);
//
//                     // verificamos que el usuario a editar sea el usuario que
//                     // ha creado la indicacion, de lo contrario no tiene permisos
//                     if (indicacion.createdBy.id != req.user.id){
//                         res.status(400).send({status:400, message: "No tiene permisos para editar la evolución", type:'internal'});
//                     }
//
//                     indicacion.merge(req.body);
//                     indicacion.validar('servicio', req.body.servicio);
//                 } else { // Insert
//                     if (!internacion.tratamiento)
//                         internacion.tratamiento = [];
//
//                     var indicacion = new Indicacion(req.body);
//
//                     internacion.tratamiento.push(indicacion);
//                     indicacion.validar('servicio', req.body.servicio);
//                 }
//
//                 asyncCallback(null, internacion);
//             },
//             // 3. Guarda la internacion modificada
//             function(internacion, asyncCallback) {
//                 internacion.audit(req.user);
//
//                 internacion.save(function(err) {
//                     asyncCallback(err, internacion);
//                 });
//             },
//         ],
//         function(err, internacion) {
//             if (err) return next(err);
//
//             res.json(internacion.tratamiento);
//         });
// });
router.post('/internacion/:idInternacion/indicacion/:idIndicacion*?', function(req, res, next) {
    async.waterfall([
            // 1. Busca internación y la modifica
            function(asyncCallback) {
                Internacion.findOne({
                    _id: req.params.idInternacion
                }, function(err, internacion) {
                    if (err) return asyncCallback(err);
                    if (!internacion) return asyncCallback(404);


                    // validaciones de la indicacion
                    if (req.body.tipo == 'Plan Hidratación Parenteral'){
                        if (typeof req.body.planHidratacion == "undefined"){
                            asyncCallback( res.status(400).send({status:400, message: "Debe completar los valores para el plan", type:'internal'}));
                        }
                        // if (typeof req.body.planHidratacion.tipoPlan == "undefined" || req.body.planHidratacion.tipoPlan == ""){
                        //     asyncCallback( res.status(400).send({status:400, message: "Debe indicar el tipo de plan.", type:'internal'}));
                        // }
                    }else if (req.body.tipo == 'Antibióticos' || req.body.tipo == 'Heparina o profilaxis' || req.body.tipo == 'Protección gástrica' || req.body.tipo == 'Otra medicación'){
                        if (typeof req.body.medicamento == "undefined"){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar el medicamento y la frecuencia", type:'internal'}));
                        }
                        if (typeof req.body.via == "undefined" || req.body.via == ''){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar la vía", type:'internal'}));
                        }
                        if (typeof req.body.frecuencia == "undefined" || req.body.frecuencia == ''){
                            asyncCallback({status:400, message: "Debe indicar la frecuencia", type:'internal'});
                        }
                    }else if (req.body.tipo == 'Controles'){
                    }else if (req.body.tipo == 'Cuidados generales'){
                        if (typeof req.body.cuidadosGenerales == "undefined"){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar el tipo de cuidado a realizar y la frecuencia", type:'internal'}));
                        }
                        if (typeof req.body.cuidadosGenerales.tipo == "undefined" || req.body.cuidadosGenerales.tipo == ''){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar el tipo de cuidado a realizar", type:'internal'}));
                        }
                        if (typeof req.body.frecuencia == "undefined" || req.body.frecuencia == ''){
                            asyncCallback({status:400, message: "Debe indicar la frecuencia", type:'internal'});
                        }
                    }else if (req.body.tipo == 'Cuidados especiales'){
                    }else if (req.body.tipo == 'Nutrición'){
                    }else if (req.body.tipo == 'Solicitud prestaciones'){
                        if (typeof req.body.prestacion.tipoPrestacion == "undefined" || req.body.prestacion.tipoPrestacion == ''){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar el tipo de indicación", type:'internal'}));
                        }
                        if (typeof req.body.prestacion.texto == "undefined" || req.body.prestacion.texto == ''){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar el texto de la indicación", type:'internal'}));
                        }
                    }else if (req.body.tipo == 'Otra indicación'){
                        if (typeof req.body.descripcion == "undefined" || req.body.descripcion == ''){
                            asyncCallback( res.status(400).send({status:400, message: "Debe indicar la descripción", type:'internal'}));
                        }
                        if (typeof req.body.frecuencia == "undefined" || req.body.frecuencia == ''){
                            asyncCallback({status:400, message: "Debe indicar la frecuencia", type:'internal'});
                        }
                    }

                    // Crea o modifica la evolución
                    var indicacion;
                    if (req.params.idIndicacion) { // Update

                        indicacion = internacion.indicaciones.find(function(i) {
                            return i._id == req.params.idIndicacion;
                        });
                        if (!indicacion)
                            return asyncCallback(404);

                        // verificamos que el usuario a editar sea el usuario que
                        // ha creado la indicacion, de lo contrario no tiene permisos
                        // if (indicacion.createdBy.id != req.user.id){
                        //     res.status(400).send({status:400, message: "No tiene permisos para editar la indicación", type:'internal'});
                        // }

                        indicacion.merge(req.body);
                        indicacion.validar('servicio', req.body.servicio);
                    } else { // Insert
                        if (!internacion.indicaciones)
                            internacion.indicaciones = [];

                        var indicacion = new Indicacion(req.body)

                        indicacion.validar('servicio', req.body.servicio);
                        internacion.indicaciones.push(indicacion);
                    }

                    asyncCallback(err, internacion, indicacion);
                });
            },
            // 2. Guardamos el tipo de prestacion en caso de que la
            // indicacion sea un pedido de prestacion
            function(internacion, indicacion, asyncCallback) {
                if (typeof indicacion.prestaciones !== "undefined") {
                    TipoPrestacion.findOne({
                        _id: indicacion.prestaciones.tipoPrestacion
                    }, function(err, tipoPrestacion) {
                        if (err) asyncCallback(err, internacion, indicacion);

                        indicacion.prestaciones.tipoPrestacion = tipoPrestacion;

                        asyncCallback(err, internacion, indicacion);
                    });
                } else {
                    asyncCallback(null, internacion, indicacion);
                }
            },
            // 3. Guarda la internacion modificada
            function(internacion, indicacion, asyncCallback) {
                internacion.audit(req.user);

                internacion.save(function(err) {
                    asyncCallback(err, indicacion);
                });
            },
        ],
        function(err, indicacion) {
            if (err) return next(err);
            res.json(indicacion);
        });
});

module.exports = router;
