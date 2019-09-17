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
const Video = require('../controllers/video');
const moment = require('moment');
const { dbComment } = require('../dbModels/comment');
const { dbUser } = require('../dbModels/user');
const { dbLike } = require('../dbModels/like');
const { dbDislike } = require('../dbModels/dislike');
const { dbView } = require('../dbModels/view');
const { createNotif } = require('../controllers/subscription');

router.post('/likeVideo', Video.likeVideo);
router.post('/dislikeVideo', Video.dislikeVideo);
router.post('/addComment', Video.addComment);
router.post('/removeComment', Video.removeComment);
router.post('/editComment', Video.editComment);
router.post('/saveComment', Video.saveComment);
router.post('/editVideo', Video.editVideo);
router.post('/saveVideo', Video.saveVideo);
router.post('/getComment', Video.getComment);

router.get('/upload1', (req, res) => {
	if (req.user) {
		res.render('upload1.ejs', { user: req.user });
	} else {
		res.redirect('/');
	}

})

router.get('/import/:id', (req, res) => {
	if (req.user) {
		res.render('import.ejs', { user: req.user, _id: req.params.id });
	} else {
		res.redirect('/');
	}
})



router.post('/getVideoDescription', async (req, res) => {
	if (!req.user) {
		res.status(400).send('Unauthorized');
	} else {
		try {
			_id = req.body._id;
			console.log('received id is ' + _id)
			let video = await dbVideo.findById(_id);
			if (!video) {
				throw new Error("Video is not available");
			}
			let uploader = await dbUser.findOne({ email: video.uploader });
			let iLiked = await dbLike.findOne({ videoId: _id, userEmail: req.user.email });
			let iDisliked = await dbDislike.findOne({ videoId: _id, userEmail: req.user.email });
			let comments = await dbComment.find({ videoId: _id });
			let likes = await dbLike.find({ videoId: _id }).count();
			let dislikes = await dbDislike.find({ videoId: _id }).count();
			console.log('This is comments ' + comments);
			console.log("iLiked " + iLiked);
			console.log('iDislikde ' + iDisliked);
			let dbview = new dbView({
				userEmail: req.user.email,
				videoId: _id,
			});
			let view = await dbView.findOne({ userEmail: req.user.email, videoId: _id });
			if (!view) {
				let result = await dbview.save();
				let temp = await dbVideo.findByIdAndUpdate({ _id: _id }, { $inc: { views: 1 } });
			}
			res.render('partials/comments.ejs', {
				video: video, iLiked: iLiked, iDisliked: iDisliked,
				uploader: uploader, comments: comments, moment: moment, userEmail: req.user.email,
				likes: likes, dislikes: dislikes
			});

		} catch (ex) {
			console.log("There is an error " + ex);
			res.send("Error " + ex.message);
		}
	}


});



router.post('/upload', async (req, res) => {

	if (!req.user) {
		res.redirect('/');
	}
	try {
		const uploadPath = path.join(__dirname, '../assets/'); 								// Register the upload path
		fs.ensureDir(uploadPath); 															// Make sure that he upload path exits
		var md5sum = crypto.createHash('md5');
		const fileName = crypto.randomBytes(20).toString('hex');
		const thumbnailName = crypto.randomBytes(20).toString('hex');
		var fstream;
		var busboy = new Busboy({ headers: req.headers });

		var params = {
			description: '',
			id: fileName,
			title: '',
			uploader: req.user.email,
			hash: '',
			tags: [],
			genre: '',
			isPrivate: false,
			thumbnailName: thumbnailName,
			uploaderName: ''
		};
		var hash;
		var videoOk = 0;
		var thumbnailOk = 0;
		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {			// file is an event listener , is fired
			file.on('data', function (data) {												//  whenever file stream is found
				if (mimetype == 'video/mp4') {
					md5sum.update(data);
				}															// update the hash
			});
			if (mimetype == 'video/mp4') {
				videoOk = 1;
				fstream = fs.createWriteStream(path.join(uploadPath, fileName + '.mp4'));
			} else if (mimetype == 'image/jpeg') {
				thumbnailOk = 1;
				fstream = fs.createWriteStream(path.join(uploadPath, thumbnailName + '.png'));
			} else {
				file.resume();
				return;
			}
			file.pipe(fstream);																// pipes the output of file listener to fstream
			file.on('end', function () {														// on ending the listening
				hash = md5sum.digest('hex');
				// console.log('File [' + fieldname + '] Finished');
			});
		});

		busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {		// field is an event listener
			console.log('Field [' + fieldname + ']: value: ' + val);
			if (fieldname == 'tags') {
				params[fieldname] = val.split(',');
			} else {
				params[fieldname] = val;
			}

		});

		busboy.on('finish', function () {
			console.log('Done parsing form!');
			console.log('videoOk ' + videoOk);
			console.log('thumbnailOk ' + thumbnailOk);
			if (thumbnailOk != 1 || videoOk != 1) {
				if (thumbnailOk == 1) {
					fs.unlink('./assets/' + thumbnailName + '.png');
				}
				if (videoOk == 1) {
					fs.unlink('./assets/' + fileName + '.mp4');
				}
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ code: -1, message: "Invalid file format" }));
				res.end();
				//res.end({ code: -1, message: "Invalid file format" });
				//res.end();
			} else {
				params.hash = hash;
				params.uploaderName = req.user.name;
				console.log(" in finish event ");
				let result = validate(params);
				if (result.error) {
					console.log(result);
					fs.unlink('./assets/' + thumbnailName + '.png');
					fs.unlink('./assets/' + fileName + '.mp4');
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ code: -1, message: result.error }));
					res.end();
					//res.end();
				} else {
					console.log('success');
					dbVideo.findOne({ hash: hash }, (err, oldvideo) => {
						if (!oldvideo) {
							dbvideo = new dbVideo(params);
							dbvideo.save(async (err, savedVideo) => {
								if (err) {
									console.log('error occured' + err);
									res.send({ code: -1, message: "Internal Server error" });
								} else {
									await createNotif(req.user, savedVideo);
									res.send({ code: 1 });
									//res.end();
									console.log('Success ' + savedVideo);
								}
							});
						} else if (oldvideo) {
							fs.unlink('./assets/' + fileName + '.mp4', (err) => {
								if (err) {
									console.log("in finish db useer " + err);
									res.writeHead(200, { 'Content-Type': 'application/json' });
									res.write(JSON.stringify({ code: -1, message: "Internal Server error" }));
									res.end();
								} else {
									console.log('successfully deleted ' + fileName + '.mp4');
									console.log("oldvideo uploader " + oldvideo.uploader);
									console.log("new video uploade " + params.uploader);
									if (oldvideo.uploader == params.uploader) {
										console.log('successfully deleted thumbnail ' + thumbnailName + '.png');
										fs.unlink('./assets/' + thumbnailName + '.png', (err) => {
											console.log("starting write");
											res.writeHead(200, { 'Content-Type': 'application/json' });
											res.write(JSON.stringify({ code: -1, message: 'You have already uploaded this video' }));
											res.end();
											console.log('write end');
										})

									} else {
										params.id = oldvideo.id;
										dbvideo = new dbVideo(params);
										dbvideo.save(async (err, savedVideo) => {
											if (err) {
												console.log('error occured' + err);
												res.writeHead(200, { 'Content-Type': 'application/json' });
												res.write(JSON.stringify({ code: -1, message: "Internal Server error" }));
												res.end();
											} else {
												await createNotif(req.user, savedVideo);
												res.writeHead(200, { 'Content-Type': 'application/json' });
												res.write(JSON.stringify({ code: 1 }));
												res.end();
												console.log('Success ' + savedVideo);
											}
										})
									}
								}

							});
						} else {
							console.log(err);
							res.send({ code: -1, message: "Internal Server error" });
						}
					})
				}

			}

		});
	} catch (ex) {
		console.log('error in upload route :: ' + ex)
	}


	req.pipe(busboy);
});



