var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

exports.createEmployee = async (req, res) => {
	try {
		let district = req.body.district;
		let empData = req.body;
		empData['createdAt'] = new Date().toISOString();
		empData['createdBy'] = req.user.user_id;
		empData['createdByUser'] = req.user.email;
		// we have req.dcpuData
		let doc = await db.collection('employees').add(empData);
		return res
			.status(201)
			.json({ message: 'employee created successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'an error occured' });
	}
};
