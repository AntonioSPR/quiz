var path = require('path');

// Postgres DATABASE_URL =postgres://user:password@host:port/database
// SQLite   DATABASE_URL =sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize (DB_name, user, pwd,
		{	dialect:  protocol,
			protocol: protocol,
			port:     port,
			host:     host,
			storage:  storage, // sólo SQLite (.env)
			omitNull: true     // sólo Postgres
		}	
);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

// squelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count < 10) { // La tabla se inicializa sólo si está vacía
			Quiz.create({ pregunta:  'Capital de Francia',
						  respuesta: 'Paris',
						  tema:      'Geografía'
						});
			Quiz.create({ pregunta:  'Capital de Italia',
						  respuesta: 'Roma',
						  tema:      'Geografía'
						});
			Quiz.create({ pregunta:  'Las ranas y los sapos son:',
						  respuesta: 'Anfibios',
						  tema:      'Ciencia'
						});
			Quiz.create({ pregunta:  'Las serpientes y las tortugas son:',
						  respuesta: 'Reptiles',
						  tema:      'Ciencia'
						});
			Quiz.create({ pregunta:  'El Quijote lo escribío (sólo apellido)',
						  respuesta: 'Cervantes',
						  tema:      'Humanidades'
						});
			Quiz.create({ pregunta:  'Las Meninas las pintó (sólo apellido)',
						  respuesta: 'Velázquez',
						  tema:      'Humanidades'
						});
			Quiz.create({ pregunta:  '¿Cuantas emociones tiene el personal de Pixar?',
						  respuesta: '5',
						  tema:      'Ocio'
						});
			Quiz.create({ pregunta:  '¿Cuantos ojos tiene Mike Sully?',
						  respuesta: '1',
						  tema:      'Ocio'
						});
			Quiz.create({ pregunta:  '¿Qué fruta es el logo de Apple?',
						  respuesta: 'Manzana',
						  tema:      'Tecnología'
						});
			Quiz.create({ pregunta:  '¿Qué animal es Tux?',
						  respuesta: 'Pingüino',
						  tema:      'Tecnología'
						}).then(function(){console.log('Base de datos inicializada')});
		};
	});
});