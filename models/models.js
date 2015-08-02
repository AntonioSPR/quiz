var path = require('path');

// Postgres DATABASE_URL =postgres://user:password@host:port/database
// Postgres DATABASE_URL =postgres://fxwlwisdrdfssy:Up929YrwKZQtVZlDYdi0aRjRyy@ec2-54-83-10-210.compute-1.amazonaws.com:5432/d1p554ble1dgpr
// SQLite   DATABASE_URL =sqlite://:@:/

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite;
var sequelize = new Sequelize (null, null, null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

// squelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0) { // La tabla se inicializa sólo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});