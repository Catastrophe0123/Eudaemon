var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

const { validationResult } = require('express-validator');

// req.body = {
//     district: String,
//     cciName: String,
//     cwc: String,
//     classification: "GOVT" | "NGO",
//     inChargeName: String,
//     inCharge: String,
//     state: String,
// }
exports.createCCI = async (req, res) => {
	// req.user req.dcpuData
	// we have the dcpu data

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send(errors.array());
	}

	try {
		let cciName = req.body.cciName;
		// let doc = await db.doc(`cci/${cciName}`).
		let doc = await db.collection('cci').listDocuments();
		if (doc.includes(cciName)) {
			// CCI already exists
			return res.status(400).json({
				error: ` A CCI with the name ${cciName} already exists `,
			});
		} else {
			// create the entry

			// before creating, validate the inCharge

			let inCharge = req.body.inCharge;
			let empDoc = await db.doc(`employees/${inCharge}`).get();
			if (!empDoc.exists) {
				return res
					.status(400)
					.json({ error: 'employee does not exist' });
			}

			let dataToAdd = { ...req.body };
			dataToAdd['createdAt'] = new Date().toISOString();
			dataToAdd['createdBy'] = req.user.user_id;
			dataToAdd['createdByUser'] = req.user.email;
			let cwc = req.body.cwc;
			let dcpu = req.body.dcpu;

			// have to check cwc and dcpu values are correct or not

			let cwcQuery = await db
				.collection('cwc')
				.where('district', '==', req.body.district)
				.get();

			let dcpuQuery = await db
				.collection('dcpu')
				.where('district', '==', req.body.district)
				.get();
			let dcpuDocs = dcpuQuery.docs;
			let cwcDocs = cwcQuery.docs;
			// console.log('dcpu : ', dcpuDocs[0].id);
			let dcpulist = [];
			let cwclist = [];
			cwcDocs.forEach((el) => cwclist.push(el.id));
			dcpuDocs.forEach((el) => dcpulist.push(el.id));

			if (!cwclist.includes(cwc) || !dcpulist.includes(dcpu)) {
				return res
					.status(400)
					.json({ error: 'wrong/invalid cwc/dcpu' });
			} else {
				// get the cci array and then update

				let cwcdoc = await db
					.collection('cwc')
					.doc(cwc)
					.update({
						ccis: admin.firestore.FieldValue.arrayUnion(cciName),
					});

				let dcpudoc = await db
					.collection('dcpu')
					.doc(dcpu)
					.update({
						ccis: admin.firestore.FieldValue.arrayUnion(cciName),
					});

				// update employee
				let empdoc = await db
					.collection('employees')
					.doc(inCharge)
					.update({
						workingAt: cciName,
						addedBy: req.user.user_id,
						addedByUser: req.user.email,
					});
			}

			let ref = await db.doc(`cci/${cciName}`).set(dataToAdd);
			return res.status(201).json({
				message: `cci with name : ${cciName} created successfully`,
			});
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.editCCI = async (req, res) => {
	// edit a cci
	try {
		let id = req.params.id;
		// id of the cci
		let data = req.body;
		data['lastEditedBy'] = req.user.user_id;
		data['lastEditedByUser'] = req.user.email;
		data['lastEditedAt'] = new Date().toISOString();

		let doc = await db.doc(`/cci/${id}`).update(data);
		return res.status(200).json({ message: 'CCI edited successfully' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
};

exports.getCCI = async (req, res) => {
	let id = req.params.id;
	// id is the id of the CCI
	let organisation = req.user.organisation;
	let role = req.user.role;

	if (role === 'CCI') {
		if (organisation != id) {
			return res.status(403).json({
				error: 'unauthorized. You can only view your own data',
			});
		}
	}

	let doc = await db.doc(`cci/${id}`).get();
	if (!doc.exists) {
		return res
			.status(400)
			.json({ error: 'invalid id or document does not exist ' });
	}
	let data = doc.data();
	return res.status(200).json(data);
};
