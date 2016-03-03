var express = require('express'),
    router = express.Router(),
    Internacion = require('../models/Internacion.js');

/**
 * @swagger
 * /internacion/{id}:
 *   get:
 *     tags:
 *       - Internación
 *     summary: Devuelve una internación por Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/internacion/:id', function(req, res, next) {
    Internacion.findOne({
            _id: req.params.id
        }).populate('paciente')
        .exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

/**
 * @swagger
 * /internacion:
 *   get:
 *     tags:
 *       - Internación
 *     summary: Devuelve internaciones según las opciones de búsqueda
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: estado
 *         description: Estado de la internación (soporte múltiples valores)
 *         in: query
 *         required: false
 *         type: string
 *         enum:
 *           - enIngreso
 *           - enPase
 *           - ingresado
 *           - egresado
 *       - name: paciente
 *         description: Id del paciente (soporte múltiples valores)
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: No se ingresó ninguna opción de búsqueda
 */
router.get('/internacion/', function(req, res, next) {
    // Parsea opciones
    var opciones = {};
    if (req.query.estado)
        opciones.estado = Array.isArray(req.query.estado) ? {
            $in: req.query.estado
        } : req.query.estado;
    if (req.query.paciente)
        opciones.paciente = Array.isArray(req.query.paciente) ? {
            $in: req.query.paciente
        } : req.query.paciente;

    // Si no ingresó ninguna opción ...
    if (!Object.keys(opciones).length)
        return next(400);

    Internacion.find(opciones).populate('paciente')
        .exec(function(err, data) {
            if (err) return next(err);
            res.json(data);
        });
});

/**
 * @swagger
 * /internacion/{id}:
 *   post:
 *     tags:
 *       - Internación
 *     summary: Modifica una internación por Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la internación
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: Objeto
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.post('/internacion/:id', function(req, res, next) {
    Internacion.findOne({
        _id: req.params.id
    }, function(err, data) {
        if (err) return next(err);
        if (!data) return next(404);

        // TODO: implementar controles de qué se puede modificar y cuándo
        if (req.body.estado)
            data.estado = req.body.estado;
        if (req.body.paciente)
            data.paciente = req.body.paciente;
        if (req.body.ingreso)
            data.ingreso = req.body.ingreso;
        if (req.body.egreso)
            data.egreso = req.body.egreso;

        // Si está todo OK guarda los datos
        data.audit(req.user);
        data.save(function(err, data) {
            if (err) return next(err);
            res.json(data);
        });
    });
});

/**
 * @swagger
 * /internacion:
 *   post:
 *     tags:
 *       - Internación
 *     summary: Crea una internación
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Objeto
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 */
router.post('/internacion', function(req, res, next) {
    var data = new Internacion(req.body);
    data.audit(req.user);

    if (req.body.pases && req.body.pases.length) {
        data.pases[0].validar('servicio', req.body.pases[0].servicio);
        data.pases[0].validar('cama', req.body.pases[0].cama);
    }
    //
    // if (data.pases && data.pases.length)
    //     data.pases[0].servicio._id = req.body.pases[0].servicio; // Necesario para 'validarServicio'

    data.save(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

module.exports = router;
