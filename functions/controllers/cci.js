var { admin, db } = require('../firebaseadmin');
const firebase = require('../firebaseConfig');

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
			let dataToAdd = { ...req.body };
			dataToAdd['dateJoined'] = new Date().toISOString();
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
				let cwcdataref = await db.doc(`cwc/${cwc}`).get();
				let cwcdata = cwcdataref.data();

				if (cwcdata.ccis.includes(cciName)) {
					return res
						.status(400)
						.json({ error: 'CCI already exists' });
				}
				cwcdata.ccis.push(cciName);

				// let dcpudataref = await db.doc(`cwc/${dcpu}`).get();
				// let dcpudata = dcpudataref.data();
				let dcpudata = req.dcpuData;
				if (dcpudata.ccis.includes(cciName)) {
					return res
						.status(400)
						.json({ error: 'CCI already exists' });
				}

				dcpudata.ccis.push(cciName);

				await db.doc(`cwc/${cwc}`).update({ ccis: cwcdata.ccis });
				await db.doc(`dcpu/${dcpu}`).update({ ccis: dcpudata.ccis });
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
