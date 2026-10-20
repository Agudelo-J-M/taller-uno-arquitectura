//Estructura de los documentos de la coleccion tipos.
//La base de datos no almacena fechas festivas, sino los datos para calcularlas.

//Nombre de la coleccion en MongoDB
const COLECCION = 'tipos';

//Tipos de festivo existentes en Colombia
const TIPOS = {
    FIJO: 1,
    PUENTE: 2,
    PASCUA: 3,
    PASCUA_PUENTE: 4
}

//Indica si los festivos del tipo se calculan a partir del domingo de pascua
const basadoEnPascua = (idTipo) =>
    idTipo === TIPOS.PASCUA || idTipo === TIPOS.PASCUA_PUENTE;

//Indica si los festivos del tipo se trasladan al siguiente lunes
const trasladaAlLunes = (idTipo) =>
    idTipo === TIPOS.PUENTE || idTipo === TIPOS.PASCUA_PUENTE;

//Construye el objeto Festivo que se embebe en el arreglo festivos de un Tipo.
//Por convencion, dia y mes van en 0 para los tipos basados en pascua,
//y diasPascua no existe en los tipos 1 y 2.
const Festivo = function (id, idTipo, datos) {
    this.id = id;
    this.nombre = datos.nombre;
    if (basadoEnPascua(idTipo)) {
        this.dia = 0;
        this.mes = 0;
        this.diasPascua = datos.diasPascua;
    }
    else {
        this.dia = datos.dia;
        this.mes = datos.mes;
    }
}

module.exports = { COLECCION, TIPOS, basadoEnPascua, trasladaAlLunes, Festivo };
