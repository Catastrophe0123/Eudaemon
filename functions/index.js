const functions = require('firebase-functions');
// var admin = require('firebase-admin');

var isAuth = require('./middlewares/isAuth');

const express = require('express');
const app = express();

const {
	getLogin,
	postSignup,
	postLogin,
} = require('./controllers/authentication');

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

app.post('/createchild', isAuth, (req, res) => {
	// user is verified
	console.log('consoling : ', req.user);
});

exports.api = functions.https.onRequest(app);
// exports.api = functions.region('asia-east2').https.onRequest(app);
