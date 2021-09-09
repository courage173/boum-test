const chai = require('chai');
chai.use(require('chai-http'));
const expect = require('chai').expect;
const app = require('../server');
const request = chai.request.agent(app);
const mongoose = require('../src/config/db');

describe('User API', function () {
    this.timeout(20000);

    after(function (done) {
        const { users } = mongoose.connection.collections;
        users.drop();
        done();
    });
    it('should not create an account when password is null', function (done) {
        request
            .post('/api/auth/signup')
            .send({
                email: 'johndoe@gmail.com',
                password: null,
                name: 'john doe',
                username: 'johndoe123',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should not create an account when email is null', function (done) {
        request
            .post('/api/auth/signup')
            .send({
                email: null,
                password: null,
                name: 'john doe',
                username: 'johndoe123',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should not create an account when name is null', function (done) {
        request
            .post('/api/auth/signup')
            .send({
                email: null,
                password: null,
                name: '',
                username: 'johndoe123',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should not create an account when username is null', function (done) {
        request
            .post('/api/auth/signup')
            .send({
                email: 'johndoe@gmail.com',
                password: '12345667',
                name: 'John doe',
                username: '',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should create an account successfully', function (done) {
        request
            .post('/api/auth/signup')
            .send({
                email: 'johndoe@gmail.com',
                password: 'randomepassword',
                name: 'John doe',
                username: 'johndoe123',
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not login when password is null', function (done) {
        request
            .post('/api/auth/signin')
            .send({
                email: 'johndoe@gmail.com',
                password: null,
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should not login when email or username is null', function (done) {
        request
            .post('/api/auth/signin')
            .send({
                email: '',
                password: 'randomepassword',
            })
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should with username and password', function (done) {
        request
            .post('/api/auth/signin')
            .send({
                username: 'johndoe123',
                password: 'randomepassword',
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('should with email and password', function (done) {
        request
            .post('/api/auth/signin')
            .send({
                email: 'johndoe@gmail.com',
                password: 'randomepassword',
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});
