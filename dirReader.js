var fs = require('fs');
var path = require('path');

function readDirSync(folder, filenames = [], dirnames = []) {
	folder = path.normalize(folder);
	let fsContents = [];
	try {
		fsContents = fs.readdirSync(folder);
	} catch (err) {
		throw {
			name: "Error",
			message: "Path is not available"
		};
	}

	fsContents.forEach(x => {
		var currentPath = path.join(folder, x);
		var stat = fs.statSync(currentPath);

		if (stat.isFile()) {
			filenames.push(currentPath);
		} else if (stat.isDirectory()) {
			dirnames.push(currentPath);
			readDirSync(currentPath, filenames, dirnames);
		}
	});

	return {
		filenames,
		dirnames
	};
}

function readDir(folder, callback, filenames = [], dirnames = [], errors = []) {

	folder = path.normalize(folder);

	fs.readdir(folder, (err, fsContents) => {

		if (err) {
			errors.push(err);
			isDone(callback, 0, 0, filenames, dirnames, errors);
			return;
		}

		let total = fsContents.length;
		let done = 0;

		fsContents.forEach(function(x) {

			var currentPath = path.join(folder, x);
			fs.stat(currentPath, (err, stat) => {
				if (err) {
					done++;
					errors.push(err);
					isDone(callback, done, total, filenames, dirnames, errors);
					return;
				}

				if (stat.isFile()) {
					filenames.push(currentPath);
					done++;
					isDone(callback, done, total, filenames, dirnames, errors);
				} else if (stat.isDirectory()) {
					dirnames.push(currentPath);
					readDir(currentPath, function() {
						done++;
						isDone(callback, done, total, filenames, dirnames, errors);
					}, filenames, dirnames, errors);
				}

			});

		});

	});

}

var isDone = function(callback, done, total, filenames, dirnames, errors) {

	if (done == total) {
		if (errors.length > 0) {
			callback(errors);
		} else {
			callback('', {
				filenames,
				dirnames
			});
		}

	}
}


module.exports = {
	readDir,
	readDirSync
};