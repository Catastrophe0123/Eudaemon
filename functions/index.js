const functions = require('firebase-functions');
// var admin = require('firebase-admin');
const { body } = require('express-validator');

const express = require('express');
const app = express();

const {
	getLogin,
	postSignup,
	postLogin,
} = require('./controllers/authentication');

const { admin, db } = require('./firebaseadmin');

const firebase = require('./firebaseConfig');

// CONTROLLERS
const { createChild, updateChild, getChild } = require('./controllers/child');
const { uploadFiles } = require('./controllers/fileUpload');
const {
	createCCI,
	editCCI,
	getCCI,
	uploadCCIFiles,
} = require('./controllers/cci');
const {
	createEmployee,
	editEmployee,
	getEmployee,
	uploadEmployeeFiles,
} = require('./controllers/employee');
const {
	createGuardian,
	updateGuardian,
	getGuardian,
} = require('./controllers/guardian');
const {
	getDCPUs,
	createDCPU,
	editDCPU,
	deleteDCPU,
} = require('./controllers/dcpu');
const { createCWC, editCWC, deleteCWC, getCWCs } = require('./controllers/cwc');
const { createPO, editPO, deletePO, getPOs } = require('./controllers/po');

// MIDDLEWARES
var isAuth = require('./middlewares/isAuth');
var isNotCCI = require('./middlewares/isNotCCI');
var isCorrectCCI = require('./middlewares/isCorrectCCI');
var { isCorrectDCPU, isDCPU } = require('./middlewares/isDCPU');
var isAdmin = require('./middlewares/isAdmin');

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
app.get('/login', getLogin);

// signup route
// TODO: Validation
app.post(
	'/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 6, max: 20 })
			.withMessage('Password must be between 6 and 20 characters'),
	],
	postSignup
);

//LOGIN ROUTE
/**
 * req.body = {
    email: String,
    password: String,
    role: "CCI" | "CWC" | "DCPU" | "PO",
    organisation: String
}
 */
app.post(
	'/login',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 6, max: 20 })
			.withMessage('Password must be between 6 and 20 characters'),
		body('role').notEmpty().withMessage('Must contain role property'),
		body('organisation')
			.notEmpty()
			.withMessage('Must contain organisation property'),
	],
	postLogin
);

// create a new child in the database
app.post('/child', [isAuth, isNotCCI], createChild);

// update a child's data
app.put('/child/:id', [isAuth, isNotCCI], updateChild);

// Upload child data : cannot be accessed by CCI
app.post('/child/:id/upload/:type', [isAuth, isNotCCI], uploadFiles);

// get data about a child
// CCIs : CCI can only access child
app.get('/child/:id', [isAuth, isCorrectCCI], getChild);

// Create a new CCI
// only allowed to DCPUs in the same district
/**
req.body = {
    district: String,
    cciName: String,
    cwc: String,
    classification: "GOVT" | "NGO",
    inChargeName: String,
    inCharge: String,
    state: String,
}
 */
app.post(
	'/cci',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must contain district field'),
		body('cciName')
			.exists()
			.notEmpty()
			.withMessage('Must contain CCI Name'),
		body('cwc').exists().notEmpty().withMessage('Must contain CWC field'),
		body('classification')
			.exists()
			.notEmpty()
			.withMessage('Must contain classification field'),
		body('inCharge')
			.exists()
			.notEmpty()
			.withMessage('Must contain inCharge field'),
		body('inChargeName')
			.exists()
			.notEmpty()
			.withMessage('Must contain inChargeName field'),
		body('state')
			.exists()
			.notEmpty()
			.withMessage('Must contain state field'),
		isAuth,
		isNotCCI,
		isDCPU,
		isCorrectDCPU,
	],
	createCCI
);

// req.body = {
//     district: String
// }
app.put(
	'/cci/:id',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must contain district field'),
		isAuth,
		isNotCCI,
		isDCPU,
		isCorrectDCPU,
	],
	editCCI
);

app.get('/cci/:id', [isAuth], getCCI);

app.post(
	'/cci/:id/upload/:district/:type',
	[isAuth, isNotCCI, isDCPU],
	uploadCCIFiles
);

// employee routes
app.post(
	'/employees',
	[
		body('name')
			.exists()
			.notEmpty()
			.withMessage('Must have a name property'),
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must have a district property'),
		isAuth,
		isDCPU,
		isCorrectDCPU,
	],
	createEmployee
);

app.put(
	'/employees/:id',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must have a district property'),
		isAuth,
		isDCPU,
		isCorrectDCPU,
	],
	editEmployee
);

app.get('/employees/:id', [isAuth], getEmployee);

