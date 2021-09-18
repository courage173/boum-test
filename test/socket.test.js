/* eslint-disable no-unused-vars */
const Client = require('socket.io-client');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-http'));
const app = require('../server');
const request = chai.request.agent(app);
const mongoose = require('../src/config/db');
const UserService = require('../src/services/userService');
const ChannelService = require('../src/services/channelService');

let user1Token, user2Token, channelId, userId2, userId1;

describe('my awesome project', () => {
    let clientSocket;
    before(function (done) {
        this.timeout(20000);
        UserService.registerUser({
            email: 'johndoe@gmail.com',
            password: 'randomepassword',
            name: 'John doe',
            username: 'johndoe123',
        }).then(data => {
            user1Token = data.tokens.jwtAccessToken;
            userId1 = String(data.id);
            UserService.registerUser({
                email: 'sarahsmith@gmail.com',
                password: 'randomepassword',
                name: 'Sarah Smith',
                username: 'sarah123',
            }).then(user => {
                user2Token = user.tokens.jwtAccessToken;
                userId2 = String(user.id);
                ChannelService.create(
                    {
                        name: 'new channel',
                        description: 'awesome channel',
                    },
                    data._id
                ).then(function (res) {
                    channelId = res._id;
                    clientSocket = new Client(
                        `http://localhost:${process.env.PORT}`,
                        {
                            query: { token: user2Token },
                        }
                    );
                    clientSocket.on('connect', function () {
                        done();
                    });
                });
            });
        });
    });

    after(() => {
        const { users, channels } = mongoose.connection.collections;
        users.drop();
        channels.drop();
        clientSocket.close();
    });

    it('should successfully join a channel and send notification', done => {
        clientSocket.emit('joinChannel', { channelId });
        clientSocket.on('welcome_notification', args => {
            expect(args.userId).to.equal(userId2);
            done();
        });
    });
    it('should successfully send a message and broadcast to channel', done => {
        clientSocket.emit('message', {
            channelId,
            message: 'i am a new message',
        });
        clientSocket.on('newMessage', args => {
            expect(args.message).to.equal('i am a new message');
            expect(args.userId).to.equal(userId2);
            done();
        });
    });
});
