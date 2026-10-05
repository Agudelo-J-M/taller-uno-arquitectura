use festivos;

db.tipos.insertMany([
{
	id:1, tipo: 'Fijo', modoCalculo: 'No se puede variar',
	festivos: [
	{ id: 1 , dia: 1 , mes:1 , nombre: 'Año nuevo'},
	{ id: 2 , dia: 1 , mes:5 , nombre: 'Día del Trabajo'},
	{ id: 3 , dia: 20, mes:7 , nombre: 'Independencia Colombia'},
	{ id: 4 , dia: 7 , mes:8 , nombre: 'Batalla de Boyacá'},
	{ id: 5 , dia: 8 , mes:12, nombre: 'Inmaculada Concepción'},
	{ id: 6 , dia: 25, mes:12, nombre: 'Navidad'}
	]
},
{
	id:2, tipo: 'Ley de Puente festivo', modoCalculo: 'Se traslada la fecha al siguiente lunes',
	festivos: [
	{ id: 7 , dia: 6 , mes:1 , nombre: 'Santos Reyes'},
	{ id: 8 , dia: 19, mes:3 , nombre: 'San José'},
	{ id: 9 , dia: 29, mes:6 , nombre: 'San Pedro y San Pablo'},
	{ id: 10, dia: 15, mes:8 , nombre: 'Asunción de la Virgen'},
	{ id: 11, dia: 12, mes:10, nombre: 'Día de la Raza'},
	{ id: 12, dia: 1 , mes:11, nombre: 'Todos los santos'},
	{ id: 13, dia: 11, mes:11, nombre: 'Independencia de Cartagena'}
	]
},
{
	id:3, tipo: 'Basado en el domingo de pascua', modoCalculo: 'La fecha se calcula obteniendo la fecha del domingo de pascua y sumándole los días que correspondan',
	festivos: [
	{ id: 14, dia: 0 , mes:0 , nombre: 'Jueves Santo', diasPascua:-3},
	{ id: 15, dia: 0 , mes:0 , nombre: 'Viernes Santo', diasPascua:-2},
	{ id: 16, dia: 0 , mes:0 , nombre: 'Domingo de Pascua', diasPascua:0 }
	]
},
{
	id:4, tipo: 'Basado en el domingo de pascua y Ley de Puente festivo', modoCalculo: 'La fecha se calcula obteniendo la fecha del domingo de pascua y sumándole los días que correspondan. La fecha calculada debe ser trasladada al siguiente lunes',
	festivos: [
	{ id: 17, dia: 0 , mes:0 , nombre: 'Ascensión del Señor', diasPascua:40},
	{ id: 18, dia: 0 , mes:0 , nombre: 'Corpus Christi', diasPascua:61},
	{ id: 19, dia: 0 , mes:0 , nombre: 'Sagrado Corazón de Jesús', diasPascua:68}
	]
}
]);
