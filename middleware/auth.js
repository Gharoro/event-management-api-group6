const jwt = require('jsonwebtoken');
const models = require('../models/index');

// Protect routes
exports.adminProtect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to view this resource'
        });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.secretOrkey);
        if (decoded.role === 'admin') {
            req.user = await models.Manager.findByPk(decoded.id)
        } else {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to view this resource'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to view this resource',
            err
        });
    }
};

exports.customerProtect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to view this resource'
        });
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.secretOrkey);
        if (decoded.role === 'user') {
            req.user = await models.customers.findByPk(decoded.id)
        } else {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to view this resource'
            });
        }
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to view this resource',
            err
        });
    }
};