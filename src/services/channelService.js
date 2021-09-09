module.exports = {
    create: async function (data, userId) {
        try {
            const _this = this;
            let channel = await _this.findOneBy({ name: data.name });
            if (channel) {
                const error = new Error('Channel Name is already taken');
                error.code = 400;
                ErrorService.log('chanelService.create', error);
                throw error;
            }
            const channelModel = new ChannelModel();
            channelModel.role = 'Admin';
            channelModel.name = data.name;
            channelModel.description = data.description;
            channelModel.users = { userId, role: 'Admin' };

            channel = await channelModel.save();
            return channel;
        } catch (error) {
            ErrorService.log('chanelService.create', error);
            throw error;
        }
    },
    findOneBy: async function (query) {
        try {
            if (!query) {
                query = {};
            }
            if (!query.deleted) query.deleted = false;
            const channel = await ChannelModel.findOne(query).populate({
                path: 'users.userId',
                select: '_id name',
            });
            return channel;
        } catch (error) {
            ErrorService.log('chanelService.findOneBy', error);
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

            const channels = await ChannelModel.find(query)
                .sort([['createdAt', -1]])
                .limit(limit)
                .skip(skip)
                .populate({
                    path: 'users.userId',
                    select: '_id name',
                });
            const count = await _this.count(query);
            return { channels, count, limit, skip };
        } catch (error) {
            ErrorService.log('chanelService.findBy', error);
            throw error;
        }
    },
    count: async function (query) {
        try {
            if (!query) {
                query = {};
            }

            if (!query.deleted) query.deleted = false;
            const count = await ChannelModel.count(query);
            return count;
        } catch (error) {
            ErrorService.log('chanelService.findBy', error);
            throw error;
        }
    },
    joinChannel: async function (userId, chanelId) {
        try {
            const _this = this;
            if (!chanelId) {
                const error = new Error('channelId is required');
                error.code = 400;
                ErrorService.log('chanelService.create', error);
                throw error;
            }
            if (!userId) {
                const error = new Error('userId is required');
                error.code = 400;
                ErrorService.log('chanelService.create', error);
                throw error;
            }
            let channel = await _this.findOneBy({ _id: chanelId });
            if (!channel) {
                const error = new Error('Channel does not exist');
                error.code = 400;
                ErrorService.log('chanelService.create', error);
                throw error;
            }
            channel = await _this.findOneBy({
                _id: chanelId,
                'users.userId': userId,
            });
            if (channel) {
                const error = new Error('user already in channel');
                error.code = 400;
                ErrorService.log('chanelService.create', error);
                throw error;
            }
            channel = await ChannelModel.findOneAndUpdate(
                { _id: chanelId },

                { $push: { users: { userId, role: 'Member' } } },

                { new: true }
            ).populate({
                path: 'users.userId',
                select: '_id name',
            });
            return channel;
        } catch (error) {
            ErrorService.log('chanelService.findBy', error);
            throw error;
        }
    },
    getChannelById: async function (query) {
        try {
            const channel = await this.findOneBy(query);
            if (!channel) {
                const error = new Error('Channel does not exist!');
                error.code = 404;
                ErrorService.log('chanelService.loginUser', error);
                throw error;
            }
            return channel;
        } catch (error) {
            ErrorService.log('chanelService.findBy', error);
            throw error;
        }
    },
};

const ChannelModel = require('../model/channel');
const ErrorService = require('./errorService');
