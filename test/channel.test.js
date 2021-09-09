const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../server');
const request = chai.request.agent(app);
const mongoose = require('../src/config/db');
const UserService = require('../src/services/userService');

let user1Token;
let channelId;
describe('User API', function () {
    this.timeout(20000);

    before(function (done) {
        this.timeout(20000);
        UserService.registerUser({
            email: 'johndoe@gmail.com',
            password: 'randomepassword',
            name: 'John doe',
            username: 'johndoe123',
        }).then(data => {
            user1Token = data.tokens.jwtAccessToken;
            done();
        });
    });
    after(function (done) {
        const { users, channels } = mongoose.connection.collections;
        users.drop();
        channels.drop();
        done();
    });
    it('it should not create a channel without description and name', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: null,
                description: null,
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('validationError');
                done();
            });
    });
    it('it should not create a channel without name', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: null,
                description: 'awesome channel',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('validationError');
                done();
            });
    });
    it('it should not create a channel without description', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: 'new channel',
                description: null,
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('validationError');
                done();
            });
    });
    it('it should not create a channel without a valid token', done => {
        const authorization = `Basic jkndjsknjfnksdjnjfnsdnfksdnksd`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: 'new channel',
                description: 'beautiful channel',
            })
            .end(function (err, res) {
                expect(res).to.have.status(401);
                expect(res.body.message).to.be.equal(
                    'You are unauthorized to access the page'
                );
                done();
            });
    });
    it('it should create a channel successfully', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: 'new channel',
                description: 'beautiful channel',
            })
            .end(function (err, res) {
                channelId = res.body._id;
                expect(res).to.have.status(200);
                expect(res.body.name).to.be.equal('new channel');
                done();
            });
    });
    it('it should not get channel when invalid Id is supplied', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .get(`/api/channel/60f5348f0368cf4033e17545/singleChannel`)
            .set('Authorization', authorization)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('Channel does not exist!');
                done();
            });
    });
    it('it should get channel with Id', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .get(`/api/channel/${channelId}/singleChannel`)
            .set('Authorization', authorization)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.name).to.be.equal('new channel');
                done();
            });
    });
    it('it should get channel all channel belonging to a user', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .post('/api/channel/createChannel')
            .set('Authorization', authorization)
            .send({
                name: 'new channel2',
                description: 'new beautiful channel',
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.name).to.be.equal('new channel2');
                request
                    .get(`/api/channel/`)
                    .set('Authorization', authorization)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body.count).to.be.equal(2);
                        done();
                    });
            });
    });
    it('it should search channel and return matching results', done => {
        const authorization = `Basic ${user1Token}`;
        request
            .get('/api/channel/search?search=new')
            .set('Authorization', authorization)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.count).to.be.equal(2);
                done();
            });
    });
});
