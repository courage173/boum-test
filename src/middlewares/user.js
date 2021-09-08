const jwtSecretKey = process.env['JWT_SECRET'];
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const ErrorService = require('../services/errorService');
const sendErrorResponse = require('../middlewares/response').sendErrorResponse;

const _this = {
    // Description: Checking if user is authorized to access the page and decode jwt to get user data.
    // Param 1: req.headers-> {token}
    // Returns: 400: User is unauthorized since unauthorized token was present.
    getUser: async function (req, res, next) {
        try {
            const accessToken = req.headers['authorization'];

            if (!accessToken) {
                if (res) {
                    return sendErrorResponse(req, res, {
                        code: 401,
                        message: 'Session Token must be present.',
                    });
                } else {
                    return null;
                }
            }

            if (typeof accessToken !== 'string') {
                if (res) {
                    return sendErrorResponse(req, res, {
                        code: 401,
                        message: 'Token is not of type string.',
                    });
                } else {
                    return null;
                }
            }

            const token = accessToken.split(' ')[1] || accessToken;

            //Decode the token
            let decoded = null;
            try {
                decoded = await jwt.verify(token, jwtSecretKey);
            } catch (err) {
                if (res) {
                    return sendErrorResponse(req, res, {
                        code: 401,
                        message: 'You are unauthorized to access the page',
                    });
                } else {
                    return null;
                }
            }
            req.user = decoded;
            const user = await UserService.findOneBy({
                query: { _id: req.user.id },
                select: 'role',
            });
            if (!user) {
                if (res) {
                    return sendErrorResponse(req, res, {
                        code: 401,
                        message: 'You are unauthorized to access the page',
                    });
                } else {
                    return null;
                }
            }
            if (user.role === 'Admin') {
                req.authorizationType = 'MASTER-ADMIN';
            } else {
                req.authorizationType = 'USER';
            }
            UserService.updateOneBy(
                { _id: req.user.id },
                { lastActive: Date.now() }
            );
            if (next) {
                return next();
            } else {
                return req;
            }
        } catch (error) {
            ErrorService.log('user.getUser', error);
            throw error;
        }
    },
};

module.exports = _this;
