# Tercera entrega - API Festivos (Express JS + MongoDB)

Implementación de la **API Festivos** diseñada en la [primera entrega](../primera-entrega/):
API RESTful en Express JS sobre MongoDB con arquitectura por capas. Administra los datos
para calcular los festivos de Colombia, verifica si una fecha es festiva y lista los
festivos de un año (operación que consume la API Calendario de la segunda entrega).

## Requisitos

- Node.js 20.19 o superior (el archivo `.nvmrc` indica la versión 22)
- MongoDB en ejecución (por defecto en `localhost:27017`)

## Ejecución

1. Cargar la base de datos `festivos` con el script de la primera entrega. El script usa
   `use festivos`, que solo funciona en modo interactivo, por eso se pasa por la entrada
   estándar:

   ```bash
   mongosh < ../primera-entrega/BDFestivos.mjs
   ```

2. Instalar las dependencias e iniciar el servicio:

   ```bash
   npm install
   npm start
   ```

   El servicio queda en `http://localhost:3030` y la documentación Swagger UI en
   `http://localhost:3030/api-docs`.

3. Pruebas unitarias del servicio de cálculo de fechas: `npm test`

### Configuración

Los valores por defecto están en [configuracion/](configuracion/) y se pueden
sobrescribir con variables de entorno:

| Variable | Valor por defecto |
|---|---|
| `PUERTO` | `3030` |
| `BD_SERVIDOR` | `localhost` |
| `BD_PUERTO` | `27017` |
| `BD_BASEDATOS` | `festivos` |
| `BD_USUARIO` / `BD_CLAVE` | vacíos (sin autenticación) |

## Estructura del proyecto

Cada carpeta corresponde a un componente del
[diagrama de arquitectura por capas](../primera-entrega/diagrama-arquitectura-api-festivos.md):

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Presentación / API | [app.js](app.js) | Punto de entrada: conecta a la BD, carga el analizador JSON, Swagger UI, las rutas y el manejo de errores |
| | [rutas/festivo.rutas.js](rutas/festivo.rutas.js) | Expone las rutas y las asocia a validadores y controlador |
| | [validadores/festivo.validador.js](validadores/festivo.validador.js) | Valida el formato del `id` y del cuerpo de agregar y modificar |
| | [validadores/fecha.validador.js](validadores/fecha.validador.js) | Valida que año, mes y día sean numéricos |
| Lógica de negocio | [controladores/festivo.controlador.js](controladores/festivo.controlador.js) | Recibe la solicitud, llama al servicio y construye la respuesta |
| | [servicios/festivo.servicio.js](servicios/festivo.servicio.js) | Operaciones de la API y reglas según el tipo de festivo |
| | [servicios/fecha.servicio.js](servicios/fecha.servicio.js) | Domingo de Pascua, suma de días, traslado al lunes y validación de fechas |
| Acceso a datos | [repositorios/tipo.repositorio.js](repositorios/tipo.repositorio.js) | Consultas y modificaciones sobre la colección `tipos` |
| | [modelos/tipo.modelo.js](modelos/tipo.modelo.js) | Estructura del festivo embebido y modo de cálculo de cada tipo |
| | [modelos/bd.js](modelos/bd.js) | Conexión a MongoDB |
| Transversal | [utilidades/](utilidades/) | Error de negocio con código HTTP y middleware que lo convierte en respuesta JSON |

## Operaciones

| Operación | Método | Ruta | Respuesta |
|---|---|---|---|
| Listar festivos | GET | `/api/festivos` | 200 con la lista de festivos y su tipo |
| Obtener un festivo | GET | `/api/festivos/:id` | 200, o 404 si no existe |
| Agregar un festivo | POST | `/api/festivos/agregar` | 201 con el festivo creado |
| Modificar un festivo | PUT | `/api/festivos/modificar/:id` | 200 con el festivo modificado, o 404 |
| Eliminar un festivo | DELETE | `/api/festivos/:id` | 200 con un mensaje, o 404 |
| Verificar si una fecha es festiva | GET | `/api/festivos/verificar/:anio/:mes/:dia` | 200, o 400 si la fecha no existe |
| Listar los festivos de un año | GET | `/api/festivos/obtener/:anio` | 200 con las fechas ordenadas |

Los datos de entrada no válidos responden 400 con un `mensaje` (y la lista de `errores`
cuando son de formato).

### Ejemplos

Agregar el festivo de la Virgen de Chiquinquirá (tipo 2, Ley de Puente festivo). El
cuerpo indica el `idTipo`; el `id` del festivo lo genera la API como el mayor `id`
existente más 1:

```bash
curl -X POST http://localhost:3030/api/festivos/agregar \
  -H 'Content-Type: application/json' \
  -d '{"idTipo": 2, "nombre": "Virgen de Chiquinquirá", "dia": 9, "mes": 7}'
```

```json
{"id":20,"nombre":"Virgen de Chiquinquirá","dia":9,"mes":7,"idTipo":2,"tipo":"Ley de Puente festivo"}
```

Los tipos 3 y 4 usan `diasPascua` en lugar de `dia` y `mes`:

```bash
curl -X POST http://localhost:3030/api/festivos/agregar \
  -H 'Content-Type: application/json' \
  -d '{"idTipo": 3, "nombre": "Domingo de Ramos", "diasPascua": -7}'
```

Verificar una fecha:

```bash
curl http://localhost:3030/api/festivos/verificar/2026/4/3
```

```json
{"fecha":"2026-04-03","esFestivo":true,"festivos":["Viernes Santo"]}
```

Listar los festivos de un año:

```bash
curl http://localhost:3030/api/festivos/obtener/2026
```

```json
[{"fecha":"2026-01-01","nombre":"Año nuevo"},{"fecha":"2026-01-12","nombre":"Santos Reyes"}, ...]
```

## Reglas de negocio

- **Datos según el tipo.** Los tipos 1 y 2 requieren `dia` y `mes`, que deben formar una
  fecha válida en un año no bisiesto (no se acepta el 29 de febrero, porque no existiría
  la mayoría de los años). Los tipos 3 y 4 requieren `diasPascua` entre -80 y 249, rango
  con el que la fecha calculada siempre queda dentro del mismo año; `dia` y `mes` se
  guardan en 0.
- **El tipo no se modifica.** Modificar reemplaza el nombre y los datos de cálculo del
  festivo dentro de su tipo. Para cambiarlo de tipo se elimina y se agrega de nuevo.
- **Un día puede tener varios festivos.** Por eso verificar devuelve la lista `festivos`
  con los nombres de los que caen en esa fecha.
- **Fechas en UTC.** Los cálculos usan fechas UTC para que el resultado no dependa de la
  zona horaria del servidor.
