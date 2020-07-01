var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

exports.createChild = async (req, res) => {
	// user is verified

	try {
		console.log('consoling : ', req.user);
		childData = req.body;

		// route should not be accessible to role="CCI"

		if (req.user.role === 'CCI') {
			return res.status(401).json({ error: 'unauthorized user' });
		}

		// user is not CCI
		childData['createdAt'] = new Date().toISOString();
		childData['createdByUser'] = req.user.email;
		childData['createdBy'] = req.user.user_id;
		// create entry in db
		let doc = await db.collection('children').add(childData);
		// created successfully
		return res.status(201).json({
			message: `child with id : ${doc.id} created successfully`,
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: 'something went wrong', err: err });
	}
};