// can be any type of file. Itll be associated with the employee
app.post(
	'/employees/:id/upload/:district/:type',
	[isAuth, isDCPU],
	uploadEmployeeFiles
);

// GUARDIAN ROUTES
// childId
app.post(
	'/guardian',
	[
		body('childId')
			.exists()
			.notEmpty()
			.withMessage('Must have a childId property'),
		body('name')
			.exists()
			.notEmpty()
			.withMessage('Must have a name property'),
		isAuth,
		isNotCCI,
	],
	createGuardian
);

app.put('/guardian/:id', [isAuth, isNotCCI], updateGuardian);

// DCPU ROUTES

// populates dcpu - employees in the dcpu, inCharge and CCIs
app.get('/dcpu/:district', [isAuth, isNotCCI], getDCPUs);

// body = {
// 	district: String,
// 	name: String,
// 	inCharge: String,
// 	inChargeName: String
// }
app.post(
	'/dcpu',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must have a district property'),
		body('name')
			.exists()
			.notEmpty()
			.withMessage('Must have a name property'),
		body('inCharge')
			.exists()
			.notEmpty()
			.withMessage('Must have a inCharge property'),
		body('inChargeName')
			.exists()
			.notEmpty()
			.withMessage('Must have a inChargeName property'),
		isAuth,
		isAdmin,
	],
	createDCPU
);

app.put('/dcpu/:id', [isAuth, isAdmin], editDCPU);

app.delete('/dcpu/:id', [isAuth, isAdmin], deleteDCPU);

// CWC CRUD

app.get('/cwc/:district', [isAuth, isNotCCI], getCWCs);

app.post(
	'/cwc',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must have a district property'),
		body('name')
			.exists()
			.notEmpty()
			.withMessage('Must have a name property'),
		body('inCharge')
			.exists()
			.notEmpty()
			.withMessage('Must have a inCharge property'),
		body('inChargeName')
			.exists()
			.notEmpty()
			.withMessage('Must have a inChargeName property'),
		isAuth,
		isAdmin,
	],
	createCWC
);

app.put('/cwc/:id', [isAuth, isAdmin], editCWC);

app.delete('/cwc/:id', [isAuth, isAdmin], deleteCWC);

// PO CRUD

app.post(
	'/po',
	[
		body('district')
			.exists()
			.notEmpty()
			.withMessage('Must have a district property'),
		body('name')
			.exists()
			.notEmpty()
			.withMessage('Must have a name property'),
		isAuth,
	],
	createPO
);

app.put('/po/:id', [isAuth, isAdmin], editPO);

app.delete('/po/:id', [isAuth, isAdmin], deletePO);

app.get('/po/:district', [isAuth, isNotCCI], getPOs);

// exports.api = functions.https.onRequest(app);
exports.api = functions.region('asia-east2').https.onRequest(app);

exports.createNotificationOnCCICreate = functions
	.region('asia-east2')
	.firestore.document('cci/{id}')
	.onCreate(async (snapshot, context) => {
		try {
			console.log(context);
			console.log(snapshot);

			// notify CWC, DCPU and PO in the district

			//dcpu
			let dcpuDoc = await db
				.collection('dcpu')
				.where('district', '==', snapshot.data().district)
				.get();
			let dcpuIds = [];
			for (const dcpu of dcpuDoc.docs) {
				if (snapshot.data().createdBy === dcpu) {
					continue;
				}
				dcpuIds.push(dcpu.id);
			}

			// cwc
			let cwcDoc = await db
				.collection('cwc')
				.where('district', '==', snapshot.data().district)
				.get();
			let cwcIds = [];
			for (const cwc of cwcDoc.docs) {
				cwcIds.push(cwc.id);
			}

			//po
			let poDoc = await db
				.collection('po')
				.where('district', '==', snapshot.data().district)
				.get();
			let poIds = [];
			for (const cwc of poDoc.docs) {
				poIds.push(cwc.id);
			}

			let x = await db.doc(`/notification/${snapshot.id}`).set({
				// create the notification
				createdAt: new Date().toISOString(),
				recipients: [...dcpuIds, ...cwcIds, ...poIds],
				sender: snapshot.id,
				read: false,
				type: 'CCICreation',
			});
		} catch (err) {
			console.error(err);
			return;
		}
	});

