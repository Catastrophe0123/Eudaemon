const functions = require('firebase-functions');

// const admin = require('firebase-admin');
// admin.initializeApp();

var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://eudaemon-20a5e.firebaseio.com',
});

const db = admin.firestore();

const express = require('express');
const app = express();

const firebase = require('firebase');

const firebaseConfig = require('./firebaseConfig');
firebase.initializeApp(firebaseConfig);

// TODO: validation
// returns the list of organisations in the db
/**
 * example response = 
 * {
    "cwc": [
        "S2RXMzLQrkf9UWWQmTFq",
        "chennai-cwc1"
    ],
    "cci": [
        "chennai-cci1"
    ],
    "dcpu": [
        "WaMhgeFtHnKMxr98nXwI",
        "chennai-dcpu1"
    ]
}
 */
app.get('/login', async (req, res) => {
	try {
		let result = {};

		let cwc = await db.collection('/cwc').listDocuments();
		let values = [];
		cwc.forEach((el) => {
			values.push(el.id);
		});
		result['cwc'] = values;

		let cci = await db.collection('/cci').listDocuments();
		values = [];
		cci.forEach((el) => values.push(el.id));
		result['cci'] = values;

		let dcpu = await db.collection('/dcpu').listDocuments();
		values = [];
		dcpu.forEach((el) => values.push(el.id));
		result['dcpu'] = values;

		return res.status(200).json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

// signup route
// TODO: Validation
app.post('/signup', async (req, res) => {
	let availableRoles = ['CCI', 'CWC', 'DCPU', 'PO'];

	if (!availableRoles.includes(req.body.role)) {
		return res.status(400).json({ error: 'invalid role' });
	}

	try {
		const newUser = {
			email: req.body.email,
			role: req.body.role,
			organisation: req.body.organisation,
		};

		let data = await firebase
			.auth()
			.createUserWithEmailAndPassword(newUser.email, req.body.password);

		// await admin
		// 	.auth()
		// 	.setCustomUserClaims(data.user.uid, { role: newUser.role });

		// TRYING CUSTOM TOKEN
		const newToken = await admin.auth().createCustomToken(data.user.uid, {
			role: newUser.role,
			organisation: newUser.organisation,
		});

		newUser['createdAt'] = new Date().toISOString();
		newUser['uid'] = data.user.uid;
		await db.doc(`users/${newUser['uid']}`).set(newUser);

		// let token = await data.user.getIdToken();

		return res
			.status(201)
			.json({ message: `user ${data.user.uid} created`, newToken });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
});

//LOGIN ROUTE
// TODO: Validation
/**
 * req.body = {
    email: String,
    password: String,
    role: "CCI" | "CWC" | "DCPU" | "PO",
    organisation: String
}
 */
app.post('/login', async (req, res) => {
	let availableRoles = ['CCI', 'CWC', 'DCPU', 'PO'];

	if (!availableRoles.includes(req.body.role)) {
		return res.status(400).json({ error: 'invalid role' });
	}

	try {
		const user = {
			email: req.body.email,
			password: req.body.password,
		};
		let role = req.body.role;
		let organisation = req.body.organisation;

		let data = await firebase
			.auth()
			.signInWithEmailAndPassword(user.email, user.password);
		console.log(data.user.uid);
		// have to check if the roles are same
		let doc = await db.doc(`users/${data.user.uid}`).get();
		if (!doc.exists) {
			return res.status(400).json({ error: 'error occurred' });
		}

		console.log(doc.data());
		collection = doc.data();

		if (
			collection.role === role &&
			collection.organisation === organisation
		) {
			// correct - generate custom token and return
			let customToken = await admin
				.auth()
				.createCustomToken(data.user.uid, {
					role: role,
					organisation: organisation,
				});
			return res.status(200).json({ token: customToken });
		} else {
			return res
				.status(400)
				.json({ error: 'invalid/wrong role or organisation' });
		}
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
});

exports.api = functions.https.onRequest(app);
// exports.api = functions.region('asia-east2').https.onRequest(app);
