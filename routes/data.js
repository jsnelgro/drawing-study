var express = require('express');
var router = express.Router();
var fs = require('fs');
var conn = require('any-db').createConnection('sqlite3://participants.db');
var _i = 0;
router.post('/', function(req, res) {
	_i += 1;
	var imgName = 'drawing_'+_i+'.png'
	var datum = req.body;
	console.log(datum);
	var imgBuffer = decodeBase64Image(datum.img);
	fs.writeFile('participant_images/'+imgName, imgBuffer.data, function(err) {
		
		datum.word = 'some word';
		conn.query('INSERT INTO participants (word, image, taken, sex, age, comments) VALUES ($1,$2,$3,$4,$5,$6)',
			[datum.word, imgName, datum['taken-before'], datum.sex, datum.age, datum.comments])
		.on('error', console.error);
	});
});



function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}


module.exports = router;