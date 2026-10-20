//cargar librería ExpressJS
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const bd = require('./modelos/bd');
const festivoServicio = require('./servicios/festivo.servicio');
const configApp = require('./configuracion/app.config');
const documentacion = require('./docs/openapi.json');
const manejadorErrores = require('./utilidades/manejador.errores');

const app = express();

//Cargar librería para 'parseo' de contenido JSON
app.use(express.json());

//Documentacion de la API con Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacion));

//Dejar disponibles las rutas a los métodos web
require('./rutas/festivo.rutas')(app);

//Ruta no encontrada
app.use((req, res) => {
    res.status(404).send({ mensaje: `No existe la ruta ${req.method} ${req.path}` });
});

app.use(manejadorErrores);

//realizar la conexion a la BD y luego iniciar el servicio
const iniciar = async () => {
    try {
        await bd.conectar();
        const asignados = await festivoServicio.asignarIdsFaltantes();
        if (asignados > 0) {
            console.log(`Se asignó id a ${asignados} festivos que no lo tenían`);
        }
    }
    catch (err) {
        console.error('No fue posible preparar la base de datos de MONGO', err.message);
        process.exit(1);
    }
    app.listen(configApp.PUERTO, () => {
        console.log(`Servicio iniciado a través de la url http://localhost:${configApp.PUERTO}`);
        console.log(`Documentación en http://localhost:${configApp.PUERTO}/api-docs`);
    });
}

iniciar();
