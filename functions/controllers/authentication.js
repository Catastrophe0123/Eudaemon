var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

exports.getLogin = async (req, res) => {
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
};

exports.postSignup = async (req, res) => {
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

		await admin.auth().setCustomUserClaims(data.user.uid, {
			role: newUser.role,
			organisation: newUser.organisation,
		});

		// TRYING CUSTOM TOKEN
		// const newToken = await admin.auth().createCustomToken(data.user.uid, {
		// 	role: newUser.role,
		// 	organisation: newUser.organisation,
		// });

		newUser['createdAt'] = new Date().toISOString();
		newUser['uid'] = data.user.uid;
		await db.doc(`users/${newUser['uid']}`).set(newUser);

		// let token = await data.user.getIdToken();

		return res.status(201).json({
			message: `user ${data.user.uid} created`,
			token: await data.user.getIdToken(),
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.postLogin = async (req, res) => {
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
			// let customToken = await admin
			// 	.auth()
			// 	.createCustomToken(data.user.uid, {
			// 		role: role,
			// 		organisation: organisation,
			// 	});
			let token = await data.user.getIdToken();
			return res.status(200).json({ token: token });
		} else {
			return res
				.status(400)
				.json({ error: 'invalid/wrong role or organisation' });
		}
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};
