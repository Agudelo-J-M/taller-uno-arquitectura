# Cambios realizados

Resumen de los ajustes hechos sobre el trabajo inicial del Taller 1 (API Festivos),
después de revisarlo contra el enunciado del PDF y lo explicado en la clase.

## Decisión importante: `id` en cada festivo

Las rutas de la API (`GET /:id`, `PUT /modificar/:id`, `DELETE /:id`) reciben un `:id`,
pero en el modelo original solo los tipos tenían `id`; los festivos no. No estaba claro
a qué se refería el `:id`.

**Decisión:** cada festivo ahora tiene su propio `id`, único entre todos los festivos de
la colección (del 1 al 19). Así las rutas quedan sin ambigüedad y no hace falta indicar el
tipo para consultar, modificar o eliminar un festivo. Al **agregar** un festivo sí se debe
indicar en el cuerpo de la petición el `id` del tipo donde se registrará, y el `id` del
nuevo festivo lo genera la API (mayor `id` existente + 1), no el cliente.

**Alternativas descartadas:**

- Id único solo dentro de cada tipo: obliga a que las rutas lleven ambos ids
  (por ejemplo `/:tipoId/:festivoId`), lo que complica las rutas ya documentadas.
- Usar el nombre del festivo como clave: los nombres tienen espacios y tildes, pueden
  repetirse y cambian si se renombra el festivo.
- Hacer el CRUD sobre los tipos: no coincide con el enunciado, donde agregar un festivo
  (por ejemplo, la Virgen de Chiquinquirá) es registrar un festivo, no modificar un tipo.

## Archivos modificados

### `BDFestivos.mjs`

- Se completaron `tipo` y `modoCalculo` de los tipos 3 y 4, que estaban vacíos. Se usó el
  texto del enunciado:
  - Tipo 3: *Basado en el domingo de pascua*
  - Tipo 4: *Basado en el domingo de pascua y Ley de Puente festivo*
- Se agregó el campo `id` (1 a 19) a cada festivo.
- Se quitó una coma sobrante al final del arreglo de festivos del tipo 2.

### `diagrama-objetual-api-festivos.md`

- Se agregó `_id: ObjectId` a `Tipo` (identificador interno que genera MongoDB).
- El atributo `festivos` de `Tipo` pasó de `array` a `Festivo[]`.
- Se agregó `id` a `Festivo`.
- Se documentó la convención para los atributos que no aplican según el tipo:
  `dia` y `mes` valen `0` en los tipos 3 y 4, y `diasPascua` no existe en los tipos 1 y 2.
- Se explicó para qué sirve el `id` del festivo y que al agregar se indica el `id` del tipo.

### `diagrama-arquitectura-api-festivos.md`

- **Diagrama:** el nodo Cliente ahora incluye la *API Calendario - Spring Boot*, que es
  el consumidor real de la operación "listar los festivos de un año".
- **Diagrama:** el repositorio pasó de `festivo.repositorio.js` a `tipo.repositorio.js`,
  porque los festivos están embebidos en la colección `tipos`.
- Se aclaró dónde se valida cada cosa, para que no se repita:
  - Capa de presentación (validadores): el **formato** de los datos (año, mes y día numéricos).
  - `FechaService`: que la fecha **exista** en el calendario (por ejemplo, el 35 de febrero).
- Se aclaró que no hay CRUD para los tipos de festivo (solo para los festivos), como
  indicó el profesor en clase.
- Se agregó una nota indicando que el flujo numerado (pasos 1 a 13) aplica a las operaciones
  con cálculo de fechas, y que el CRUD solo recorre los pasos 1 a 9 y 12 a 13.
- La fórmula del domingo de Pascua ahora tiene paréntesis explícitos:
  `dias = d + ((2b + 4c + 6d + 5) MOD 7)`. Es el mismo resultado del ejemplo de 1999 del
  enunciado (13 días), solo que sin ambigüedad.
- Se aclaró que al trasladar un festivo "al siguiente lunes", si la fecha ya cae en lunes
  se mantiene.
- En la tabla de operaciones se indicó que `:id` es el `id` del festivo y que el POST
  recibe el `id` del tipo.

## Sobre la rama `diagramasHarol`

Harol subió su propia versión de los diagramas en la rama `diagramasHarol`
(`diagrama-objetual.md` y `diagrama-arquitectura.md`). Estos cambios se hicieron sobre
`master` y no incluyen esos archivos. Como los nombres son distintos no hay conflicto,
pero si ambas versiones llegan a `master` el profesor vería dos juegos de diagramas para
lo mismo. Proponemos entregar los de este PR, por lo siguiente:

**Diagrama objetual**

- El profesor explicó en clase que MongoDB se modela con diagramas de clases (clases con
  solo atributos), no con un diagrama entidad-relación. La versión de Harol usa
  `erDiagram`.
- El `erDiagram` separa `FESTIVO` como una tabla con una llave foránea `idTipo`. En la
  base de datos real (`BDFestivos.mjs`) los festivos están **embebidos** dentro de cada
  documento de `tipos`, así que el diagrama de clases con composición (`Tipo` contiene
  `Festivo[]`) es el que refleja la estructura real.
- Los ids de la base de datos son numéricos (`id: 1` a `4`), y Harol los modela como
  `string` y agrega un `numeroTipo` que no existe en los datos.

**Diagrama de arquitectura**

- El profesor pidió para esta entrega solo los diagramas de la **primera API** (Festivos,
  Express + MongoDB). La versión de Harol mezcla las dos APIs en un solo diagrama.
- Sigue la plantilla por capas del profesor (rutas, validadores, controladores,
  servicios, repositorios, base de datos); la versión de Harol no tiene rutas,
  validadores ni controladores.
- Incluye el servicio de cálculo de fechas (domingo de Pascua, traslado al lunes), que es
  el núcleo de la API, y todas las operaciones de la API (listar, obtener, agregar,
  modificar, eliminar, verificar y listar por año). Harol solo modela la de crear.
- En su versión, el servicio de calendario llama directamente al servicio de festivos.
  En la práctica es una llamada HTTP de la API Calendario (Spring Boot) a la API Festivos
  (Express); por eso en nuestro diagrama la API Calendario aparece como cliente.

**Lo que sí vale la pena conservar de la versión de Harol:** su vista con las dos APIs y
las dos bases de datos en un solo diagrama muestra bien la relación entre los
microservicios. Puede servir para la siguiente entrega, cuando se modele la segunda API.

## Pendiente

- [ ] Acordar con Harol y el resto del grupo cuál versión de los diagramas se entrega.
- [ ] Completar los nombres de los integrantes en el `README.md`.
- [ ] **Revisar que ambos diagramas se rendericen bien** en GitHub o en
      [Mermaid Live](https://mermaid.live). No se pudo comprobar al hacer los cambios.
- [ ] **Probar `BDFestivos.mjs` en `mongosh`** y confirmar que carga sin errores y que la
      colección `tipos` queda con 4 documentos y 19 festivos. No se pudo probar al hacer
      los cambios porque no había MongoDB disponible.
- [ ] Enviar el enlace del repositorio al profesor por correo.
