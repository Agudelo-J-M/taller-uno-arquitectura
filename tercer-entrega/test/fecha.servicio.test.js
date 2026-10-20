const test = require('node:test');
const assert = require('node:assert');
const fechaServicio = require('../servicios/fecha.servicio');

const formatear = fechaServicio.formatear;

test('calcula el domingo de pascua', () => {
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
