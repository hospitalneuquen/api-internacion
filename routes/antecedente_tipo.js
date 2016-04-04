var express = require('express'),
    router = express.Router(),
    Antecedente = require('../models/Antecedente.js'),
    AntecedenteTipo = require('../models/AntecedenteTipo.js');

/**
 * @swagger
 * /antecedente_tipo/{id}:
 *   get:
 *     tags:
 *       - AntecedenteTipo
 *     summary: Devuelve todos los tipos de antecentes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/antecedente_tipo/', function(req, res, next) {
    AntecedenteTipo.find()
        .exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

/**
 * @swagger
 * /antecedente_tipo/{id}:
 *   get:
 *     tags:
 *       - AntecedenteTipo
 *     summary: Devuelve un tipo de antecente por Id (si se envia) o todos
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id del tipo de antecedente
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/antecedente_tipo/:id', function(req, res, next) {
    AntecedenteTipo.findOne({
            _id: req.params.id
        })
        .exec(function(err, data) {
            if (err) return next(err);
            if (!data) return next(404);
            res.json(data);
        });
});

/**
 * @swagger
 * /antecedente_tipo/{id}:
 *   get:
 *     tags:
 *       - AntecedenteTipo
 *     summary: Devuelve todos los antecentes por tipo de antecedente
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id del tipo de antecedente
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Ok
 *       404:
 *         description: Not found
 */
router.get('/antecedente_tipo/:id/antecedentes', function(req, res, next) {
    Antecedente.find({
        idAntecedenteTipo: req.params.id
    }, function(err, data) {
        if (err) return next(err);
        if (!data) return next(404);
        res.json(data);
    });
});

module.exports = router;
