const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');
const Cci = require('../models/Cci');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('CCI Authorization');
        const decoded = jwt.verify(token, JWTSECRET);

        const foundCCI = await (
            await Cci.findById(decoded.cci.id, '-password').populate([
                { path: 'children' },
                { path: 'employees' }
            ])
        ).execPopulate();

        if (!foundCCI) {
            return res.status(401).json({ message: 'cci : unauthorized' });
        }
        req.cci = foundCCI;
        console.log(req.cci);
        next();
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
