//cargar el servicio de festivos
const festivoServicio = require('../servicios/festivo.servicio');

//Toma del cuerpo de la solicitud solo los datos de calculo de un festivo
const datosFestivo = (cuerpo) => ({
    nombre: cuerpo.nombre.trim(),
    dia: cuerpo.dia,
    mes: cuerpo.mes,
    diasPascua: cuerpo.diasPascua
});

//metodo web para obtener la lista de festivos
exports.listar = async (req, res) => {
    res.send(await festivoServicio.listar());
}

//metodo web para obtener un festivo
exports.obtener = async (req, res) => {
    res.send(await festivoServicio.obtener(Number(req.params.id)));
}

//metodo web para agregar un festivo
exports.agregar = async (req, res) => {
    const festivo = await festivoServicio.agregar({
        idTipo: req.body.idTipo,
        ...datosFestivo(req.body)
    });
    res.status(201).send(festivo);
}

//metodo web para modificar un festivo
exports.modificar = async (req, res) => {
    res.send(await festivoServicio.modificar(Number(req.params.id), datosFestivo(req.body)));
}

//metodo web para eliminar un festivo
exports.eliminar = async (req, res) => {
    await festivoServicio.eliminar(Number(req.params.id));
    res.send({ mensaje: `Se eliminó el festivo con id=${req.params.id}` });
}

//metodo web para verificar si una fecha es festiva
exports.verificar = async (req, res) => {
    const { anio, mes, dia } = req.params;
    res.send(await festivoServicio.verificar(Number(anio), Number(mes), Number(dia)));
}

//metodo web para obtener los festivos de un año
exports.obtenerAnio = async (req, res) => {
    res.send(await festivoServicio.obtenerFestivosAnio(Number(req.params.anio)));
}
