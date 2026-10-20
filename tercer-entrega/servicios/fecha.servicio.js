//Servicio que aisla la logica de fechas. Todas las fechas se manejan en UTC
//para que el resultado no dependa de la zona horaria del servidor.

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const LUNES = 1;

//Crea una fecha a partir de anio, mes (1 a 12) y dia
const crearFecha = (anio, mes, dia) => new Date(Date.UTC(anio, mes - 1, dia));

//Valida que la fecha exista en el calendario (por ejemplo, el 35 de febrero no existe)
const esFechaValida = (anio, mes, dia) => {
    if (!Number.isInteger(anio) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
        return false;
    }
    const fecha = crearFecha(anio, mes, dia);
    return fecha.getUTCFullYear() === anio
        && fecha.getUTCMonth() === mes - 1
        && fecha.getUTCDate() === dia;
}

//Suma (o resta, si el valor es negativo) dias a una fecha
const agregarDias = (fecha, dias) => new Date(fecha.getTime() + dias * MS_POR_DIA);

//Calcula el domingo de pascua de un anio:
//a = Año MOD 19, b = Año MOD 4, c = Año MOD 7, d = (19a + 24) MOD 30
//dias = d + ((2b + 4c + 6d + 5) MOD 7) son los dias despues del 15 de marzo
//hasta el domingo de ramos, y el domingo de pascua es 7 dias despues.
const obtenerDomingoPascua = (anio) => {
    const a = anio % 19;
    const b = anio % 4;
    const c = anio % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + ((2 * b + 4 * c + 6 * d + 5) % 7);
    const domingoRamos = agregarDias(crearFecha(anio, 3, 15), dias);
    return agregarDias(domingoRamos, 7);
}

//Traslada una fecha al siguiente lunes. Si ya es lunes, se mantiene.
const siguienteLunes = (fecha) => {
    const diasHastaLunes = (LUNES - fecha.getUTCDay() + 7) % 7;
    return agregarDias(fecha, diasHastaLunes);
}

//Devuelve la fecha en formato AAAA-MM-DD
const formatear = (fecha) => fecha.toISOString().substring(0, 10);

module.exports = {
    crearFecha,
    esFechaValida,
    agregarDias,
    obtenerDomingoPascua,
    siguienteLunes,
    formatear
};
