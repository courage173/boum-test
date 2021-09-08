const mongoose = require('../config/db');

const Schema = mongoose.Schema;
const messageSchema = new Schema(
    {
        message: { type: String, required: true },
        updatedAt: {
            type: Date,
        },
        channelId: {
            type: String,
            ref: 'Channel',
            index: true,
            required: true,
        },
        deleted: { type: Boolean, default: false, required: true },
        deletedAt: {
            type: Date,
        },
        userId: { type: String, ref: 'User', index: true, required: true },
        deletedById: { type: String, ref: 'User', index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
