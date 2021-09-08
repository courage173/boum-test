const express = require('express');
//const mongoose = require('../config/db');
const {
    sendErrorResponse,
    sendItemResponse,
} = require('../middlewares/response');
const { validateMessageFields } = require('../middlewares/validation');
const MessageService = require('../services/messageService');
const getUser = require('../middlewares/user').getUser;
const router = express.Router();

router.post(
    '/create',
    getUser,
    validateMessageFields,
    async function (req, res) {
        try {
            const userId = req.user.id;
            const message = await MessageService.create(req.body, userId);
            return sendItemResponse(req, res, message);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

router.get('/:channelId', getUser, async function (req, res) {
    try {
        const channelId = req.params.channelId;
        const message = await MessageService.findBy({
            channelId,
        });
        return sendItemResponse(req, res, message);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

module.exports = router;
