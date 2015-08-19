var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId

exports.load = function(req, res, next, quizId){
//	models.Quiz.findById({
	models.Quiz.find({
			where: { id: Number(quizId) },
			incude: [{ model: models.Comment }]
		}).then(function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error("No existe quizId = " + quizId));
			}
		}).catch(function(error) {next(error);});
};


// GET /quizes
exports.index = function(req, res, next){

	// Si usamos el formulario de búsqueda, quitamos los espacios en blanco y preparamos la búsca
	var search = {};

	// Si buscamos por pregunta:
	if (req.query.pregunta){
		search = {
			pregunta: {
				like: "%" + req.query.pregunta.replace(' ', '%') + '%'
			}
		}
	};

	// Si buscamos por tema:
	if (req.query.tema){
		search = {
			tema: {
				like: "%" + req.query.tema.replace(' ', '%') + '%'
			}
		}
	};


	// Si ha habido búsqueda, limitamos findAll a dicha búsqueda
	var consulta = {
		order: [
			['pregunta', 'ASC']
		],
		where: search
	};

	models.Quiz.findAll(consulta).then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, tema: req.query.tema, errors:[]});
		}
	).catch(function(error) {next(error);})
};

// GET /quizes/:id
exports.show = function(req, res){
	var quiz = req.quiz; // Usamos el autoload de quiz
	res.render('quizes/show', {quiz: quiz, errors:[]})
};	

//	models.Quiz.findById(req.params.quizId)
//	.then(function(quiz) {
//		res.render('quizes/show', {quiz: req.quiz, errors:[]})
//	})
//};


// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT/quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
		.validate()
			.then(
				function(err){
					if(err){
						res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
					}
					else {
						req.quiz    // save: guarda campos pregunta, respuesta  y tema en DB
							.save( {fields: ["pregunta", "respuesta", "tema"]})
								.then( function(){ res.redirect('/quizes');});
					}
				}

			);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors:[]});
	})
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema:"tema"}
	);

	res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	// Añadimos validación -> Mal: msg error ; Bien: Insertar BD
	quiz
		.validate()
			.then(
				function(err){
					if(err){
						res.render("quizes/new", {quiz: quiz, errors: err.errors});
					}
					else {
						// guarda en BD los camos pregunta y respuesta de quiz
						quiz
							.save({fields: ["pregunta", "respuesta", "tema"]})
								.then(function(){
										res.redirect('/quizes');
								}
							)  // Redirección HTTP (URL relativo) a lista preguntas						
					}
				})
};


// GET /author
exports.author = function(req, res) {
	res.render('author', {quiz: res.quiz, errors: []});	
};