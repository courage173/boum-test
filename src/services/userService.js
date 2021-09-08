module.exports = {
    create: async function (data) {
        try {
            const userModel = new UserModel();
            userModel.name = data.name;
            userModel.email = data.email;
            userModel.organisationName = data.organisationName;
            userModel.password = data.password;
            userModel.jwtRefreshToken = data.jwtRefreshToken;

            if (data.sso) userModel.sso = data.sso;

            const user = await userModel.save();
            return user;
        } catch (error) {
            ErrorService.log('userService.create', error);
            throw error;
        }
    },
    findOneBy: async function (query) {
        try {
            if (!query) {
                query = {};
            }
            if (!query.deleted) query.deleted = false;
            const user = await UserModel.findOne(query);
            return user;
        } catch (error) {
            ErrorService.log('userService.findOneBy', error);
            throw error;
        }
    },
    registerUser: async function (data) {
        try {
            const _this = this;
            let user = await _this.findOneBy({ email: data.email });
            if (user) {
                const error = new Error('User email is taken');
                error.code = 400;
                ErrorService.log('userService.registerUser', error);
                throw error;
            }
            const harshedPassword = await bcrypt.hash(
                data.password,
                constants.saltRounds
            );
            data.password = harshedPassword;
            data.jwtRefreshToken = randToken.uid(256);

            user = await _this.create(data);
            // create access token and refresh token.
            const authUserObj = {
                id: user._id,
                name: user.name,
                email: user.email,
                organisationName: user.organisationName,
                tokens: {
                    jwtAccessToken: `${jwt.sign(
                        {
                            id: user._id,
                        },
                        jwtSecretKey,
                        { expiresIn: 8640000 }
                    )}`,
                    jwtRefreshToken: user.jwtRefreshToken,
                },
            };
            return authUserObj;
        } catch (error) {
            ErrorService.log('userService.registerUser', error);
            throw error;
        }
    },
    loginUser: async function (data) {
        try {
            const _this = this;
            const user = await _this.findOneBy({ email: data.email });
            if (!user) {
                const error = new Error('User not found');
                error.code = 404;
                ErrorService.log('userService.loginUser', error);
                throw error;
            }
            const isValidPassword = await bcrypt.compare(
                data.password,
                user.password
            );
            if (!isValidPassword) {
                const error = new Error('Invalid Password');
                error.code = 400;
                ErrorService.log('userService.loginUser', error);
                throw error;
            }
            const authUserObj = {
                id: user._id,
                name: user.name,
                email: user.email,
                organisationName: user.organisationName,
                tokens: {
                    jwtAccessToken: `${jwt.sign(
                        {
                            id: user._id,
                        },
                        jwtSecretKey,
                        { expiresIn: 8640000 }
                    )}`,
                    jwtRefreshToken: user.jwtRefreshToken,
                },
            };
            return authUserObj;
        } catch (error) {
            ErrorService.log('userService.loginUser', error);
            throw error;
        }
    },
    updateOneBy: async function (query, data) {
        try {
            //
            if (!query) {
                query = {};
            }

            if (!query.deleted) query.deleted = false;
            const user = await UserModel.updateOne(
                query,
                {
                    $set: data,
                },
                {
                    new: true,
                }
            );
            return user;
        } catch (error) {
            ErrorService.log('userService.updateOneBy', error);
            throw error;
        }
    },
};

const UserModel = require('../model/user');
const ErrorService = require('./errorService');
const bcrypt = require('bcrypt');
const jwtSecretKey = process.env['JWT_SECRET'];
const jwt = require('jsonwebtoken');
const constants = require('../config/constants.json');
const randToken = require('rand-token');
