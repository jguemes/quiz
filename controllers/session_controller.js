exports.loginRequired = function(req, res, next){
    if (req.session.user) {
//  Calcular el tiempo de la sesion desde la ultima transaccion
        var d = new Date();
        var t_act = d.getTime();
        var timeout = t_act - req.session.time;
        if (timeout > 20000) {
//  Se ha agotado el tiempo, hacer logout y marcar timeout para mensaje
           req.session.timeout = true;
           res.redirect('/logout');
        } else {
//  poner a 0 el contador de tiempo
        req.session.time = t_act;
        next();
        }
    } else {
        res.redirect('/login');
    }
};

// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }
// Crear req.session.user y guardar campos   id  y  username
// La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};
//  Registrar el tiempo de creacion de la sesion
        var t = new Date();
        req.session.time = t.getTime();
// Recien login, timeout es falso, para no presentar mensaje
        req.session.timeout = false;
        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion
exports.destroy = function(req, res) {
    delete req.session.user;
    delete req.session.time;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
