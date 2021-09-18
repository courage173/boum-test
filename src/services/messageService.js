module.exports = {
    create: async function (data, userId) {
        try {
            const messageModel = new MessageModel();
            messageModel.message = data.message;
            messageModel.channelId = data.channelId;
            messageModel.userId = userId;

            const message = await messageModel.save();
            return message;
        } catch (error) {
            ErrorService.log('messageService.create', error);
            throw error;
        }
    },
    findOneBy: async function (query) {
        try {
            if (!query) {
                query = {};
            }
            if (!query.deleted) query.deleted = false;
            const message = await MessageModel.findOne(query);
            return message;
        } catch (error) {
            ErrorService.log('messageService.findOneBy', error);
            throw error;
        }
    },
    findBy: async function (query, skip, limit) {
        try {
            const _this = this;
            if (!query) {
                query = {};
            }
            if (!skip) {
                skip = 0;
            }
            if (!limit) {
                limit = 50;
            }
            if (!query.deleted) query.deleted = false;

            const messages = await MessageModel.find(query)
                .sort([['createdAt', 1]])
                .limit(limit)
                .skip(skip);
            const count = await _this.count(query);
            return { messages, count, limit, skip };
        } catch (error) {
            ErrorService.log('messageService.findBy', error);
            throw error;
        }
    },
    count: async function (query) {
        try {
            if (!query) {
                query = {};
            }

            if (!query.deleted) query.deleted = false;
            const count = await MessageModel.count(query);
            return count;
        } catch (error) {
            ErrorService.log('messageService.findBy', error);
            throw error;
        }
    },
};

const MessageModel = require('../model/message');
const ErrorService = require('./errorService');
