'use strict';

const express = require('express');
const router = express.Router();

const usuario = require('../controllers/UsuarioController.js');
const recuperar = require('../controllers/mailer.js');
//const usuario = require('../controllers/mailer.js');

/* Listado de rutas de rol estudiante*/
router.get('/', usuario.home);
router.post('/login', usuario.login);

//Rutas Lendy
router.get('/registro', usuario.registro);
router.post('/registroPost', usuario.registroPost);

router.get('/confirmar', usuario.confirmar);

//Rutas Beny
router.get('/recuperarContrasenia', recuperar.recuperarContrasenia);//
router.post('/recuperar', recuperar.recuperarContraseniaToken);//
router.get('/recuperarFinal/:token', recuperar.recuperarContraseniaFinalGet);//
router.post('/recuperarFinal/:token', recuperar.recuperarContraseniaFinal);//


router.post('/agregar', recuperar.agregar);

module.exports = router;