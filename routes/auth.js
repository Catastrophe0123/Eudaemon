const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');

router.post('/register', async function(req, res) {
    // register route
    // get user
    try {
        let newuser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            organisation: req.body.organisation,
            designation: req.body.designation
        });
        let salt = await bcrypt.genSalt(12);
        let hashed = await bcrypt.hash(req.body.password, salt);
        newuser.password = hashed;
        await newuser.save();
        return res.status(201).json({
            message: 'user created successfully',
            id: newuser.id
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.post('/login', async function(req, res) {
    // login route
    // get password compare with db

    try {
        let { username, password } = req.body;
        let foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(400).json({ message: 'invalid credentials' });
        }

        let isMatched = await bcrypt.compare(password, foundUser.password);
        if (!isMatched) {
            return res.status(400).json({ message: 'invalid credentials' });
        }

        let payload = {
            user: { id: foundUser.id }
        };

        const token = jwt.sign(payload, JWTSECRET, { expiresIn: 3600 });

        return res
            .status(200)
            .json({ message: 'logged in successfully', token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

module.exports = router;
