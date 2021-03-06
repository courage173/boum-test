const express = require('express');
const {
    sendErrorResponse,
    sendItemResponse,
} = require('../middlewares/response');
const {
    validateRegisterFields,
    validateLoginFields,
} = require('../middlewares/validation');
const UserService = require('../services/userService');
const getUser = require('../middlewares/user').getUser;

const router = express.Router();

router.post('/signup', validateRegisterFields, async function (req, res) {
    try {
        const user = await UserService.registerUser(req.body);
        return sendItemResponse(req, res, user);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.post('/signin', validateLoginFields, async function (req, res) {
    try {
        const user = await UserService.loginUser(req.body);
        return sendItemResponse(req, res, user);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.get('/profile', getUser, async function (req, res) {
    try {
        const user = await UserService.findOneBy({ _id: req.user.id });
        return sendItemResponse(req, res, user);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

module.exports = router;
