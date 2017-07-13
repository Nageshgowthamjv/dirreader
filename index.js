var http = require('http');
var folderReader = require('./dirReader');

http.createServer((request, response) => {

	var content = folderReader.readDirSync('./a');
	console.log(content);

	folderReader.readDir('./a', function(err, res) {
		console.log('Final Async : ', res);
	});

	response.writeHead(200, '', {
		'Content-type': 'text/plain'
	});
	response.write('Server is running...');
	response.end();

}).listen(8888);

console.log('Server is runner on port: 8888 ...');