const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function (req, res, next) {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
