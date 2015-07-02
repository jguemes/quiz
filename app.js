var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(partials());
// uncomment after placing your favicon in /public
// Se añade en index.ejs la linea siguiente:
// <link rel="icon" href="favicon.ico" type="image/x-icon" />
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Quiz-jguemes 2015'));
app.use(session({resave: true,saveUninitialized:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos

app.use(function(req,res,next){

// Guardar path en session.redir para despues de login.
// No siempre se guarda el path que se recibe, en funcion del metodo
// con el que se recibe es distint ruta.

  if (!req.path.match(/\/login|\/logout/)) {
    if ((req.path=="/quizes/create")
     || (req.path.match(/\/quizes\/(\d+)/)!=null)) {
           req.session.redir = "/quizes";
        } else {
// En otro caso se guarda el path tal cual
          req.session.redir = req.path;
        }
  }
// Hacer visible req.session en las vistas
 res.locals.session = req.session;
 next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
