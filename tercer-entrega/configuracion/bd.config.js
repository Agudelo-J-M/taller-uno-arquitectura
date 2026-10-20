//Credenciales de acceso a la base de datos Mongo.
//Cada valor se puede sobrescribir con una variable de entorno.
module.exports = {
    SERVIDOR: process.env.BD_SERVIDOR || 'localhost',
    PUERTO: process.env.BD_PUERTO || '27017',
    BASEDATOS: process.env.BD_BASEDATOS || 'festivos',
    USUARIO: process.env.BD_USUARIO || '',
    CLAVE: process.env.BD_CLAVE || ''
}
