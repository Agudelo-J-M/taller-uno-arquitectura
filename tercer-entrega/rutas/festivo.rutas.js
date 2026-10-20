module.exports = (app) => {
    //Importar el controlador y los validadores
    const controlFestivo = require('../controladores/festivo.controlador');
    const validadorFestivo = require('../validadores/festivo.validador');
    const validadorFecha = require('../validadores/fecha.validador');

    //metodo de la API que verifica si una fecha es festiva
    app.get('/api/festivos/verificar/:anio/:mes/:dia',
        validadorFecha.validarFecha, controlFestivo.verificar);

    //metodo de la API que obtiene los festivos de un año (lo consume la API Calendario)
    app.get('/api/festivos/obtener/:anio',
        validadorFecha.validarAnio, controlFestivo.obtenerAnio);

    //metodo de la API que obtiene la lista de festivos
    app.get('/api/festivos', controlFestivo.listar);

    //metodo de la API que obtiene un festivo
    app.get('/api/festivos/:id', validadorFestivo.validarId, controlFestivo.obtener);

    //metodo de la API que agrega (INSERT) un festivo
    app.post('/api/festivos/agregar', validadorFestivo.validarAgregar, controlFestivo.agregar);

    //metodo de la API que modifica (UPDATE) un festivo
    app.put('/api/festivos/modificar/:id',
        validadorFestivo.validarId, validadorFestivo.validarModificar, controlFestivo.modificar);

    //metodo de la API que elimina (DELETE) un festivo
    app.delete('/api/festivos/:id', validadorFestivo.validarId, controlFestivo.eliminar);
}
