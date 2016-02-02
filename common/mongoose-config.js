//
// Plugin para configurar opciones por defecto en todos los schemas mongoose
// @param schema
// @param options Optionalmente se puede enviar una de las siguientes opciones:
//          elasticSearch: Bool (default: false). Replica campos en ElasticSearch
module.exports = exports = function mongooseConfigPlugin(schema, options) {
    // Configuración por default
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
    });

    // Opciones
    if (options && options.elasticSearch){
        console.log('ElasticSearch habilitado');
        schema.plugin(require('mongoosastic'), {
            host: "desarrollo",
            port: 9200,
            protocol: "http",
            curlDebug: true
        });
    }
}
