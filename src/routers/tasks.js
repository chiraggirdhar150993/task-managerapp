const express = require('express');
const roter = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

roter.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body); // old solution to add only task data
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save()
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


roter.delete('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(404).send(e);
    }
});

roter.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(400).send({
            error: 'invalid updates'
        });
    }
    // const _id = req.params.id;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        // const task = await Task.findByIdAndUpdate(_id, req.body, {
        //     new: true,
        //     runValidators: true
        // });

        res.send(task);
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

roter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById({
        //     _id
        // })
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });
        if (!task) return res.status(404).send();
        res.status(200).send(task);
    } catch (e) {
        res.status(404).send(e);
    }
});

// GET /tasks?completed= false /?completed=true
// GET /tasks?sortBy=createdAt:desc // Asc, Desc
roter.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.sortBy) {
       const parts =  req.query.sortBy.split(':');
       console.log(parts);
       sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ;
    }
    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }    
    try {
        // const tasks = await Task.find({ owner: req.user._id});
        // await req.user.populate('tasks').execPopulate();
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = roter;