var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    // ****************************** Necesidad de Oxigenación ******************************
    FR: Number,
    SAT2: Number,
    disneaEsfuerzo: Boolean,
    disneaReposo: Boolean,
    tos: Boolean,
    secreciones: Boolean,
    usoMusculos: Boolean,
    secrecionesCaracteristicas: String,
    musculosCuales: String,
    observacionesOxigenacion: String,
    // ****************************** Necesidad de Circulación ******************************
    TA: Number,
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
    protesisTipo: String,
    dificultadesDeglutir: Boolean,
    dificultadesMasticar: Boolean,
    lactanciaMaterna: String,
    observacionesNutricion: String,
    // ****************************** Necesidad de Eliminación ******************************
    espontaneaVesical: Boolean,
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
    tabaco: Boolean,
    tabacoCuantos: String,
    alcohol: Boolean,
    alcoholCuanto: String,
    drogas: Boolean,
    drogasCuales: String,
    otrosAdicciones: String,
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
    riesgoCaida: {
        caidasPrevias: Number,
        marcha: Number,
        ayudaDeambular: Number,
        venoclisis: Number,
        comorbilidad: Number,
        estadoMental: Number,
        total: {
            type: Number,
            default: 0
        },
    },
    riesgoUPP:Boolean,
    // valoracionRiesgoCaidas: {    //formulario de Riesgo de Caidas
    //     type: Schema.Types.ObjectId,
    //     ref: 'RiesgoCaidas',
    //     default: null
    // },
    //riesgoUPP: String,
    // valoracionRiesgoUPP: {    //formulario de Riesgo de Ulceras por Presion
    //     type: Schema.Types.ObjectId,
    //     ref: 'RiesgoUPP',
    //     default: null
    // },
    riesgosDescriba: String,
    observacionesSeguridad: String,
    // ****************************** Necesidad de Comunicación y Sensopercepción ******************************
    orientado: Boolean,
    glasgow: String,
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
    dolorLocalizacion: String,
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
