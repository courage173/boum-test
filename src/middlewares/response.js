//const Mongoose = require('mongoose');
const mongoose = require('../config/db');
const ObjectID = mongoose.Types.ObjectId;

function filterKeys(field) {
    field = field._doc ? field._doc : field;

    const filteredKeys = Object.keys(field).filter(
        key =>
            key !== '__v' &&
            key !== 'deleted' &&
            key !== 'deletedAt' &&
            key !== 'deletedById'
    );
    const filteredField = filteredKeys.reduce((resultField, key) => {
        if (isObjectID(field[key])) {
            resultField[key] = field[key].toString();
        } else if (Array.isArray(field[key])) {
            resultField[key] = field[key].map(value =>
                typeof value === 'object' &&
                value !== null &&
                value.__v !== null
                    ? isDate(field[key])
                        ? field[key]
                        : filterKeys(value)
                    : value
            );
        } else if (
            typeof field[key] === 'object' &&
            field[key] !== null &&
            field[key].__v !== null
        ) {
            resultField[key] = isDate(field[key])
                ? field[key]
                : filterKeys(field[key]);
        } else {
            resultField[key] = field[key];
        }
        return resultField;
    }, {});

    return filteredField;
}

function isObjectID(id) {
    try {
        if (ObjectID.isValid(id)) {
            if (new ObjectID(id) === id) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

function isDate(date) {
    try {
        typeof date === 'object' &&
            date !== null &&
            new Date(date).toISOString();
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    sendErrorResponse: function (req, res, error) {
        //log error to the console.
        // eslint-disable-next-line no-console
        console.error(error);

        if (error.statusCode && error.message) {
            res.resBody = { message: error.message }; // To be used in 'auditLog' middleware to log reponse data;
            const errorObj = {};
            errorObj.message = error.message;
            if (error.errors) {
                errorObj.errors = error.errors;
            }
            return res.status(error.statusCode).send(errorObj);
        } else if (
            error.code &&
            error.message &&
            typeof error.code === 'number'
        ) {
            let status = error.code;
            if (
                error.code &&
                error.status &&
                typeof error.code === 'number' &&
                typeof error.status === 'number' &&
                error.code > 600
            ) {
                status = error.status;
            }
            res.resBody = { message: error.message };
            return res.status(status).send({ message: error.message });
        } else if (error instanceof mongoose.Error.ValidationError) {
            res.resBody = { code: 400, message: 'Validation error.' };
            return res.status(400).send({ code: 400, message: error.message });
        } else if (error instanceof mongoose.Error.CastError) {
            res.resBody = { code: 400, message: 'Input data schema mismatch.' };
            return res
                .status(400)
                .send({ code: 400, message: 'Input data schema mismatch.' });
        } else {
            res.resBody = { message: 'Server Error.' };
            return res.status(500).send({ message: 'Server Error.' });
        }
    },

    sendListResponse: async function (req, res, list, count) {
        // remove __v, deleted, deletedAt and deletedById if not Master Admin
        if (req.authorizationType !== 'MASTER-ADMIN') {
            if (Array.isArray(list)) {
                list = list.map(field =>
                    typeof field === 'object' && field !== null
                        ? filterKeys(field)
                        : field
                );
            } else if (typeof list === 'object' && list !== null) {
                list = filterKeys(list);
            }
        }

        const response = {};

        if (!list) {
            list = [];
        }

        if (list) {
            response.data = list;
        }

        if (count) {
            response.count = count;
        } else {
            if (list) response.count = list.length;
        }

        if (req.query.skip) {
            response.skip = parseInt(req.query.skip);
        }

        if (req.query.limit) {
            response.limit = parseInt(req.query.limit);
        }

        res.resBody = response; // To be used in 'auditLog' middleware to log reponse data;

        return res.status(200).send(response);
    },

    async sendItemResponse(req, res, item) {
        // remove __v, deleted, deletedAt and deletedById if not Master Admin
        if (req.authorizationType !== 'MASTER-ADMIN') {
            if (Array.isArray(item)) {
                item = item.map(field =>
                    typeof field === 'object' && field !== null
                        ? filterKeys(field)
                        : field
                );
            } else if (typeof list === 'object' && item !== null) {
                item = filterKeys(item);
            }
        }

        res.resBody = item; // To be used in 'auditLog' middleware to log reponse data;

        return res.status(200).send(item);
    },
};
