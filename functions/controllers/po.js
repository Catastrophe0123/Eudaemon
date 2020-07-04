var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

exports.createPO = async (req, res) => {
	// create a PO

	let name = req.body.name;

	try {
		let poData = req.body;
		poData['createdAt'] = new Date().toISOString();

		let doc = await db.collection('po').add(poData);
		return res
			.status(201)
			.json({ message: `PO with id: ${doc.id} created successfully` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.editPO = async (req, res) => {
	// edit PO
	try {
		let id = req.params.id;
		let poData = req.body;
		poData['lastEditedAt'] = new Date().toISOString();

		let doc = await db.doc(`/po/${id}`).update(poData);
		return res.status(200).json({ message: 'PO edited successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.deletePO = async (req, res) => {
	try {
		let id = req.params.id;
		let doc = await db.doc(`/po/${id}`).delete();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.getPOs = async (req, res) => {
	try {
		let district = req.params.district;
		let doc = await db
			.collection('po')
			.where('district', '==', district)
			.get();

		if (doc.empty) {
			return res.status(400).json({ error: 'No PO found' });
		}
		let poData = doc.docs;
		let POs = [];
		for (const PO of poData) {
			console.log(PO.data());
			POs.push(PO.data());
		}
		return res.status(200).json({ po: POs });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};
