const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne , setupDatabase } = require('./fixtures/db'); 

beforeEach(setupDatabase);


test('should sign up a new user ', async () => {
    const response  = await request(app).post('/users').send({
        name: 'chirag',
        email: 'chiraggirdhar@gmail.com',
        password: '123456789'
    }).expect(201);

    // assert that database was changed correctly.
    const user = await User.findById(response.body.user._id);

    expect(user).not.toBeNull();
    expect(response.body).toMatchObject({
        user: {
            name: 'chirag',
            email: 'chiraggirdhar@gmail.com'
        },
        token : user.tokens[0].token
    });
    expect(user.password).not.toBe('123456789');
});

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOne._id);    
    expect(response.body.token).toBe(user.tokens[1].token);
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
   const response = await request(app).delete('/users/me')
    .send()
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
    .send()
    .expect(401);
});

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

        const user = await User.findById(userOne._id);
        expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
    const response = await request(app)
                            .patch('/users/me')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send({ email: 'myemail@gmail.com'})
                            .expect(200);

        const user = await User.findById(response.body._id);
        expect(user.email).toEqual('myemail@gmail.com');
});

test('should not update invalid user fields', async () => {
    const response = await request(app)
                            .patch('/users/me')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send({ location: 'boston'})
                            .expect(400);
})