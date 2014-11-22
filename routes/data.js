var express = require('express');
var router = express.Router();
var fs = require('fs');
var conn = require('any-db').createConnection('sqlite3://participants.db');
var uuid = require('node-uuid');
var async = require('async');
var get_ip = require('ipware')().get_ip;
var db_query =
	'INSERT INTO participants (' +
	'bibi_img, bibi_duration, bibi_times_cleared,' +
	' boba_img, boba_duration, boba_times_cleared,' +
	' kiki_img, kiki_duration, kiki_times_cleared,' +
	' koka_img, koka_duration, koka_times_cleared,' +
	' zizi_img, zizi_duration, zizi_times_cleared,' +
	' zoza_img, zoza_duration, zoza_times_cleared,' +
	' taken, sex, age, ip_address, device_type, comments)' +
	' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,' +
	' $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)';

//main router response
router.post('/', function(req, res) {
	var ip_address = get_ip(req).clientIp || 'unknown';
	var device = req.device.type || 'unknown';

	write_images(req.body, function(datum) {
		// console.log(datum);
		if (datum === 'err') {
			res.send('uh oh, something weird happened');
		}

		var db_insert = [
			datum.imgs.bibi.img, datum.imgs.bibi.duration, datum.imgs.bibi.times_cleared,
			datum.imgs.boba.img, datum.imgs.boba.duration, datum.imgs.boba.times_cleared,
			datum.imgs.kiki.img, datum.imgs.kiki.duration, datum.imgs.kiki.times_cleared,
			datum.imgs.koka.img, datum.imgs.koka.duration, datum.imgs.koka.times_cleared,
			datum.imgs.zizi.img, datum.imgs.zizi.duration, datum.imgs.zizi.times_cleared,
			datum.imgs.zoza.img, datum.imgs.zoza.duration, datum.imgs.zoza.times_cleared,
			datum.taken_before, datum.sex, datum.age, ip_address, device, datum.comments
		];

		//add to db and respond with a thank you card.
		conn.query(db_query, db_insert, function(db_err, db_res) {
			if (db_err) {
				res.send('error could not add data');
			} else {
				res.send('thank you!');
			}
		});
	});
});


function write_images(datum, master_callback) {
	if (datum === undefined) {
		master_callback('err');
	}
	var _datum = datum;
	//init an array for pushing async write functions to.
	var word_names = [];
	//loop through image names and put into array for async module
	for (var word_name in _datum.imgs) {
		if (_datum.imgs.hasOwnProperty(word_name)) {
			word_names.push(word_name);
		}
	}
	// for the love of jove, callbacks...
	async.each(word_names,
		function(word_name, callback) {
			//convert b64 to buffer
			decodeBase64Image(_datum.imgs[word_name].img, function(decode_res) {
				var imgID = uuid.v1();
				fs.writeFile('public/imgs/participant_images/' + imgID + '.png', decode_res.data, function(write_err) {
					if (write_err) {
						console.log('write err: ', write_err);
					}
					// update the db_insert array with the new image name
					_datum.imgs[word_name].img = imgID;
					callback();
				});
			});
		},
		function() {
			master_callback(_datum);
		});
}

function decodeBase64Image(dataString, callback) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	callback(response);
}

module.exports = router;