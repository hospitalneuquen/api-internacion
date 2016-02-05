//
// Plugin para configurar opciones por defecto en todos los schemas mongoose
// @param schema
// @param options Optionalmente se puede enviar una de las siguientes opciones:
//          removeFields : [String] (default: null). Eliminar campos desde JSON
//          elasticSearch: Bool     (default: false). Replica campos en ElasticSearch
module.exports = exports = function mongooseConfigPlugin(schema, options) {
    // Configuración por default
    var removeFields = options && options.removeFields;
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: removeFields ? function(doc, json, options) {
            for (var field in removeFields){
                delete json[removeFields[field]];
            }
            return json;
        } : undefined,
    });


    // ElasticSearch
    if (options && options.elasticSearch) {
        console.log('ElasticSearch habilitado');
        schema.plugin(require('mongoosastic'), {
            host: "desarrollo",
            port: 9200,
            protocol: "http",
            curlDebug: true
        });
    }
}
