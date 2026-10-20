const tipoRepositorio = require('../repositorios/tipo.repositorio');
const fechaServicio = require('./fecha.servicio');
const { Festivo, basadoEnPascua, trasladaAlLunes } = require('../modelos/tipo.modelo');
const ErrorApi = require('../utilidades/error.api');

//Anio no bisiesto con el que se valida el dia y mes de un festivo:
//un festivo el 29 de febrero no existiria en la mayoria de los anios.
const ANIO_REFERENCIA = 2023;

//El domingo de pascua cae entre el 22 de marzo y el 26 de abril, por lo que
//con este rango la fecha calculada siempre queda dentro del mismo anio.
const DIAS_PASCUA_MINIMO = -80;
const DIAS_PASCUA_MAXIMO = 249;

const errorNoEncontrado = (id) => new ErrorApi(404, `No existe un festivo con id=${id}`);

//Verifica que los datos de calculo correspondan al modo de calculo del tipo
const validarDatosCalculo = (idTipo, datos) => {
    if (basadoEnPascua(idTipo)) {
        if (datos.diasPascua === undefined) {
            throw new ErrorApi(400, `Los festivos de tipo ${idTipo} requieren diasPascua`);
        }
        if (datos.diasPascua < DIAS_PASCUA_MINIMO || datos.diasPascua > DIAS_PASCUA_MAXIMO) {
            throw new ErrorApi(400,
                `diasPascua debe estar entre ${DIAS_PASCUA_MINIMO} y ${DIAS_PASCUA_MAXIMO}`);
        }
        if ((datos.dia !== undefined && datos.dia !== 0) || (datos.mes !== undefined && datos.mes !== 0)) {
            throw new ErrorApi(400, `Los festivos de tipo ${idTipo} no usan día ni mes`);
        }
    }
    else {
        if (datos.dia === undefined || datos.mes === undefined) {
            throw new ErrorApi(400, `Los festivos de tipo ${idTipo} requieren día y mes`);
        }
        if (!fechaServicio.esFechaValida(ANIO_REFERENCIA, datos.mes, datos.dia)) {
            throw new ErrorApi(400, `El día ${datos.dia} del mes ${datos.mes} no es válido`);
        }
        if (datos.diasPascua !== undefined) {
            throw new ErrorApi(400, `Los festivos de tipo ${idTipo} no usan diasPascua`);
        }
    }
}

exports.listar = () => tipoRepositorio.listarFestivos();

exports.obtener = async (id) => {
    const festivo = await tipoRepositorio.obtenerFestivo(id);
    if (!festivo) {
        throw errorNoEncontrado(id);
    }
    return festivo;
}

exports.agregar = async (datos) => {
    const tipo = await tipoRepositorio.obtenerTipo(datos.idTipo);
    if (!tipo) {
        throw new ErrorApi(404, `No existe un tipo de festivo con id=${datos.idTipo}`);
    }
    validarDatosCalculo(tipo.id, datos);

    //El id del nuevo festivo es el mayor id existente mas 1
    const id = (await tipoRepositorio.obtenerMayorIdFestivo()) + 1;
    await tipoRepositorio.agregarFestivo(tipo.id, new Festivo(id, tipo.id, datos));
    return tipoRepositorio.obtenerFestivo(id);
}

exports.modificar = async (id, datos) => {
    //El tipo no se modifica: los datos deben corresponder al tipo actual del festivo
    const actual = await exports.obtener(id);
    validarDatosCalculo(actual.idTipo, datos);

    const modificado = await tipoRepositorio.modificarFestivo(
        new Festivo(id, actual.idTipo, datos));
    if (!modificado) {
        throw errorNoEncontrado(id);
    }
    return tipoRepositorio.obtenerFestivo(id);
}

exports.eliminar = async (id) => {
    const eliminado = await tipoRepositorio.eliminarFestivo(id);
    if (!eliminado) {
        throw errorNoEncontrado(id);
    }
}

//Calcula la fecha de un festivo en un anio, segun el modo de calculo de su tipo
const calcularFecha = (idTipo, festivo, anio, domingoPascua) => {
    let fecha = basadoEnPascua(idTipo)
        ? fechaServicio.agregarDias(domingoPascua, festivo.diasPascua)
        : fechaServicio.crearFecha(anio, festivo.mes, festivo.dia);
    if (trasladaAlLunes(idTipo)) {
        fecha = fechaServicio.siguienteLunes(fecha);
    }
    return fecha;
}

//Calcula las fechas de todos los festivos de un anio, ordenadas
exports.obtenerFestivosAnio = async (anio) => {
    const tipos = await tipoRepositorio.listarTiposConFestivos();
    const domingoPascua = fechaServicio.obtenerDomingoPascua(anio);

    const festivos = [];
    for (const tipo of tipos) {
        for (const festivo of tipo.festivos || []) {
            const fecha = calcularFecha(tipo.id, festivo, anio, domingoPascua);
            //Un traslado al lunes desde finales de diciembre podria salirse del anio
            if (fecha.getUTCFullYear() === anio) {
                festivos.push({ fecha: fechaServicio.formatear(fecha), nombre: festivo.nombre });
            }
        }
    }
    return festivos.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

//Verifica si una fecha es festiva
exports.verificar = async (anio, mes, dia) => {
    if (!fechaServicio.esFechaValida(anio, mes, dia)) {
        throw new ErrorApi(400, 'Fecha no válida');
    }
    const fecha = fechaServicio.formatear(fechaServicio.crearFecha(anio, mes, dia));
    const festivos = await exports.obtenerFestivosAnio(anio);
    const coincidencias = festivos.filter((festivo) => festivo.fecha === fecha);

    return {
        fecha,
        esFestivo: coincidencias.length > 0,
        festivos: coincidencias.map((festivo) => festivo.nombre)
    };
}
