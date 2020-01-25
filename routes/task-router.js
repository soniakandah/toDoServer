'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth-middleware.js');
const Tasks = require('../models/task-model.js');
const tasks = new Tasks();

const Users = require('../models/user-model.js');
const users = new Users();

router.get('/all-tasks', auth, async (req, res, next) => {
    let taskList = [];

    for (let i = 0; i < req.user.tasks.length; i++)
        taskList.push(await tasks.read(req.user.tasks[i]));

    res.send({ tasks: taskList });
});

router.post('/add-task', auth, async (req, res, next) => {
    // cool, you should create a task

    let task = await tasks.create(req.body);

    // get the id of that task
    let t_id = task._id;

    // add that id to the user's task array
    let taskArr = req.user.tasks;
    taskArr.push(t_id);

    await users.update(req.user._id, { tasks: taskArr });
    let user = await users.read(req.user._id);

    res.send({ user: user });
});

router.patch('/update-task/:t_id', auth, async (req, res, next) => {
    // let's update the task

    await tasks.update(req.params.t_id, req.body);
    let task = await tasks.read(req.params.t_id);

    res.send({ task: task });
});

router.delete('/delete-task/:t_id', auth, async (req, res, next) => {
    let taskArr = req.user.tasks.filter(val => {
        return val.toString() !== req.params.t_id;
    });

    await tasks.delete(req.params.t_id);
    await users.update(req.user._id, { tasks: taskArr });

    let user = await users.read(req.user._id);

    res.send({ user: user });
});

router.patch('/mark-done/:t_id', auth, async (req, res, next) => {
    await tasks.update(req.params.t_id, { isCompleted: true });
    let task = await tasks.read(req.params.t_id);
    res.send({ task: task });
});

router.patch('/mark-undone/:t_id', auth, async (req, res, next) => {
    await tasks.update(req.params.t_id, { isCompleted: false });
    let task = await tasks.read(req.params.t_id);
    res.send({ task: task });
});

module.exports = router;
