//Valida el formato de los parametros de fecha. Que la fecha exista en el
//calendario lo valida el servicio de calculo de fechas.

const ANIO = /^\d{4}$/;
const NUMERO = /^\d{1,2}$/;

exports.validarAnio = (req, res, next) => {
    if (!ANIO.test(req.params.anio)) {
        return res.status(400).send({ mensaje: 'El año debe ser un número de 4 dígitos' });
    }
    next();
}

//Igual que una fecha que no existe, el enunciado espera texto plano con estado 200
exports.validarFecha = (req, res, next) => {
    const { anio, mes, dia } = req.params;
    if (!ANIO.test(anio) || !NUMERO.test(mes) || !NUMERO.test(dia)) {
        return res.type('text').send('Fecha No valida');
    }
    next();
}
