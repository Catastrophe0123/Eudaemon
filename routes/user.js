const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');
const isAuth = require('../Middleware/isAuth');

// /api/user/:id
router.get('/:id', isAuth, function(req, res) {
    // user is authorised
    return res.status(200).json({ message: 'user found', user: req.user });
});

module.exports = router;
