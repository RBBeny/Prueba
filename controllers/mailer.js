


const titles = require('../config/titles');
var async = require('async');
var crypto = require('crypto');
//var Usuario = require('../models/UsuarioModel'); //Referencia modelo
var mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const nodemailer = require('nodemailer');
const { NotExtended } = require('http-errors');
const { Mongoose } = require('mongoose');
const { start } = require('repl');

const usuarioController = {};

/*
 * Método controlador para listar todos los usuarios
 */




usuarioController.agregar = (req, res) => {

    console.log(req.body);
    var newUsuario = {
        nombre: req.body.Nombre,
        appPaterno: req.body.appPaterno,
        appMaterno: req.body.appMaterno,
        email: req.body.email,
        password: req.body.password,
        fechaIngreso: req.body.fechaIngreso,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExperies: req.body.resetPasswordExperies
    }
    var vid = new Usuario(newUsuario);

    vid.save().then(() => {
        console.log("Un usuario fue agregado!!");
        res.send('Un nuevo usuario agregado correctamente');
    }).catch((error) => {
        if (error) {
            console.log("Un error al agregar el usuario");
            throw error;
        }
    });
}



//
usuarioController.recuperarContrasenia = function (req, res) {
    res.render('../views/usuario/recuperarContrasenia', { title: titles.view.recuperarContrasenia });

};



usuarioController.recuperarContraseniaToken = (req, res, next) => {

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
                console.log(token);
            });
        },
        function (token, done) {

            Usuario.findOne({ email: req.body.email }).then((usuario) => {

                console.log(usuario);
                if (!usuario) {
                    console.log('no registrado');
                    console.log(req.body.email);
                    req.flash('error', 'El correo no esta registrado!!');
                    return res.render('../views/usuario/recuperarContrasenia', { title: 'Recuperar Contraseña', mensaje: 'Correo no registrado' });
                }

                usuario.resetPasswordToken = token;
                usuario.resetPasswordExperies = Date.now() + 3600000; // 1 hour

                console.log(usuario);

                usuario.save((err) => {
                    done(err, token, usuario);
                });
            });
        },
        async function (token, usuario, done) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'benjaramirez2501@gmail.com', // generated ethereal user
                    pass: 'gsoauudhnatbauip', // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: '"Course Online 👻" <benjaramirez2501@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: "Recuperacion de Contraseña ✔", // Subject line
                text: "", // plain text body
                html: '<div class="card" style="width:400px">' +
                    '<div class="card-body">' +
                    '<h4 class="card-title">Mensaje de:' + + '</h4>' +
                    '<p class="card-text">Este espacio es para recuperar tu contraseña</p>' +
                    '<a href="http://' + req.headers.host + '/recuperarFinal/' + token + '">Click Aqui</a>' +
                    '' +
                    '</div>' +
                    '</div>',
            });

            console.log("Message sent: %s", info.messageId);
            res.render('../views/usuario/recuperarContrasenia', { title: titles.view.recuperarContrasenia, mensaje: 'Correo Enviado, revisa tu bandeja' });
        }

    ], //function (err) {
    //     if (err) return NotExtended(err);
    //     res.render('../views/usuario/recuperarContrasenia', { title: 'Recuperar Contraseña', mensaje: 'Ocurrio un Error, intentalo de nuevo' });
    // }
    );
};

usuarioController.recuperarContraseniaFinalGet = function (req, res) {


    Usuario.findOne({ resetPasswordToken: req.params.token, resetPasswordExperies: { $gt: Date.now() } }).then((usuario) => {

        console.log(req.params.token);

        console.log(usuario);
        if (!usuario) {
            console.log('token expiro');
            //console.log(req.body.email);
            req.flash('error', 'El token expiro!!');
            return res.render('../views/usuario/recuperarContrasenia', { title: titles.view.recuperarContrasenia, mensaje: 'El Token ya expiro' });
        }



        return res.render('usuario/recuperarContraseniaToken', {  title: titles.view.recuperarContrasenia,  usuario: req.usuario , token: req.params.token});
    });

    // Usuario.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, usuario) => {
    //     if (!usuario) {
    //       req.flash('error', 'EL token de reseteo ya expiro');
    //       return res.render('../views/usuario/recuperarContrasenia', {mensaje: 'El token ya expiro'});
    //     }


    // });
}

usuarioController.recuperarContraseniaFinal = function (req, res) {

    async.waterfall([

        function (done) {

            Usuario.findOne({ resetPasswordToken: req.params.token, resetPasswordExperies: { $gt: Date.now() } }).then((usuario) => {

                console.log(req.params.token);

                if (!usuario) {
                    req.flash('error', 'EL token de reseteo ya expiro');
                    console.log('Token expiro2');

                    return res.render('../views/usuario/recuperarContraseniaToken', { title: titles.view.recuperarContrasenia, mensaje: 'El Token ya expiro' });

                }
                usuario.password = req.body.password;
                usuario.resetPasswordToken = undefined;
                usuario.resetPasswordExperies = undefined;
                // Usuario.save((err) => {
                //     req.logIn(usuario, (err) => {
                //         done(err, usuario);
                //     });
                // });
                usuario.save((err) => {
                    done(err,  usuario);
                });
                console.log(req.body.password);
                console.log(usuario);
                res.render('../views/home', {
                    mensaje: 'Se cambio contraseña',

                });
            });


            // Usuario.findOne({ resetPasswordToken: req.params.token, resetPasswordExperies: { $gt: Date.now() } }, (err, usuario) => {
            //     if (!usuario) {
            //         req.flash('error', 'EL token de reseteo ya expiro');
            //         console.log(usuario);
            //         console.log(req.body.token);
            //         return res.render('../views/usuario/recuperarContraseniaToken');

            //     }
            //     console.log(usuario);




            // });
        },

    ], function (err) {
        if (err) return NotExtended(err);
        res.render('../views/usuario/recuperarContraseniaToken', {mensaje: 'error con la contraseña'});
    });

    //res.render('../views/home', { title: titles.view.recuperarContrasenia });
};




module.exports = usuarioController;