exports.createNotificationOnChildAdded = functions
	.region('asia-east2')
	.firestore.document('children/{id}')
	.onUpdate(async (change, context) => {
		try {
			let afterData = change.after.data();
			let beforeData = change.before.data();
			// check if child was added to their cci
			if (!beforeData.cci && afterData.cci) {
				// cci was added to the child. so notify the cci
				let x = await db.collection('notification').add({
					// create the notification
					createdAt: new Date().toISOString(),
					recipients: afterData.cci,
					sender: change.after.id,
					read: false,
					type: 'ChildAddedToCCI',
				});
				return;
			}

			if (beforeData.cci !== afterData.cci) {
				// cci was changed so notify the cci
				let x = await db.collection('notification').add({
					// create the notification
					createdAt: new Date().toISOString(),
					recipients: [afterData.cci],
					sender: change.after.id,
					read: false,
					type: 'ChildAddedToCCI',
				});
				return;
			}

			// if child data was updated

			if (afterData.cci) {
				let x = await db.collection('notification').add({
					// create the notification
					createdAt: new Date().toISOString(),
					recipients: [afterData.cci],
					sender: change.after.id,
					read: false,
					type: 'ChildDataUpdated',
				});
				return;
			}
		} catch (err) {
			return;
		}
	});

exports.createNotificationOnDCPUCreated = functions
	.region('asia-east2')
	.firestore.document('dcpu/{id}')
	.onCreate(async (snapshot, context) => {
		let dcpuDoc = await db
			.collection('dcpu')
			.where('district', '==', snapshot.data().district)
			.get();
		let dcpuIds = [];
		for (const dcpu of dcpuDoc.docs) {
			if (snapshot.data().createdBy === dcpu) {
				continue;
			}
			dcpuIds.push(dcpu.id);
		}

		// cwc
		let cwcDoc = await db
			.collection('cwc')
			.where('district', '==', snapshot.data().district)
			.get();
		let cwcIds = [];
		for (const cwc of cwcDoc.docs) {
			cwcIds.push(cwc.id);
		}

		//po
		let poDoc = await db
			.collection('po')
			.where('district', '==', snapshot.data().district)
			.get();
		let poIds = [];
		for (const cwc of poDoc.docs) {
			poIds.push(cwc.id);
		}

		let x = await db.collection('notification').add({
			// create the notification
			createdAt: new Date().toISOString(),
			recipients: [...dcpuIds, ...cwcIds, ...poIds],
			sender: snapshot.id,
			read: false,
			type: 'DCPUCreation',
		});
	});

exports.createNotificationOnCWCCreated = functions
	.region('asia-east2')
	.firestore.document('po/{id}')
	.onCreate(async (snapshot, context) => {
		let dcpuDoc = await db
			.collection('dcpu')
			.where('district', '==', snapshot.data().district)
			.get();
		let dcpuIds = [];
		for (const dcpu of dcpuDoc.docs) {
			if (snapshot.data().createdBy === dcpu) {
				continue;
			}
			dcpuIds.push(dcpu.id);
		}

		// cwc
		let cwcDoc = await db
			.collection('cwc')
			.where('district', '==', snapshot.data().district)
			.get();
		let cwcIds = [];
		for (const cwc of cwcDoc.docs) {
			cwcIds.push(cwc.id);
		}

		//po
		let poDoc = await db
			.collection('po')
			.where('district', '==', snapshot.data().district)
			.get();
		let poIds = [];
		for (const cwc of poDoc.docs) {
			poIds.push(cwc.id);
		}

		let x = await db.collection('notification').add({
			// create the notification
			createdAt: new Date().toISOString(),
			recipients: [...dcpuIds, ...cwcIds, ...poIds],
			sender: snapshot.id,
			read: false,
			type: 'CWCCreation',
		});
	});

exports.createNotificationOnPOCreated = functions
	.region('asia-east2')
	.firestore.document('dcpu/{id}')
	.onCreate(async (snapshot, context) => {
		let dcpuDoc = await db
			.collection('dcpu')
			.where('district', '==', snapshot.data().district)
			.get();
		let dcpuIds = [];
		for (const dcpu of dcpuDoc.docs) {
			if (snapshot.data().createdBy === dcpu) {
				continue;
			}
			dcpuIds.push(dcpu.id);
		}

		// cwc
		let cwcDoc = await db
			.collection('cwc')
			.where('district', '==', snapshot.data().district)
			.get();
		let cwcIds = [];
		for (const cwc of cwcDoc.docs) {
			cwcIds.push(cwc.id);
		}

		//po
		let poDoc = await db
			.collection('po')
			.where('district', '==', snapshot.data().district)
			.get();
		let poIds = [];
		for (const cwc of poDoc.docs) {
			poIds.push(cwc.id);
		}

		let x = await db.collection('notification').add({
			// create the notification
			createdAt: new Date().toISOString(),
			recipients: [...dcpuIds, ...cwcIds, ...poIds],
			sender: snapshot.id,
			read: false,
			type: 'POCreation',
		});
	});
