# Diagrama de Arquitectura por Capas - API Festivos

API RESTful desarrollada en Express JS sobre MongoDB.

La arquitectura organiza los componentes en capas jerárquicas horizontales, donde
cada capa tiene una responsabilidad única y solo interactúa con la capa
inmediatamente inferior, o con la superior al responder.

```mermaid
graph TD
    %% Cliente / Capa de Presentación Externa
    subgraph ClientLayer [Capa de Cliente]
        Client[Cliente Web / Móvil / Postman / Swagger UI]
    end

    %% Capa de Entrada y Enrutamiento
    subgraph PresentationLayer [Capa de Presentación / API]
        Index[index.js / app.js]
        Routes[Rutas Express<br/><i>festivo.rutas.js</i>]
        Validators[Middlewares / Validadores<br/><i>festivo.validador.js, fecha.validador.js</i>]
    end

    %% Capa de Lógica de Negocio
    subgraph BusinessLayer [Capa de Lógica de Negocio]
        Controllers[Controladores<br/><i>festivo.controlador.js</i>]
        FestivoService[Servicio de Festivos<br/><i>festivo.servicio.js</i>]
        FechaService[Servicio de Cálculo de Fechas<br/><i>fecha.servicio.js</i>]
    end

    %% Capa de Acceso a Datos
    subgraph DataAccessLayer [Capa de Acceso a Datos]
        Repositories[Repositorios / Modelos<br/><i>festivo.repositorio.js, tipo.modelo.js</i>]
    end

    %% Capa de Persistencia
    subgraph PersistenceLayer [Capa de Persistencia]
        DB[(Base de Datos MongoDB - Colección tipos)]
    end

    %% Flujo de la Petición
    Client -->|1. Petición HTTP| Index
    Index -->|2. Delega a| Routes
    Routes -->|3. Valida datos| Validators
    Validators -->|4. Pasa filtro| Controllers
    Controllers -->|5. Solicita operación| FestivoService
    FestivoService -->|6. Solicita datos de cálculo| Repositories
    Repositories -->|7. Consulta / Modifica| DB

    %% Flujo de la Respuesta
    DB -.->|8. Retorna documentos| Repositories
    Repositories -.->|9. Retorna tipos y festivos| FestivoService
    FestivoService -->|10. Solicita cálculo de fechas| FechaService
    FechaService -.->|11. Retorna fechas calculadas| FestivoService
    FestivoService -.->|12. Retorna resultado| Controllers
    Controllers -.->|13. Respuesta JSON| Client

    %% Estilos de Nodos
    style ClientLayer fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style PresentationLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style BusinessLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style DataAccessLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style PersistenceLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px
```

## Responsabilidad de cada capa

| Capa | Responsabilidad |
|---|---|
| Capa de Cliente | Consume la API mediante peticiones HTTP |
| Capa de Presentación / API | Recibe la petición, enruta hacia el controlador y valida los datos de entrada |
| Capa de Lógica de Negocio | Ejecuta las operaciones de la API y realiza el cálculo de las fechas festivas |
| Capa de Acceso a Datos | Traduce las operaciones de negocio en consultas y modificaciones sobre MongoDB |
| Capa de Persistencia | Almacena la colección `tipos` con los datos para calcular los festivos |

## Operaciones de la API

| Operación | Método | Ruta |
|---|---|---|
| Listar festivos | GET | `/api/festivos` |
| Obtener un festivo | GET | `/api/festivos/:id` |
| Agregar un festivo | POST | `/api/festivos/agregar` |
| Modificar un festivo | PUT | `/api/festivos/modificar/:id` |
| Eliminar un festivo | DELETE | `/api/festivos/:id` |
| Verificar si una fecha es festiva | GET | `/api/festivos/verificar/:anio/:mes/:dia` |
| Listar los festivos de un año | GET | `/api/festivos/obtener/:anio` |

El CRUD opera sobre los datos de cálculo de los festivos, no sobre fechas. Por ejemplo,
agregar el festivo de la Virgen de Chiquinquirá consiste en registrar su día, mes y el
tipo de festivo al que pertenece.

La operación **listar los festivos de un año** es la que consume la API Calendario
desarrollada en Spring Boot.

## Servicio de Cálculo de Fechas

Componente que aísla la lógica de fechas, requerida por la verificación de fecha
festiva y por el listado de festivos de un año.

Sus responsabilidades son:

- Calcular el domingo de Pascua de un año a partir de la fórmula
  `dias = d + (2b + 4c + 6d + 5) MOD 7`, donde `a = Año MOD 19`, `b = Año MOD 4`,
  `c = Año MOD 7` y `d = (19a + 24) MOD 30`. El resultado son los días transcurridos
  después del 15 de marzo hasta el domingo de Ramos, y el domingo de Pascua es 7 días
  después.
- Sumar o restar los días indicados en `diasPascua` a la fecha del domingo de Pascua,
  para los festivos de tipo 3 y 4.
- Trasladar una fecha al siguiente lunes, para los festivos de tipo 2 y 4.
- Validar que una fecha recibida sea una fecha válida del calendario.
