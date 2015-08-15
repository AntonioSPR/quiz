var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId

exports.load = function(req, res, next, quizId){
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error("No existe quizId = " + quizId));
			}
		}
	).catch(function(error) {next(error);});
};


// GET /quizes
exports.index = function(req, res, next){

	// Si usamos el formulario de búsqueda, quitamos los espacios en blanco y preparamos la búsca
	var search = {};

	if (req.query.search){
		search = {pregunta: {
						like: "%" + req.query.search.replace(' ', '%') + '%'
				}}
	};

	// Si ha habido búsqueda, limitamos findAll a dicha búsqueda
	var consulta = {
		where: search
	};

	models.Quiz.findAll(consulta).then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes});
		}
	).catch(function(error) {next(error);})
};

// GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz})
	})
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
	})
};

// GET /author
exports.author = function(req, res) {
	res.render('author', {});	
};