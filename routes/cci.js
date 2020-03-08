const router = require('express').Router();
const mongoose = require('mongoose');
const Cci = require('../models/Cci');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');
const isAuth = require('../Middleware/isAuth');
const isCCI = require('../Middleware/isCCI');

// view a cci - shows all the details of the cci to the proprietor
router.get('/', [isAuth, isCCI], function(req, res) {
    return res.status(200).json({ message: 'CCI found', cci: req.cci });
});

module.exports = router;
