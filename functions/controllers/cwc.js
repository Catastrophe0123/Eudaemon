var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

exports.createCWC = async (req, res) => {
	// create a dcpu

	let name = req.body.name;

	try {
		// create a dcpu
		let doc = await db.collection('cwc').listDocuments();
		if (doc.contains(name)) {
			return res.status(400).json({
				error: `A CWC with the name : ${name} already exists`,
			});
		}

		let dcpuData = req.body;
		dcpuData['createdAt'] = new Date().toISOString();

		let x = await db.doc(`cwc/${name}`).set(dcpuData);
		return res
			.status(201)
			.json({ message: `CWC with id: ${name} created successfully` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.editCWC = async (req, res) => {
	try {
		let id = req.params.id;
		let dcpuData = req.body;
		dcpuData['lastEditedAt'] = new Date().toISOString();

		let doc = await db.doc(`/cwc/${id}`).update(dcpuData);
		return res.status(200).json({ message: 'cwc edited successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.deleteCWC = async (req, res) => {
	try {
		let id = req.params.id;
		let doc = await db.doc(`/cwc/${id}`).delete();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};
