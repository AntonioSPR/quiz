var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
			where: {
				id: Number(commentId)
			}
		}
	).then(function(comment){
		if (comment) {
			req.comment = comment;
			next();
		}
		else {
			next(new Error('No existe commentId = ' + commentId))
		}
	}).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors:[]});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
		{
			texto: req.body.comment.texto,
			QuizId: req.params.quizId // Identificador de la pregunta asociada en la relación 1:n
		}
	);
	
	comment
		.validate()
			.then(
				function(err){
					if (err) {
						res.render('comments/new.ejs', {comment: comment, errors: err.errors});
					} 
					else {
						comment // save: guarda en BD campo texto de comment
							.save()
								.then(function(){res.redirect('/quizes/'+req.params.quizId)});
					}
				}
			);
};

exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
		.then( function(){ res.rediret('/quizes/'+req.params.quizId);} )
		.catch( function(error){next(error)});
};