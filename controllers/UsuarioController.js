'use strict';

const Usuario = require('../models/UsuarioModel'); //Referencia modelo
const titles = require('../config/titles');

const usuarioController = {};

//constantes para el registro
const bcrypt = require('bcrypt');

//Código para registro del usuario
usuarioController.registro = function(req, res) {
  res.render('../views/usuario/registro', { title: titles.view.home });
};


usuarioController.registroPost = function(req, res) {
    const nombre = req.body.nombre;
    const appPaterno = req.body.appPaterno;
    const appMaterno = req.body.appMaterno;
    const rutaFoto = req.body.rutaFoto;
    const email = req.body.email;
    const contrasena = req.body.contrasena;
    const contrasena2 = req.body.contrasena2;
    const nivelEducativo = req.body.nivelEducativo;
    const institucion = req.body.institucion;
    const especialidad = req.body.especialidad;
    const semestre = req.body.semestre;
    const turno = req.body.turno;

    let errors = [];
    console.log(' Nombre :' + nombre + ' Apellido Paterno:' + appPaterno + ' Apellido Materno :' + appMaterno + ' Foto de perfil:' + rutaFoto
     + ' Email :' + email + ' Contraseña:' + contrasena + ' Nivel Educativo :' + nivelEducativo + ' Institucion :' + institucion 
     + ' Especialidad : ' + especialidad  + ' Semestre : ' + semestre  + ' Turno : ' + turno);
   
    if (!nombre || !appPaterno || !appMaterno || !rutaFoto || !email || !contrasena || !contrasena2 || !nivelEducativo || !institucion || !especialidad || !semestre || !turno) {
        errors.push({ msg: "por favor llena todos los campos" })
    }
    //check if match
    if (contrasena !== contrasena2) {
        errors.push({ msg: "Las contraseñas no coinciden" });
    }

    //check if password is more than 8 characters
    if (contrasena.length < 8) {
        errors.push({ msg: 'La contraseña debe tener al menos 8 caracteres' })
    }
    if (errors.length > 0) {
        res.render('../views/usuario/confirmarRegistro', {
            errors: errors,
            nombre: nombre,
            appPaterno: appPaterno,
            appMaterno: appMaterno,
            rutaFoto: rutaFoto,
            email: email,
            contrasena: contrasena,
            nivelEducativo: nivelEducativo,
            institucion: institucion,
            especialidad: especialidad,
            semestre: semestre,
            turno: turno
        })
    } else {
        //validation passed
        Usuario.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'El email ya existe' });
                res.render('../views/usuario/registro', { errors, nombre, appPaterno,
                    appMaterno, rutaFoto, email, contrasena, contrasena2, 
                    nivelEducativo, institucion, especialidad, semestre, turno})
            } else {
                const newUser = new Usuario({
                    nombre: nombre,
                    appPaterno: appPaterno,
                    appMaterno: appMaterno,
                    rutaFoto: rutaFoto,
                    email: email,
                    contrasena: contrasena,
                    nivelEducativo: nivelEducativo,
                    institucion: institucion,
                    especialidad: especialidad,
                    semestre: semestre,
                    turno: turno
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.contrasena, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //Guarda el HASH
                            newUser.contrasena = hash;
                            //Guarda el usuario
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg', 'Registro Correcto!')//Cambio de contraseña
                                    res.redirect('/confirmar');//inicio
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
}




/*
usuarioController.registroPost = function(req, res) {
  console.log(req.body);

  //cambiar por tus datos y cambiar el modelo
    var newUsuario = {

        nombre: req.body.nombre,
        appPaterno: req.body.appPaterno,
        appMaterno: req.body.appMaterno,
        rutaFoto: req.body.rutaFoto,
        email: req.body.email,
        contrasena: req.body.contrasena,
        nivelEducativo: req.body.nivelEducativo,
        especialidad: req.body.especialidad,
        semestre: req.body.semestre,
        turno: req.body.turno
    }
    var vid = new Usuario(newUsuario);

    vid.save().then(() => {
        console.log("Un usuario fue agregado!!");
        res.render('../views/usuario/confirmarRegistro', { title: titles.view.home });
    }).catch((error) => {
        if (error) {
            console.log("Un error al agregar el usuario");
            throw error;
        }
    });
};*/

usuarioController.confirmar = function(req, res) {
    res.render('../views/usuario/confirmarRegistro', { title: titles.view.home });
};
//-----------AQUÍ TERMINA------

usuarioController.home = function(req, res) {
    res.render('home', { title: titles.view.home });
};


//
//

usuarioController.login = function(req, res) {

    usuario.findOne({ email: req.body.email }).exec(function(error, user) {
        if (error) {
            console.log("Error: ", error);
            req.flash('mensaje', 'Lo sentimos hubo un error');
            return;
        } else {
            if (user == null) {
                console.log('Usuario incorrecto');
                res.render('../views/usuario/recuperarContrasenia', { mensaje: 'Email o contraseña inválida' });
            } else {
                console.log(user);
                res.render('../views/estudiante/home', { titulo: 'Bienvenido' });

            }
        }
    });
};

module.exports = usuarioController;