router.post('/import/:id', async (req, res) => {

	if (!req.user) {
		res.redirect('/');
	}
	try {
		var _id = req.params.id;
		console.log(_id);
		let dbvideo = await dbVideo.findById(_id);
		if (!dbvideo) {
			return res.send({ code: -1, message: 'This video is not available' })
		}
		let dbvideo2 = await dbVideo.findOne({hash : dbvideo.hash,uploader : req.user.email});
		if (dbvideo2) {
			return res.send({ code: -1, message: 'This video is already in your account' });
		}

		const uploadPath = path.join(__dirname, '../assets/'); 								// Register the upload path
		fs.ensureDir(uploadPath); 															// Make sure that he upload path exits
		//	var md5sum = crypto.createHash('md5');
		//	const fileName = crypto.randomBytes(20).toString('hex');
		const thumbnailName = crypto.randomBytes(20).toString('hex');
		var fstream;
		var busboy = new Busboy({ headers: req.headers });
		console.log(dbvideo);
		var params = {
			description: '',
			id: dbvideo.id,
			title: '',
			uploader: req.user.email,
			hash: dbvideo.hash,
			tags: [],
			genre: '',
			isPrivate: false,
			thumbnailName: thumbnailName,
			uploaderName: req.user.name
		};
		//	var hash;
		//	var videoOk = 0;
		var thumbnailOk = 0;
		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {			// file is an event listener , is fired
			// file.on('data', function (data) {												//  whenever file stream is found
			// 																				// update the hash
			// });
			if (mimetype == 'image/jpeg') {
				thumbnailOk = 1;
				fstream = fs.createWriteStream(path.join(uploadPath, thumbnailName + '.png'));
			} else {
				file.resume();
				return;
			}
			file.pipe(fstream);																// pipes the output of file listener to fstream
			file.on('end', function () {														// on ending the listening
				// console.log('File [' + fieldname + '] Finished');
			});
		});

		busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {		// field is an event listener
			console.log('Field [' + fieldname + ']: value: ' + val);
			if (fieldname == 'tags') {
				params[fieldname] = val.split(',');
			} else {
				params[fieldname] = val;
			}

		});

		busboy.on('finish', function () {
			console.log('Done parsing form!');
			console.log('thumbnailOk ' + thumbnailOk);
			if (thumbnailOk != 1) {
				if (thumbnailOk == 1) {
					fs.unlink('./assets/' + thumbnailName + '.png');
				}
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ code: -1, message: "Invalid file format" }));
				res.end();
			} else {
				let result = validate(params);
				if(result.error){
					console.log(params);
					fs.unlink('./assets/' + thumbnailName + '.png');
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ code: -1, message: result.error }));
					res.end();
				}else{
					let dbvideo = new dbVideo(params);
					dbvideo.save((err, savedVideo) => {
						if (err) {
							console.log('Removing ' + thumbnailName + '.png');
							fs.unlink('./assets/' + thumbnailName + '.png');
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.write(JSON.stringify({ code: -1, message: "Internal Server error" }));
							res.end();
						} else {
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.write(JSON.stringify({ code: 1, message: "Successfully imported video" }));
							res.end();
						}
					})
				}
			}
		});
	} catch (ex) {
		console.log('error in upload route :: ' + ex)
	}


	req.pipe(busboy);
});


module.exports = router;
