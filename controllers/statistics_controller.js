var models = require('../models/models.js');

exports.stats = function(req,res,next) {
// Objeto donde guardo los resultados.
  var stats = { npreg: 0, ncomm: 0, avg: 0, npregsc: 0, npregcc: 0};
// Interrogaciones a las tablas y calculos
  models.Quiz.count().then(function(cuenta){
      if (cuenta) { stats.npreg = cuenta; }
      models.Comment.count().then(function(cuenta){
					if (cuenta) { stats.ncomm = cuenta; }
          models.sequelize.query('SELECT count(distinct "QuizId") AS c FROM "Comments"').then(function(cuenta){
							if (cuenta) { stats.npregcc =cuenta[0].c;}
//  evitar dividir por 0 y redondeo a dos decimales
							stats.avg = ((stats.npreg==0)?0:stats.ncomm/stats.npreg).toFixed(2);
							stats.npregsc = stats.npreg - stats.npregcc;
							res.render('quizes/statistics',{stats: stats, errors: []}  );
          });    // sequelize.query()
     });   // Comment.count()
	 });   // Quiz.count()
} //  exports.stats
