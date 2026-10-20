//cargar la libreria con la conexion a la bd
const bd = require('../modelos/bd');
const { COLECCION } = require('../modelos/tipo.modelo');

//Como los festivos estan embebidos en los documentos de la coleccion tipos,
//todas las consultas se hacen sobre esa coleccion.
const coleccion = () => bd.obtenerBaseDatos().collection(COLECCION);

//Etapas que convierten cada festivo embebido en un objeto plano con su tipo
const desplegarFestivos = [
    { $unwind: '$festivos' },
    {
        $project: {
            _id: 0,
            id: '$festivos.id',
            nombre: '$festivos.nombre',
            dia: '$festivos.dia',
            mes: '$festivos.mes',
            diasPascua: '$festivos.diasPascua',
            idTipo: '$id',
            tipo: '$tipo'
        }
    }
];

//metodo que obtiene todos los festivos de todos los tipos
exports.listarFestivos = () =>
    coleccion()
        .aggregate([...desplegarFestivos, { $sort: { id: 1 } }])
        .toArray();

//metodo que obtiene un festivo por su id
exports.obtenerFestivo = async (id) => {
    const festivos = await coleccion()
        .aggregate([
            { $match: { 'festivos.id': id } },
            ...desplegarFestivos,
            { $match: { id: id } }
        ])
        .toArray();
    return festivos[0] || null;
}

//metodo que obtiene un tipo (sin sus festivos) por su id
exports.obtenerTipo = (idTipo) =>
    coleccion().findOne({ id: idTipo }, { projection: { _id: 0, festivos: 0 } });

//metodo que obtiene el mayor id de festivo registrado
exports.obtenerMayorIdFestivo = async () => {
    const resultado = await coleccion()
        .aggregate([
            { $unwind: '$festivos' },
            { $group: { _id: null, mayor: { $max: '$festivos.id' } } }
        ])
        .toArray();
    return resultado.length ? resultado[0].mayor : 0;
}

//metodo que agrega un festivo al arreglo festivos de un tipo
exports.agregarFestivo = async (idTipo, festivo) => {
    const res = await coleccion().updateOne(
        { id: idTipo },
        { $push: { festivos: { ...festivo } } }
    );
    return res.matchedCount > 0;
}

//metodo que modifica los datos de un festivo
exports.modificarFestivo = async (festivo) => {
    const cambios = {};
    for (const campo of Object.keys(festivo)) {
        if (campo !== 'id') {
            cambios[`festivos.$[festivo].${campo}`] = festivo[campo];
        }
    }
    const res = await coleccion().updateOne(
        { 'festivos.id': festivo.id },
        { $set: cambios },
        { arrayFilters: [{ 'festivo.id': festivo.id }] }
    );
    return res.matchedCount > 0;
}

//metodo que retira un festivo del arreglo festivos de su tipo
exports.eliminarFestivo = async (id) => {
    const res = await coleccion().updateOne(
        { 'festivos.id': id },
        { $pull: { festivos: { id: id } } }
    );
    return res.modifiedCount > 0;
}

//metodo que obtiene todos los tipos con sus festivos, para calcular las fechas
exports.listarTiposConFestivos = () =>
    coleccion().find({}, { projection: { _id: 0 } }).toArray();
