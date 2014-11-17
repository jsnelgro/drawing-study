var express = require('express');
var fs = require('fs');
var router = express.Router();
var word_names = null;

/* GET home page. */
router.get('/', function(req, res) {
	var randWord = 'bobo';
	if (word_names === null) {
		fs.readdir('./public/word_clips/',function(err, names){
			names.shift(); //gets rid of the .DS_STORE
			randWord = names[Math.floor(Math.random() * names.length)].replace('.mp3','');
			res.render('index', { word: randWord, audio: './word_clips/'+randWord+'.mp3' });

		});
	} 
	else {
		res.render('index', { word: randWord, audio: './word_clips/'+randWord+'.mp3' });
	}
});

module.exports = router;
