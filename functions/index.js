const functions = require('firebase-functions');
// var admin = require('firebase-admin');

const express = require('express');
const app = express();

const {
	getLogin,
	postSignup,
	postLogin,
} = require('./controllers/authentication');

// CONTROLLERS
const { createChild, updateChild, getChild } = require('./controllers/child');
const { uploadFiles } = require('./controllers/fileUpload');
const { createCCI } = require('./controllers/cci');

// MIDDLEWARES
var isAuth = require('./middlewares/isAuth');
var isNotCCI = require('./middlewares/isNotCCI');
var isCorrectCCI = require('./middlewares/isCorrectCCI');
var { isCorrectDCPU, isDCPU } = require('./middlewares/isDCPU');

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
app.post('/signup', postSignup);

//LOGIN ROUTE
// TODO: Validation
/**
 * req.body = {
    email: String,
    password: String,
    role: "CCI" | "CWC" | "DCPU" | "PO",
    organisation: String
}
 */
app.post('/login', postLogin);

// create a new child in the database
// TODO: Validation
app.post('/child', [isAuth, isNotCCI], createChild);

// update a child's data
// TODO: validation
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
    TODO: Validation
 */
app.post('/cci', [isAuth, isNotCCI, isDCPU, isCorrectDCPU], createCCI);

exports.api = functions.https.onRequest(app);
// exports.api = functions.region('asia-east2').https.onRequest(app);
