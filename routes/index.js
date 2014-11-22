var express = require('express');
var fs = require('fs');
var router = express.Router();
var word_names = [];
var cb_i = -1; // an incrementer for counterbalancing word order

/* GET home page. */
router.get('/', function(req, res) {
	if (cb_i >= word_names.length-1) {
		cb_i = -1;
	}
	cb_i += 1; //why do I hate else statements so much?

	//get the word names in the word_clips folder and add them to an array
	if (word_names.length <= 0) {
		fs.readdir('./public/word_clips/',function(err, names){
			var words_to_send = [];
			
			for(name in names){
				//make sure not to add hidden files
				if(!isUnixHidden(names[name])){
					words_to_send.push(names[name].replace('.mp3',''));
				}
			}
			//save the array
			word_names = words_to_send;
			// console.log(counterbalance(words_to_send, cb_i));
			res.render('index', { words: counterbalance(words_to_send, cb_i)});

		});
	} 
	else {
		res.render('index', { words: counterbalance(word_names, cb_i)});
	}
});

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
function isUnixHidden(path) {
    return (/(^|.\/)\.+[^\/\.]/g).test(path);
};

/**
 * Uses a counter to increment the shifting of array elements
 * for counterbalancing based on the latin square method for doing so. 
 */
function counterbalance(_array, _i) {
	var to_move = _array.slice(0, _i);
	var to_not_move = _array.slice(_i, _array.length);
	_array = to_not_move.concat(to_move);
	return _array;
}

module.exports = router;
