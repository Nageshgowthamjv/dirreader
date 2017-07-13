var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var dirReader = require('../dirReader');

function init() {
	//Initial setup for testing the code
	/* Dir structure*/
	//	test1
	//	|
	//	|- test2
	//	|	|-test5
	//	|	|-text2.txt
	//	|
	//	|- test3
	//	|   |-test6
	//	|	|-text3.txt
	//	|
	//	|- test4
	//	|   |-text4  - No file-type
	//	|
	//	|- text1.txt


	//create dir	
	fs.mkdirSync('./test1');
	fs.mkdirSync('./test1/test2');
	fs.mkdirSync('./test1/test3');
	fs.mkdirSync('./test1/test4');
	fs.mkdirSync('./test1/test2/test5');
	fs.mkdirSync('./test1/test3/test6');
	//create files
	fs.closeSync(fs.openSync('./test1/text1.txt', 'w'));
	fs.closeSync(fs.openSync('./test1/test2/text2.txt', 'w'));
	fs.closeSync(fs.openSync('./test1/test3/text3.txt', 'w'));
	fs.closeSync(fs.openSync('./test1/test4/text4', 'w')); //file with no file-type
}

function destroy() {
	//clean files
	fs.unlinkSync('./test1/text1.txt');
	fs.unlinkSync('./test1/test2/text2.txt');
	fs.unlinkSync('./test1/test3/text3.txt');
	fs.unlinkSync('./test1/test4/text4');
	//clean the initial setup
	fs.rmdirSync('./test1/test3/test6');
	fs.rmdirSync('./test1/test2/test5');
	fs.rmdirSync('./test1/test4');
	fs.rmdirSync('./test1/test3');
	fs.rmdirSync('./test1/test2');
	fs.rmdirSync('./test1');
}

before(function() {
	init();
});

after(function() {
	destroy();
});


describe('1. API readDirSync - Synchronous', function() {

	describe('Reading the root dir : +ve Testcases', function() {

		it(' +ve: Test reading with root dir', function() {
			let result = dirReader.readDirSync('./test1');
			let expected = {
				filenames: [
					path.normalize('test1/test2/text2.txt'),
					path.normalize('test1/test3/text3.txt'),
					path.normalize('test1/test4/text4'),
					path.normalize('test1/text1.txt')
				],
				dirnames: [
					path.normalize('test1/test2'),
					path.normalize('test1/test2/test5'),
					path.normalize('test1/test3'),
					path.normalize('test1/test3/test6'),
					path.normalize('test1/test4')
				]
			};

			expect(result).to.have.property('filenames').with.lengthOf(4);
			expect(result).to.have.property('dirnames').with.lengthOf(5);

			expect(result.filenames).to.deep.equal(expected.filenames);
			expect(result.dirnames).to.deep.equal(expected.dirnames);
		});

		it(' +ve: Test reading with sub-dir', function() {
			let result = dirReader.readDirSync('./test1/test2');
			let expected = {
				filenames: [path.normalize('test1/test2/text2.txt')],
				dirnames: [path.normalize('test1/test2/test5')]
			};
			expect(result).to.have.property('filenames').with.lengthOf(1);
			expect(result).to.have.property('dirnames').with.lengthOf(1);

			expect(result.filenames).to.deep.equal(expected.filenames);
			expect(result.dirnames).to.deep.equal(expected.dirnames);
		});

		it(' +ve: Test reading with sub-dir having file with no file-type', function() {
			let result = dirReader.readDirSync('./test1/test4');
			let expected = {
				filenames: [path.normalize('test1/test4/text4')],
				dirnames: []
			};
			expect(result).to.have.property('filenames').with.lengthOf(1);
			expect(result).to.have.property('dirnames').with.lengthOf(0);

			expect(result.filenames).to.deep.equal(expected.filenames);
			expect(result.dirnames).to.deep.equal(expected.dirnames);
		});

		it(' +ve: Test reading with sub-dir having no data : returns an empty object', function() {
			let result = dirReader.readDirSync('./test1/test3/test6');
			let expected = {
				filenames: [],
				dirnames: []
			};
			expect(result).to.have.property('filenames').with.lengthOf(0);
			expect(result).to.have.property('dirnames').with.lengthOf(0);

			expect(result.filenames).to.deep.equal(expected.filenames);
			expect(result.dirnames).to.deep.equal(expected.dirnames);
		});


	});

	describe('Reading the root dir : -ve Testcases', function() {
		it(' -ve: Test reading invalid dir', function() {
			expect(() => dirReader.readDirSync('./test0')).to.throw();
		});

		it(' -ve: Test reading invalid sub-dir', function() {
			expect(() => dirReader.readDirSync('./test1/test7')).to.throw();
		});

	});


});

