//Valida el formato de los datos de entrada de las operaciones sobre festivos.
//Las reglas que dependen del tipo de festivo las valida el servicio de festivos.

const ID = /^[1-9]\d*$/;

const esEntero = (valor) => Number.isInteger(valor);
const esOpcionalEntero = (valor) => valor === undefined || esEntero(valor);

//Devuelve la lista de errores de formato de los datos de un festivo
const erroresDatos = (cuerpo) => {
    const errores = [];
    if (typeof cuerpo.nombre !== 'string' || !cuerpo.nombre.trim()) {
        errores.push('nombre es obligatorio y debe ser texto');
    }
    if (!esOpcionalEntero(cuerpo.dia)) {
        errores.push('dia debe ser un número entero');
    }
    if (!esOpcionalEntero(cuerpo.mes)) {
        errores.push('mes debe ser un número entero');
    }
    if (!esOpcionalEntero(cuerpo.diasPascua)) {
        errores.push('diasPascua debe ser un número entero');
    }
    return errores;
}

const responderErrores = (res, errores) =>
    res.status(400).send({ mensaje: 'Datos del festivo no válidos', errores });

exports.validarId = (req, res, next) => {
    if (!ID.test(req.params.id)) {
        return res.status(400).send({ mensaje: 'El id debe ser un número entero positivo' });
    }
    next();
}

exports.validarAgregar = (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del festivo' });
    }
    const errores = erroresDatos(req.body);
    if (!esEntero(req.body.idTipo)) {
        errores.unshift('idTipo es obligatorio y debe ser un número entero');
    }
    if (errores.length) {
        return responderErrores(res, errores);
    }
    next();
}

exports.validarModificar = (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).send({ mensaje: 'El contenido del mensaje debe incluir la información del festivo' });
    }
    const errores = erroresDatos(req.body);
    if (req.body.idTipo !== undefined) {
        errores.push('El tipo de un festivo no se puede modificar');
    }
    if (errores.length) {
        return responderErrores(res, errores);
    }
    next();
}
