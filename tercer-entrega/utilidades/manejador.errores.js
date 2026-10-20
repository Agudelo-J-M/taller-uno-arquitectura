//Middleware que convierte los errores en respuestas JSON
module.exports = (err, req, res, next) => {
    //Cuerpo de la solicitud con JSON mal formado
    if (err.type === 'entity.parse.failed') {
        return res.status(400).send({ mensaje: 'El contenido del mensaje no es un JSON válido' });
    }
    //Errores de negocio con su codigo HTTP
    if (err.estado) {
        return res.status(err.estado).send({ mensaje: err.message });
    }
    console.error(err);
    res.status(500).send({ mensaje: 'Error interno del servidor' });
}
