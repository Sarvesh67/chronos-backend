const Joi = require('@hapi/joi');

// Validation for registration details
module.exports.loginvalidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const { data, error } = schema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: 'The email address entered is not a valid email'
        });
    } else {
        return next();
    }
}

module.exports.profilevalidation = (req, res, next) => {
    const schema = Joi.object({
        city: Joi.string().required(),
        college: Joi.string().required(),
        year: Joi.string().required(),
        registrationNo: Joi.string().required(),
        role: Joi.string().required(),
        skill: Joi.string().required(),
        rank: Joi.string().required()
    });
    const { data, error } = schema.validate(req.body);
    if (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            error: 'Invalid fields constraints. Bad request'
        });
    } else {
        return next();
    }
}

module.exports.signupvalidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobileNo: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required()
    });
    const { data, error } = schema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: 'Invalid fields constraints. Bad request'
        });
    } else {
        return next();
    }
}