const express = require('express');
const passport = require('passport');
const User = require('../controllers/user');
const Busboy = require('busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');
var router = express.Router();
const algorithm = 'sha256';
const crypto = require('crypto');
const { dbVideo, validate } = require('../dbModels/video');

router.get('/upload1', (req, res) => {
	if (req.user) {
		res.render('upload1.ejs', { user: req.user });
	} else {
		res.redirect('/');
	}

})
// router.post('/upload',(req, res, next) => {

//     var hash = crypto.createHash(algorithm);
//     req.pipe(req.busboy); // Pipe it trough busboy

//     const uploadPath = path.join(__dirname, '../assets/'); // Register the upload path
//     fs.ensureDir(uploadPath); // Make sure that he upload path exits
//     console.log(uploadPath);
//     req.busboy.on('file', (fieldname, file, filename) => {
//         console.log(`Upload of '${filename}' started`);
// 		file.on('data',(data)=>{
// 		//	console.log(data);			
// 		})
//         // Create a write stream of the new file
//         const fstream = fs.createWriteStream(path.join(uploadPath, filename));
//         // Pipe it trough
//        // hash.update(file);
//         file.pipe(fstream);

//         // On finish of the upload      
//         fstream.on('close', () => {
//           //  hash = hash.digest('hex')
//             console.log(hash);
//             console.log(`Upload of '${filename}' finished`);
//             res.send('successfully uploaded ' + filename);
//         });
//     });
// });



router.post('/upload', async (req, res) => {
	// console.log('file ' + req.file);
	// console.log('files ' + req.files);
	if (!req.user) {
		res.redirect('/');
	}
	const uploadPath = path.join(__dirname, '../assets/'); 								// Register the upload path
	fs.ensureDir(uploadPath); 															// Make sure that he upload path exits
	var md5sum = crypto.createHash('md5');
	const fileName = crypto.randomBytes(20).toString('hex');
	const fstream = fs.createWriteStream(path.join(uploadPath, fileName + '.mp4'));
	var busboy = new Busboy({ headers: req.headers });

	var params = {
		description: '',
		id: fileName,
		title: '',
		uploader: req.user.email,
		hash: '',
		tags: [],
		genre: '',
		isPrivate: false
	};
	var hash;
	busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {			// file is an event listener , is fired
		file.on('data', function (data) {												//  whenever file stream is found
			md5sum.update(data);															// update the hash
		});

		file.pipe(fstream);																// pipes the output of file listener to fstream
		file.on('end', function () {														// on ending the listening
			hash = md5sum.digest('hex');
			console.log('File [' + fieldname + '] Finished');
		});
	});

	busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {		// field is an event listener
		console.log('Field [' + fieldname + ']: value: ' + val);
		if(fieldname == 'tags'){
			params[fieldname] = val.split(',');
		}else{
			params[fieldname] = val;
		}
		
	});

	busboy.on('finish', function () {
		console.log('Done parsing form!');
		console.log(params);
		if (!params || !hash) {
			res.status(400).send("Something went wrong");
			res.end();
		}
		params.hash = hash;
		let result = validate(params);
		if (result.error) {
			console.log(result);
			res.status(400).send(result);
			res.end();
		} else {
			console.log('success');
		}
		dbVideo.findOne({ hash: hash }, (err, oldvideo) => {
			if (!oldvideo) {
				dbvideo = new dbVideo(params);
				dbvideo.save((err, savedVideo) => {
					if (err) {
						console.log('error occured' + err);
						res.send('Error OCCured ' + err);
					} else {
						res.send({ code: 1 });
						res.end();
						console.log('Success ' + savedVideo);
					}
				})
			} else if (oldvideo) {
				fs.unlink('./assets/' + fileName + '.mp4', (err) => {
					if (err) {
						console.log(err);
						res.writeHead(409, { Connection: 'close' });
						res.send("error" + err);
					}
					console.log('successfully deleted ' + fileName + '.mp4');
					if (oldvideo.uploader == params.uploader) {
						res.writeHead(303, { Connection: 'close' });
						res.send("You hav already uploaded this file");
					} else {
						params.id = oldvideo.id;
						dbvideo = new dbVideo(params);
						dbvideo.save((err, savedVideo) => {
							if (err) {
								console.log('error occured' + err);
								res.writeHead(409, { Connection: 'close' });
								res.send("error " + err);
							} else {
								res.writeHead(303, { Connection: 'close' });
								res.send("You hav already uploaded this file");
								console.log('Success ' + savedVideo);
							}
						})
					}
				});
			} else {
				console.log(err);
				res.status(500).send("Internal server error");
			}
		})
		// dbvideo = new dbVideo(params);

		// result = dbvideo.save((err,savedVideo)=>{
		// 	if(err){
		// 		console.log('error occured' + err);
		// 		res.send('Error OCCured ' + err);
		// 	}else{
		// 		res.send({code:1});
		// 		res.end();
		// 		console.log('Success ' + savedVideo);
		// 	}	
		// })
		//   res.writeHead(303, { Connection: 'close'});
		//   res.end();
	});



	req.pipe(busboy);
});

module.exports = router;
