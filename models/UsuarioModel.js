'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
	//'cveUsuario' : {type:mongoose.Types.ObjectId},
	'estado' : {type:Boolean, 
		default:false}, //Cuenta activada=true o no=false
	'nombre' : {type:String, 
		required:[true, 'El Nombre de usuario es requerido'], 
		minLength:[3, 'El mínimo de carácteres requeridos son 3'],
		maxLength:[100, 'El máximo de carácteres requeridos son 100'], 
		lowercase:true},
	'appPaterno' : {type:String, 
		required:[true, 'El apellido Paterno es requerido'], 
		minLength:[3, 'El mínimo de carácteres requeridos son 3'], 
		maxLength:[100, 'El máximo de carácteres requeridos son 100'], 
		lowercase:true, 
		index:true},
	'appMaterno' : {type:String, 
		required:[true, 'El apellido Materno es requerido'], 
		minLength:[3, 'El mínimo de carácteres requeridos son 3'], 
		maxLength:[100, 'El máximo de carácteres requeridos son 100'],
		lowercase:true},
	'rutaFoto' : {type:String, 
		required:[true, 'La foto de perfil es requerida']},
	'email' : {type:String, 
		required:[true, 'El correo electrónico es requerido'], 
		match:/.+\@.+\..+/, 
		unique:true,
		index:true},
	'contrasena' : {type:String, 
		required:[true, 'La contraseña es requerida']},
	'nivelEducativo' : {type:String, 
		required:[true,'El Nivel Educativo es requerido'],
		lowercase:true},
	'institucion' : {type:String, 
		required:[true,'La Institución es requerida'],
		lowercase:true},
	'especialidad' : {type:String, 
		enum:['Administración de Recursos Humanos',
		'Contabilidad','Electricidad','Lógistica',
		'Mecánica','Programación','Soporte y Mantenimiento a equipo de cómputo'],
		required:[true,'La Especialidad es requerida'],
		lowercase:true,
		index:true},
	'semestre' : {type:Number, 
		min : [1,'El mínimo aceptado es 1'],
		max : [6,'El máximo aceptado es 6'],
		required:[true,'El Semestre es requerido'],
		index:true},
	'turno' : {type:String, 
		enum:['matutino','vespertino','diurno'], 
		required:[true, 'El turno escolar es requerido'],
		index:true,
		lowercase:true},
	'fechaIngreso' : {type:Date, 
		default:Date.now},
	'token' : {type: Number,
		unique:true},
	'tokenExpiracion' :{type:Date},
	'confirmar': {type:String, 
		enum:['Si','Expirado','Null']}//Si=token confirmado, Expirado=token vencido, No= Sin confirmación
});

usuarioSchema.pre('save', function capitalizeName(next) {
	this.nombre = lowercase(this.nombre);
	this.appPaterno = lowercase(this.appPaterno);
	this.appMaterno = lowercase(this.appMaterno);
	next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);