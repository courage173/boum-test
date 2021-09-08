const mongoose = require('../config/db');

const Schema = mongoose.Schema;
const channelSchema = new Schema(
    {
        name: { type: String, index: true },
        description: String,
        updatedAt: {
            type: Date,
        },
        createdBy: { type: String, ref: 'User', index: true },
        deleted: { type: Boolean, default: false },
        deletedAt: {
            type: Date,
        },
        users: [
            {
                userId: { type: String, ref: 'User', index: true },
                role: {
                    type: String,
                    enum: ['Admin', 'Member'],
                },
            },
        ],
        deletedById: { type: String, ref: 'User', index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Channel', channelSchema);
