var express = require('express');
var router = express.Router();
var conn = require('any-db').createConnection('sqlite3://participants.db');

router.get('/', function(req, res){
	var sql = 'SELECT * FROM participants';
	conn.query(sql, function(err, db_res){
		if (db_res === undefined) {
			db_res = {};
			db_res.rows = [];
		}
		data = {};
		data.res = db_res.rows;
		res.render('results',data);
	});
});

module.exports = router;