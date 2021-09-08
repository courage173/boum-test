const express = require('express');
const mongoose = require('../config/db');
const {
    sendErrorResponse,
    sendItemResponse,
} = require('../middlewares/response');
const {
    validateChannelFields,
    validateChannelId,
} = require('../middlewares/validation');
const ChannelService = require('../services/channelService');
const getUser = require('../middlewares/user').getUser;
const router = express.Router();

router.post(
    '/createChannel',
    getUser,
    validateChannelFields,
    async function (req, res) {
        try {
            const userId = req.user.id;
            const channel = await ChannelService.create(req.body, userId);
            return sendItemResponse(req, res, channel);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

router.get(
    '/:channelId',
    getUser,
    validateChannelId,
    async function (req, res) {
        try {
            const channelId = req.params?.channelId;

            const channel = await ChannelService.findOneBy({
                _id: mongoose.Types.ObjectId(channelId),
            });
            return sendItemResponse(req, res, channel);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

router.get('/', getUser, async function (req, res) {
    try {
        const { limit, skip } = req.query;
        const channel = await ChannelService.findBy({}, skip, limit);
        return sendItemResponse(req, res, channel);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

//manually joining a channel
router.post('/join/:channelId', getUser, async function (req, res) {
    try {
        const channelId = req.params?.channelId;
        const userId = req.user.id;
        const channel = await ChannelService.joinChannel(userId, channelId);
        return sendItemResponse(req, res, channel);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

module.exports = router;
