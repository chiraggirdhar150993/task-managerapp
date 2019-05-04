const express = require('express');
require('./db/mongoose');
const ObjectID = require('mongodb');
const app = express();
const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/user');

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

module.exports = app;