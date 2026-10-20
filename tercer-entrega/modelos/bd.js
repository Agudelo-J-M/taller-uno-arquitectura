//Cargar la libreria para operar con bases de datos mongo
const { MongoClient } = require('mongodb');

//Cargar la configuracion de la BD
const configBD = require('../configuracion/bd.config');

//Asignar cadena de conexion (con credenciales solo si se configuraron)
const credenciales = configBD.USUARIO
    ? `${encodeURIComponent(configBD.USUARIO)}:${encodeURIComponent(configBD.CLAVE)}@`
    : '';
const url = `mongodb://${credenciales}${configBD.SERVIDOR}:${configBD.PUERTO}`;

//objetos que contienen la conexion al servidor y a la bd
let cliente;
let basedatos;

module.exports = {
    conectar: async function () {
        cliente = new MongoClient(url);
        await cliente.connect();
        //obtener la base de datos
        basedatos = cliente.db(configBD.BASEDATOS);
        console.log(`Se ha establecido conexion a la base de datos ${configBD.BASEDATOS} de MONGO`);
    },

    obtenerBaseDatos: function () {
        return basedatos;
    },

    desconectar: async function () {
        if (cliente) {
            await cliente.close();
        }
    }
}
