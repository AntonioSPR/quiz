// Definición del modelo de Coment con validación

module.exports = function(sequielize, DataTypes) {
	return sequielize.define(
		'Comment',
		{
			texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "->Falta Comentario"}}
			}
		}
	);
}