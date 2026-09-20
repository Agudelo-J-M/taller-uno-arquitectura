# Diagrama Objetual - API Festivos

Modelo de datos de la base de datos MongoDB `festivos`.

MongoDB almacena documentos en formato JSON, por lo que el modelo se representa
mediante un diagrama de clases donde las clases solo contienen estructura de datos
(sin métodos).

La colección `tipos` contiene un documento por cada tipo de festivo, y cada documento
embebe un arreglo de los festivos que se calculan con ese tipo.

**Importante:** la base de datos no almacena fechas festivas, almacena los datos
necesarios para calcularlas.

```mermaid
classDiagram
    class Tipo {
        +number id
        +string tipo
        +string modoCalculo
        +array festivos
    }

    class Festivo {
        +number dia
        +number mes
        +string nombre
        +number diasPascua
    }

    Tipo "1" *-- "0..*" Festivo : festivos
```

## Descripción de las clases

### Tipo
Representa un documento de la colección `tipos`.

| Atributo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador del tipo de festivo |
| tipo | string | Nombre del tipo |
| modoCalculo | string | Descripción de cómo se calcula la fecha |
| festivos | array | Arreglo de objetos `Festivo` |

Tipos existentes:

| id | tipo | Modo de calcularlo |
|---|---|---|
| 1 | Fijo | No se puede variar |
| 2 | Ley de Puente festivo | Se traslada la fecha al siguiente lunes |
| 3 | Basado en el domingo de Pascua | Se suman los días indicados al domingo de Pascua |
| 4 | Basado en el domingo de Pascua y Ley de Puente festivo | Se suman los días al domingo de Pascua y se traslada al siguiente lunes |

### Festivo
Objeto embebido dentro del arreglo `festivos` de un `Tipo`.

| Atributo | Tipo | Descripción |
|---|---|---|
| dia | number | Día del mes del festivo |
| mes | number | Mes del festivo |
| nombre | string | Nombre del festivo |
| diasPascua | number | Días a sumar o restar al domingo de Pascua |

Los atributos `dia` y `mes` aplican a los tipos 1 y 2. El atributo `diasPascua`
aplica a los tipos 3 y 4.
