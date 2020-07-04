var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');
const { validationResult } = require('express-validator');

exports.createCWC = async (req, res) => {
	// create a dcpu

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors.array());
	}

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

exports.getCWCs = async (req, res) => {
	let district = req.params.district;

	// populate inCharge and CCIs

	try {
		let docs = await db
			.collection('cwc')
			.where('district', '==', district)
			.get();
		if (docs.empty) {
			return res.status(400).json({ message: 'no CWCs found' });
		}

		let allData = docs.docs;
		let final = [];
		for (let result of allData) {
			if (result.exists) {
				let data = result.data();
				// get the CCIs in the CWC
				let cciDoc = await db
					.collection('cci')
					.where('cwc', '==', result.id)
					.get();
				// data['ccis'] = [...cciDoc.docs[0].];
				data['ccis'] = [];
				for (let cci of cciDoc.docs) {
					data['ccis'].push(cci.data());
				}

				let inChargedoc = await db
					.collection('employees')
					.doc(data['inCharge'])
					.get();

				data['inChargeData'] = inChargedoc.data();

				final.push(data);
			}
		}
		return res.status(200).json({ final });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};
