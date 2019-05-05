const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne , userTwoId, taskOne,
    userTwo, setupDatabase } = require('./fixtures/db'); 

beforeEach(setupDatabase);

test('should create task for user', async () => {
        const response = await request(app).post('/tasks').set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({ description : 'from my test'}).expect(201);

        const task = await Task.findById(response.body._id);
        expect(task).not.toBeNull();
        expect(task.description).toBe('from my test');
        expect(task.completed).toEqual(false);
});

test('should get all task for a user', async () => {
const response = await request(app).get('/tasks').send()
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200);
  expect(response.body.length).toBe(2);
    
});

test('usertwo should failed to delete userOne task', async () => {
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
                    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
            
});