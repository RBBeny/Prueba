'use strict';

module.exports = {
    getDocentesData(req, res) {
        return res.render('index', { title: 'Express Docente' });
    },
};