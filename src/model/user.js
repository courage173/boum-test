const mongoose = require('../config/db');

const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name: { type: String, index: true },
        email: String,
        password: String,
        lastActive: {
            type: Date,
            default: Date.now,
        },
        jwtRefreshToken: String,
        updatedAt: {
            type: Date,
        },
        deleted: { type: Boolean, default: false },
        deletedAt: {
            type: Date,
        },
        deletedById: { type: String, ref: 'User', index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
