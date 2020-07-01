var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');
const fbconfig = require('../firebaseconfigjson');

exports.uploadSIR = async (req, res) => {
	const id = req.params.id;
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');

	const busboy = new BusBoy({ headers: req.headers });

	let fileName;
	let fileToBeUploaded = {};

	console.log('i ran here');

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log(fieldname);
		console.log(filename);
		console.log(mimetype);

		const extension = filename.split('.')[filename.split('.').length - 1];
		fileName = `${Math.round(Math.random() * 10000000000)}.${extension}`;
		const filePath = path.join(os.tmpdir(), fileName);
		fileToBeUploaded = { filePath, mimetype };

		file.pipe(fs.createWriteStream(filePath));
	});

	busboy.on('finish', async () => {
		try {
			let x = await admin
				.storage()
				.bucket(fbconfig.storageBucket)
				.upload(fileToBeUploaded.filePath, {
					resumable: false,
					metadata: {
						metadata: {
							contentType: fileToBeUploaded.mimetype,
						},
					},
				});
			const fileurl = `https://firebasestorage.googleapis.com/v0/b/${fbconfig.storageBucket}/o/${fileName}?alt=media`;

			let writeResult = await db.doc(`children/${id}`).update({
				SIR: fileurl,
				SIRUploadedByUser: req.user.email,
				SIHUploadedBy: req.user.user_id,
			});
			return res
				.status(201)
				.json({ message: `SIR uploaded at ${fileurl} successfully` });
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: err.code });
		}
	});
	busboy.end(req.rawBody);
};
