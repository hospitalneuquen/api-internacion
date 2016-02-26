var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema(
{
    fechaHora: Date,
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
    piezasDentarias:  Boolean,    // Incompletas=true, Completas=false,
    protesis: Boolean,
    protesisTipo: String,
    dificultadesDeglutir: Boolean,
    dificultadesMasticar: Boolean,
    lactanciaMaterna: String,
    observacionesNutricion: String,
    // ****************************** Necesidad de Eliminación ******************************
    espontaneaVesical: Boolean,
    incontinenciaVesical: Boolean,
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
    estadoMucosas: Boolean,
    otrosEliminacion: Boolean,
    estadoMucosas: {
        integra: Boolean,
        lesiones: Boolean,
        hidratada:Boolean,
        deshidratada: Boolean,
    },
    estadoPiel: {
        integra: Boolean,
        lesiones: Boolean,
        hidratada:Boolean,
        deshidratada: Boolean,
    },
    estadoPie: {
        integra: Boolean,
        lesiones: Boolean,
        hidratada:Boolean,
        deshidratada: Boolean,
    },
    estadoBoca: {
        integra: Boolean,
        lesiones: Boolean,
        hidratada:Boolean,
        deshidratada: Boolean,
    },
    estadoGenitales: {
        integra: Boolean,
        lesiones: Boolean,
        hidratada:Boolean,
        deshidratada: Boolean,
    },
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
                normal: Boolean,
                deficiente: Boolean,
                ausente: Boolean
            },
    audicion: {
                normal: Boolean,
                deficiente: Boolean,
                ausente: Boolean
              },
    lenguaje: {
                normal: Boolean,
                deficiente: Boolean,
                ausente: Boolean
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
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    servicio: {
        id: Number, // 1='clínica médica' 2='clínica quirúrgica'
        nombre: String,
    },
});

// Config
schema.plugin(require('../common/mongoose-config'));
module.exports = schema;
