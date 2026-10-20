//Error de negocio que lleva el codigo HTTP con el que se debe responder
class ErrorApi extends Error {
    constructor(estado, mensaje) {
        super(mensaje);
        this.estado = estado;
    }
}

module.exports = ErrorApi;
