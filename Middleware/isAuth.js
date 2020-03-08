const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, JWTSECRET);
        const foundUser = await User.findById(decoded.user.id);
        if (!foundUser) {
            return res.status(401).json({ message: 'unauthorized' });
        }
        req.user = foundUser;
        console.log(req.user);
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
