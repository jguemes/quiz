var path = require('path');
// Cargar modulo ORM

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true,      // solo Postgres
  }
);



// Importar la definicion de las tablas Quiz y Comment en quiz.js

var Quiz = sequelize.import(path.join(__dirname,'quiz'));

var Comment = sequelize.import(path.join(__dirname,'comment'));
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// exportar la definicion de las tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

// esto se exporta para poder hacer sequelize.query()
exports.sequelize = sequelize;

//  sequelize.sync()  crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function() {
  Quiz.count().success(function (count){
      if (count===0) {
          Quiz.create({ pregunta: 'Capital de Italia',
                respuesta: 'Roma',
                tema: 'Humanidades'
                })
          Quiz.create({ pregunta: 'Capital de Portugal',
                  respuesta: 'Lisboa',
                  tema: 'Humanidades'
                  })
    .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
