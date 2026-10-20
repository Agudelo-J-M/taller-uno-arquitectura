const test = require('node:test');
const assert = require('node:assert');
const fechaServicio = require('../servicios/fecha.servicio');

const formatear = fechaServicio.formatear;

test('calcula el domingo de ramos', () => {
    //Ejemplo del enunciado: 15 + 13 = 28 de marzo de 1999
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoRamos(1999)), '1999-03-28');
    //Fechas comprobadas en clase
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoRamos(2004)), '2004-04-04');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoRamos(2025)), '2025-04-13');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoRamos(2026)), '2026-03-29');
});

test('calcula el domingo de pascua', () => {
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoPascua(1999)), '1999-04-04');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoPascua(2023)), '2023-04-09');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoPascua(2024)), '2024-03-31');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoPascua(2025)), '2025-04-20');
    assert.strictEqual(formatear(fechaServicio.obtenerDomingoPascua(2026)), '2026-04-05');
});

test('traslada una fecha al siguiente lunes', () => {
    //6 de enero de 2026 es martes
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(fechaServicio.crearFecha(2026, 1, 6))), '2026-01-12');
    //12 de octubre de 2026 ya es lunes
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(fechaServicio.crearFecha(2026, 10, 12))), '2026-10-12');
    //1 de noviembre de 2026 es domingo
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(fechaServicio.crearFecha(2026, 11, 1))), '2026-11-02');
});

test('calcula los festivos trasladados comprobados en clase', () => {
    const pascua = (anio, dias) => fechaServicio.agregarDias(fechaServicio.obtenerDomingoPascua(anio), dias);
    //Corpus Christi 2024: 61 dias despues de pascua, trasladado al lunes
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(pascua(2024, 61))), '2024-06-03');
    //Ejemplo del enunciado: el 12 de junio de 2023 es festivo (Corpus Christi)
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(pascua(2023, 61))), '2023-06-12');
    //En 2025 el Sagrado Corazón y San Pedro y San Pablo cayeron el mismo lunes
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(pascua(2025, 68))), '2025-06-30');
    assert.strictEqual(formatear(fechaServicio.siguienteLunes(fechaServicio.crearFecha(2025, 6, 29))), '2025-06-30');
});

test('suma y resta dias a una fecha', () => {
    const pascua = fechaServicio.crearFecha(2026, 4, 5);
    assert.strictEqual(formatear(fechaServicio.agregarDias(pascua, -3)), '2026-04-02');
    assert.strictEqual(formatear(fechaServicio.agregarDias(pascua, 40)), '2026-05-15');
});

test('valida que una fecha exista en el calendario', () => {
    assert.strictEqual(fechaServicio.esFechaValida(2024, 2, 29), true);
    assert.strictEqual(fechaServicio.esFechaValida(2023, 2, 29), false);
    assert.strictEqual(fechaServicio.esFechaValida(2026, 2, 35), false);
    assert.strictEqual(fechaServicio.esFechaValida(2026, 13, 1), false);
    assert.strictEqual(fechaServicio.esFechaValida(2026, 0, 1), false);
});
