const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'Mike@example.com',
    password: '56what!!',
    tokens : [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});


test('should sign up a new user ', async () => {
    await request(app).post('/users').send({
        name: 'chirag',
        email: 'chiraggirdhar@gmail.com',
        password: '123456789'
    }).expect(201);
});

test('should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'as@gmail.com',
        password: '12121212'
    }).expect(400);
});

test('should get profile for user', async () => {
    await request(app).get('/users/me')
    .send()
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test('should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
    .send()
    .expect(401);
});

test('should delete account for user', async () => {
    await request(app).delete('/users/me')
    .send()
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test('should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
    .send()
    .expect(401);
});