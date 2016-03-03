// Plugin para configurar ElasticSearch
// @param schema
module.exports = exports = function mongooseConfigPlugin(schema, options) {
    schema.plugin(require('mongoosastic'), {
        host: "desarrollo",
        port: 9200,
        protocol: "http",
        curlDebug: true
    });
}
