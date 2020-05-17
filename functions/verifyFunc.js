const jwt = require('jsonwebtoken')
var config = require("../config/config")
const JWTKEY = config.app.jwtKey;

const Promise = require('bluebird');

// This is the middleware for authentication
module.exports.authenticate = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token found.'
        })
    }   
    try {
        const auth_data = jwt.verify(token, JWTKEY);
        req.user = auth_data;
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            error: 'Unauthorised user.'
        });
    }
}

// This function decrypts a valid jwt token
module.exports.user = (token) => {
    try {
        const user_cred = jwt.verify(token, JWTKEY);
        return {
            user_cred: user_cred,
            error: false
        }
    } catch (err) {
        return {
            error: true
        }
    }
}
