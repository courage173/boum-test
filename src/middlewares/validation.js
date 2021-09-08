const Joi = require('joi');
const { sendErrorResponse } = require('./response');

function validateRegisterFields(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        organisationName: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, res, next, schema);
}

function validateLoginFields(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, res, next, schema);
}

function validateRequest(req, res, next, schema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error } = schema.validate(req.body, options);
    if (error) {
        return sendErrorResponse(req, res, {
            errors: error.details,
            message: 'validationError',
            statusCode: 400,
        });
    } else {
        next();
    }
}

module.exports = {
    validateRegisterFields,
    validateLoginFields,
};
