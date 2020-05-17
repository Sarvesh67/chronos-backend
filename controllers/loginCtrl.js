// this is responsible for all the auth of the user.
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var shortid = require('shortid'); // shortid() or shortid.generate(); to generate a short id
// var uuidv4 = require('uuid/v4'); // UUID generator; uuidv4(); to generate the uuid
var nunjucks = require("nunjucks");
var fs = require('fs');
var path = require('path');

var verify = require('../functions/verifyFunc');
var db = require("../models/db");
var config = require("../config/config");

module.exports.signup = async (req, res) => {

    try {
        var create_object = {
            first_name: req.body.firstName,
            last_name: req.body.lastName, 
            email: req.body.email,
            mobile: req.body.mobileNo,
            password: req.body.password,
        };
        // First check for the email or the mobile number here.
        const existingUser = await db.public.login.findOne({
            where: {
                $or: {
                    email: create_object.email,
                    mobile: create_object.mobile
                }
            }
        });
        if (existingUser) {
            return res.status(200).json({
                success: false,
                error: {
                    message: "The user with the email or mobile number already exists"
                }
            });
        } else {
            var salt = crypto.randomBytes(16).toString('hex');
            var password = crypto.pbkdf2Sync(create_object.password, salt, 1000, 512, "sha512").toString('hex');
    
            // Hashed password and it's respective salt.
            create_object.password = password;
            create_object.salt = salt;
            const user = await db.public.login.create(create_object);
            var auth_data = {
                email: user.email,
                id: user.id,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            // Send email with link here (link should contain jwt token)
            res.status(200).json({
                success: true,
                token: token,
                new_user: true
            });
        }    
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: {
                err: err,
                msg: 'Internal server error'
            }
        })
    }
};

module.exports.login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        console.log(req.body);
        res.status(500).json({
            success: false,
            message: "All fields are required"
        });
        return;
    }

    var email = req.body.email;

    let user = await db.public.login.findOne({
            where: {
                email: email
            }
        })
        // .then(user => {
    if (user) {
        console.log(user.id);
        password = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 512, "sha512").toString('hex');

        if (user.password === password) {
            // Get user profile
            
            var auth_data = {
                email: user.email,
                id: user.id,
                created_at: new Date()
            };
            
            var token = jwt.sign(auth_data, config.app.jwtKey);
            
            res.status(200).json({
                success: true,
                token: token,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Incorrect Password. Please try again."
            });
        }

    } else {
        res.status(500).json({
            success: false,
            error: {
                message: "We could not find your account."
            }
        });
    }

};

// Confirm email code here.
module.exports.confirmEmail = async (req, res) => {

   try {
    const token = req.params.token;

    var user = verify.user(token);
    if (user.error) {
        return res.status(400).json({
            success: false,
            error: {
                msg: 'Invalid auth token'
            }
        })
    }
    const user_credentials = user.user_cred;

    // Expires in 2 hrs (or 7200000 milliseconds)
    if (Math.abs(Date.now() - user_credentials.created_at) > 7200000) {
        return res.status(200).json({
            success: false,
            error: {
                msg: 'The link fo remail verification has expired. Pls try again'
            }
        })
    }

    const update_body = {
        email_verified: true
    }
    let update_resp = await db.public.login.update(update_body, {
        where: {
            id: user_credentials.id,
            email: user_credentials.email
        },
        returning: true
    });

    return res.status(200).json({
        success: true,
        login_data: update_resp[1][0],
        msg: 'Email Verified. You can proceed to dashboard.'
    });
   } catch (err) {
    console.log(err);
    return res.status(500).json({
        success: false,
        error: {
            err: err,
            msg: 'Internal server error'
        }
    })
   }
};

// Update forgotten password
module.exports.updatePass = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(400).json({
                success: false,
                error: {
                    msg: 'Bad request. No token found'
                }
            })
        }
        const user = verify.user(token);
        if (user.error) {
            return res.status(400).json({
                success: false,
                error: {
                    msg: 'Invalid auth token'
                }
            })
        }
        const user_credentials = user.user_cred;
        // Expires in 2 hrs (or 7200000 milliseconds)
        if (Math.abs(Date.now() - user_credentials.created_at) > 7200000) {
            return res.status(200).json({
                success: false,
                error: {
                    msg: 'The link for password reset has expired. Pls try again'
                }
            })
        }

        var password = req.body.password;
        var salt = crypto.randomBytes(16).toString('hex');
        var hashed_password = crypto.pbkdf2Sync(password, salt, 1000, 512, "sha512").toString('hex');

        const update_body = {
            password: hashed_password,
            salt: salt
        }

        var update_resp = await db.public.login.update(update_body, {
            where: {
                id: user_credentials.id
            },
            returning: true,
        });

        return res.status(200).json({
            success: true,
            msg: 'You can sign in again with your new password.'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "We could not find your account."
            }
        });
    }
}

module.exports.profile = async(req, res) => {
    try {
        const validated_data = req.body;
        const user_data = await db.public.login.update(validated_data, { 
            where: {
                id: req.user.id
            },
            returning: true
        });

        return res.status(200).json({
            success: true,
            user: user_data[1][0]
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal server error."
            }
        });
    } 
}

// Function to get for dashboard
module.exports.dashboard = async (req, res) => {
    try {
        const students = await db.public.login.findAll({
            // Define attributes here
            // attributes:[]
        })

        return res.status(200).json({
            success: true,
            students: students
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: "Internal server error."
            }
        });
    }
}
