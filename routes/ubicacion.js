var express = require('express'),
    router = express.Router(),
    Ubicacion = require('../models/Ubicacion.js');

router
/**
 * @swagger
 * /ubicacion/{id}/descendientes:
 *   get:
 *     tags:
 *       - Ubicaciones
 *     summary: Devuelve los descendientes de la ubicación indicada por Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id de la ubicación
 *         in: path
 *         required: true
 *         type: string
 *       - name: nombre
 *         description: Permite buscar por nombre
 *         in: query
 *         required: false
 *         type: string
 *       - name: tipo
 *         description: Permite filtrar por tipo. Notas = A modo de ejemplo, se listan sólo algunos tipos
 *         in: query
 *         required: false
 *         type: string
 *         enum:
 *           - hospital
 *           - servicio
 *           - ciudad
 *           - pais
 *           - barrio
 *     responses:
 *       200:
 *         description: Ok
 */
    .get('/ubicacion/:id/descendientes', function(req, res, next) {
        var query = Ubicacion.find({
            ancestros: req.params.id
        });
        if (req.query.tipo)
            query.where('tipo').equals(req.query.tipo);
        if (req.query.nombre)
            query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

        query.exec(function(err, data) {
            if (err) return next(err);

            res.json(data);
        });
    })
    /**
     * @swagger
     * /ubicacion/{id}/hijos:
     *   get:
     *     tags:
     *       - Ubicaciones
     *     summary: Devuelve los hijos directos de la ubicación indicada por Id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Id de la ubicación
     *         in: path
     *         required: true
     *         type: string
     *       - name: nombre
     *         description: Permite buscar por nombre
     *         in: query
     *         required: false
     *         type: string
     *       - name: tipo
     *         description: Permite filtrar por tipo. Notas = A modo de ejemplo, se listan sólo algunos tipos
     *         in: query
     *         required: false
     *         type: string
     *         enum:
     *           - hospital
     *           - servicio
     *           - ciudad
     *           - pais
     *           - barrio
     *     responses:
     *       200:
     *         description: Ok
     */
    .get('/ubicacion/:id/hijos', function(req, res, next) {
        var query = Ubicacion.find({
            padre: req.params.id
        });
        if (req.query.tipo)
            query.where('tipo').equals(req.query.tipo);
        if (req.query.nombre)
            query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

        query.exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);

            res.json(data);
        });
    })
    /**
     * @swagger
     * /ubicacion/{id}:
     *   get:
     *     tags:
     *       - Ubicaciones
     *     summary: Devuelve una ubicación por id
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Id de la ubicación
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Ubicación no encontrada
     *
     * /ubicacion:
     *   get:
     *     tags:
     *       - Ubicaciones
     *     summary: Busca ubicaciones por nombre y/o tipo
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: nombre
     *         description: Permite buscar por nombre
     *         in: query
     *         required: false
     *         type: string
     *       - name: tipo
     *         description: Permite filtrar por tipo. Notas = A modo de ejemplo, se listan sólo algunos tipos
     *         in: query
     *         required: false
     *         type: string
     *         enum:
     *           - hospital
     *           - servicio
     *           - ciudad
     *           - pais
     *           - barrio
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: No se ingresó ninguna opción de búsqueda
     */
    .get('/ubicacion/:id*?', function(req, res, next) {
        if (req.params.id) {
            Ubicacion.findOne({
                _id: req.params.id
            }).exec(function(err, data) {
                if (err) return next(err);
                if (!data) return next(404);

                res.json(data);
            });
        } else {
            if (!(req.query.tipo || req.query.nombre))
                return next(400);

            var query = Ubicacion.find({});
            if (req.query.tipo)
                query.where('tipo').equals(req.query.tipo);
            if (req.query.nombre)
                query.where('_fulltext').regex(new RegExp(req.query.nombre.toLowerCase()));

            query.exec(function(err, data) {
                if (err) return next(err);
                res.json(data);
            });
        }
    })

module.exports = router;
