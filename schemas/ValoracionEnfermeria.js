var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schemaDolor = require('../schemas/Dolor.js'),
    schemaRiesgoCaidas = require('../schemas/RiesgoCaidas.js'),
    schemaRiesgoUPP = require('../schemas/RiesgoUPP.js'),
    schemaFlebitis = require('../schemas/Flebitis.js'),
    schemaGlasgow = require('../schemas/Glasgow.js');

var schema = new Schema({
    // // ****************************** Valoración inicial médica *****************************
    // enfermedadActualAntecedentes: String,
    // otrosAntecedentes: String,
    // medicaciones: String,
    // examenesTraidos: String,
    // examenFisico: String,
    // ECG: String,
    // rxTorax: String,
    // otrosExamenes: String,
    // impresionDiagnostica: String,
    // conducta: String,

    // ****************************** Necesidad de Oxigenación ******************************
    FR: Number,
    SAT2: Number,
    disneaEsfuerzo: Boolean,
    disneaReposo: Boolean,
    tos: Boolean,
    secreciones: Boolean,
    usoMusculos: Boolean,
    secrecionesCaracteristicas: String,
    secrecionesColor: String,
    musculosCuales: String,
    observacionesOxigenacion: String,
    // ****************************** Necesidad de Circulación ******************************
    TA: Number,
    tensionSistolica: Number,
    tensionDiastolica: Number,
    FC: Number,
    carotideo: Number,
    radial: Number,
    popliteo: Number,
    pedio: Number,
    observacionesCirculacion: String,
    // ****************************** Necesidad de Nutrición ******************************
    peso: Number,
    talla: Number,
    habitosAlimentarios: String,
    vomitos: Boolean,
    vomitosCaracteristicas: String,
    nauseas: Boolean,
    otrosNutricion: String,
    piezasDentarias: Boolean, // Incompletas=true, Completas=false,
    protesis: Boolean,
    protesisSuperior: {
        activo: Boolean,
        fija: Boolean,
        completa: Boolean,
    },
    protesisInferior: {
        activo: Boolean,
        fija: Boolean,
        completa: Boolean,
    },
    dificultadesDeglutir: Boolean,
    dificultadesMasticar: Boolean,
    lactanciaMaterna: Boolean,
    observacionesLactancia: String,
    observacionesNutricion: String,
    // ****************************** Necesidad de Eliminación ******************************
    espontaneaVesical: Boolean,
    espontaneaVesicalCaracteristica: String,
    espontaneaVesicalTipo: String,
    incontinenciaVesical: Boolean,
    urostomiaVesical: Boolean,
    sondaVesical: Boolean,
    tallaVesical: Boolean,
    otrosVesical: Boolean,
    caracteristicaVesical: String,
    espontaneaIntestinal: Boolean,
    ostomiaIntestinal: Boolean,
    diarreaIntestinal: Boolean,
    incontinenciaIntestinal: Boolean,
    constipacionIntestinal: Boolean,
    rectorragiaIntestinal: Boolean,
    melenaIntestinal: Boolean,
    otrosIntestinal: Boolean,
    caracteriaticaIntestinal: String,
    drenajes: Boolean,
    otrosEliminacion: Boolean,
    drenajesCaracteristicas: String,
    otrosCaracteristicas: String,
    observacionesEliminacion: String,
    // ****************************** Necesidad de Proteger los tegumentos ******************************
    temperatura: String,
    color: String,
    higiene: String,
    higieneAyuda: Boolean,
    flebitis: Boolean,
    valoracionFlebitis: schemaFlebitis,
    edemas: Boolean,
    edemasLocalizacion: String,
    mucosasLesiones: Boolean,
    mucosasDeshidratadas: Boolean,
    pielLesiones: Boolean,
    pielDeshidratada: Boolean,
    piesLesiones:Boolean,
    piesDeshidratados: Boolean,
    bocaLesiones:Boolean,
    bocaDeshidratada:Boolean,
    genitalesLesiones:Boolean,
    genitalesDeshidratados: Boolean,
    observacionesTegumentos: String,
    // ****************************** Necesidad de Movilizarse/Vestirse ******************************
    ayudaVestirse: Boolean,
    dificultadesCaminar: Boolean,
    dispositivosMovilizacion: Boolean,
    dispositivosCuales: String,
    observacionesMovilizarse: String,
    // ****************************** Necesidad de Dormir y Reposar ******************************
    dormirContinuo: Boolean,
    dormirDiscontinuo: Boolean,
    dormirInsomnio: Boolean,
    dormirSomnolencia: Boolean,
    observacionesDormir: String,
    // ****************************** Necesidad de Seguridad ******************************
    riesgosFisicos: Boolean,
    riesgosQuimicos: Boolean,
    riesgosCuales: String,
    revisionGinecologica: Boolean,
    fechaRevisionGinecologica: Date,
    revisionUrologica: Boolean,
    fechaRevisionUrologica: Date,
    ETS: Boolean,
    riesgoCardiovascular: Boolean,
    otrosDescriba: String,
    riesgoCaidas:Boolean,
    riesgoCaidasDescriba: String,
    riesgoCaida: schemaRiesgoCaidas,
    riesgoUPP:Boolean,
    riesgoUPPDescriba: String,
    valoracionRiesgoUPP: schemaRiesgoUPP,
    riesgosDescriba: String,
    observacionesSeguridad: String,
    // ****************************** Necesidad de Comunicación y Sensopercepción ******************************
    orientado: Boolean,
    glasgow: Boolean,
    glasgowValoracion: schemaGlasgow,
    idioma: String,
    vision: {
                type: String,
                enum: ['normal', 'deficiente', 'ausente'],
            },
    audicion: {
                type: String,
                enum: ['normal', 'deficiente', 'ausente'],
              },
    lenguaje: {
                type: String,
                enum: ['normal', 'deficiente', 'ausente'],
              },
    describaSensopercepcion: String,
    dolor: Boolean,
    dolorValoracion: schemaDolor,
    observacionesComunicacion: String,
    // ****************************** Necesidad de Espiritualidad ******************************
    creenciasReligiosas: String,
    frecuenciaIglesia: String,
    visitaReligioso: Boolean,
    religiosoCual: String,
    observacionesEspiritualidad: String,
    // ****************************** Necesidad de Aprender/Autorealizarse/Recrearse ******************************
    comprendeSituacion: Boolean,
    sentimientosSituacion: String,
    dudasExpresadas: String,
    actividadesHabituales: String,
    observacionesAprender: String,

    // ****************************** Observaciones Generales ******************************
    observacionesGenerales: String,
    servicio: {
        id: Number,
        nombre: String,
    },
});

// schema.plugin(require('../mongoose/validar'));
// schema.plugin(require('../mongoose/audit'));
module.exports = schema;