describe('2. API readDir - Asynchronous', function() {

	describe('Reading the root dir : +ve Testcases', function() {

		it('+ve: Test reading with root dir', function() {
			dirReader.readDir('./test1', function(err, result) {

				let expected = {
					filenames: [
						path.normalize('test1/test2/text2.txt'),
						path.normalize('test1/test3/text3.txt'),
						path.normalize('test1/test4/text4'),
						path.normalize('test1/text1.txt')
					],
					dirnames: [
						path.normalize('test1/test2'),
						path.normalize('test1/test2/test5'),
						path.normalize('test1/test3'),
						path.normalize('test1/test3/test6'),
						path.normalize('test1/test4')
					]
				};

				expect(result).to.have.property('filenames').with.lengthOf(4);
				expect(result).to.have.property('dirnames').with.lengthOf(5);

				expect(result.filenames).to.include.members(expected.filenames);
				expect(result.dirnames).to.include.members(expected.dirnames);
			});
		});

		it('+ve: Test reading with sub-dir', function() {
			dirReader.readDir('./test1/test2', function(err, result) {
				let expected = {
					filenames: [path.normalize('test1/test4/text4')],
					dirnames: []
				};
				expect(result).to.have.property('filenames').with.lengthOf(1);
				expect(result).to.have.property('dirnames').with.lengthOf(0);

				expect(result.filenames).to.include.members(expected.filenames);
				expect(result.dirnames).to.include.members(expected.dirnames);
			});
		});

		it('+ve: Test reading with sub-dir having file with no file type', function() {
			dirReader.readDir('./test1/test4', function(err, result) {
				let expected = {
					filenames: [path.normalize('test1/test4/text4')],
					dirnames: []
				};
				expect(result).to.have.property('filenames').with.lengthOf(1);
				expect(result).to.have.property('dirnames').with.lengthOf(0);

				expect(result.filenames).to.deep.equal(expected.filenames);
				expect(result.dirnames).to.deep.equal(expected.dirnames);
			});
		});

		it('+ve: Test reading with sub-dir having no data : returns an empty object', function() {
			dirReader.readDir('./test1/test3/test6', function(err, result) {
				let expected = {
					filenames: [],
					dirnames: []
				};
				expect(result).to.have.property('filenames').with.lengthOf(0);
				expect(result).to.have.property('dirnames').with.lengthOf(0);

				expect(result.filenames).to.deep.equal(expected.filenames);
				expect(result.dirnames).to.deep.equal(expected.dirnames);
			});
		});

	});

	describe('Reading the root dir : -ve Testcases', function() {
		it('-ve: Test reading invalid dir', function() {
			dirReader.readDir('./invalid', function(err, result) {
				expect(err).to.be.not.empty;
				expect(err.length).to.equal(1);
			});
		});

		it('-ve: Test reading invalid sub-dir', function() {
			dirReader.readDir('./test1/invalid', function(err, result) {
				expect(err).to.be.not.empty;
				expect(err.length).to.equal(1);
			});
		});

	});


});