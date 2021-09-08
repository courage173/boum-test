const Joi = require('joi-oid');
const { sendErrorResponse } = require('./response');

function validateRegisterFields(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, res, next, schema);
}

function validateLoginFields(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, res, next, schema);
}

function validateChannelFields(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    });
    validateRequest(req, res, next, schema);
}

function validateMessageFields(req, res, next) {
    const schema = Joi.object({
        message: Joi.string().required(),
        channelId: Joi.objectId(),
    });
    validateRequest(req, res, next, schema);
}

function validateChannelId(req, res, next) {
    const schema = Joi.object({
        channelId: Joi.objectId(),
    });
    validateRequest(req, res, next, schema, 'params');
}

function validateRequest(req, res, next, schema, type) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };
    const { error } = schema.validate(req[type || 'body'], options);
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
    validateChannelFields,
    validateChannelId,
    validateMessageFields,
};
