const { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

const isCorrectCCI = async (req, res, next) => {
	// req.user.organisation contains the location of the entity
	let id = req.params.id;
	// id is the child id

	let allowedRoles = ['CWC', 'PO', 'DCPU'];
	if (allowedRoles.includes(req.user.role)) {
		// move to the next thing : authorized
		return next();
	}

	if (req.user.role === 'CCI') {
		let doc = await db.doc(`children/${id}`).get();
		if (!doc.exists) {
			// invalid id i guess
			return res
				.status(400)
				.json({ message: 'document does not exist. wrong id' });
		} else {
			// doc exists
			let docData = doc.data();
			if (docData.organisation === req.user.organisation) {
				// authorised
				req.childData = docData;
				return next();
			} else {
				// unauthorized
				return res
					.status(403)
					.json({ message: 'You do not have access to this data' });
			}
		}
	}
};

module.exports = isCorrectCCI;
