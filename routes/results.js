var express = require('express');
var router = express.Router();
var conn = require('any-db').createConnection('sqlite3://participants.db');
var basicAuth = require('basic-auth');
var passwords = require('../passwords');

var auth = function(req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.send(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === passwords.user && user.pass === passwords.password) {
		return next();
	} else {
		return unauthorized(res);
	};
};

router.get('/', auth, function(req, res) {
	var sql = 'SELECT * FROM participants';
	conn.query(sql, function(err, db_res) {
		if (db_res === undefined) {
			db_res = {};
			db_res.rows = [];
		}
		data = {};
		data.res = db_res.rows;
		res.render('results', data);
	});
});

module.exports = router;