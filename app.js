const express = require('express');
const app = express();

const mongoose = require('./database/mongoose'); // Base de datos

const TaskList = require('./database/models/taskList')
const Task = require('./database/models/task')

// /*
// CORS - Cross Origin Request Security
// Backend - http://localhost:3000
// Frontend - http://localhost:4200
// */
// 3rd party library, app.use(cors());
// Add headers before the routes are defined
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Example of middleware
app.use(express.json()); // Or 3rd party bodyParser

// Routes or REST API Endpoints or RESTFul webservices Endpoints
/*
TaskList - Crate, Update, ReadTaskListById, ReadAllTaskList
Task - Crate, Update, ReadTaskById, ReadAllTask
*/

// Routes or API endpoints for TaskList model
// Http://localhost:3000/tasklists => [{TaskList}, {TaskList}]
// Get All Task List
app.get('/tasklists',(req, res) => {
    TaskList.find({})
        .then((lists) => {
            res.status(200);
            res.send(lists);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});
// Get one Task List by id from a parameter on the url
app.get('/tasklists/:tasklistid',(req, res) => {
    let tasklistid = req.params.tasklistid;
    TaskList.find({'_id':tasklistid})
        .then((data) => {
            res.status(200);
            res.send(data);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Route or Endpoint for creating a TaskList
app.post('/tasklists',(req, res) => {
    console.log('hola post method', req.body)
    let taskListObj = { 'title': req.body.title, 'name': req.body.name }
    TaskList(taskListObj).save()
        .then((lists) => {
            res.status(201);
            res.send(lists);
        })
        .catch((error) => { 
            res.status(500);
            console.log(error); 
        });
})

// Update a object (update full object)
app.put('/tasklists/:tasklistid',(req, res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistid},{$set: req.body})
        .then((obj) => {
            res.status(201);
            res.send(obj);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Upadate a parcial object 
app.patch('/tasklists/:tasklistid',(req, res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistid},{$set: req.body})
        .then((obj) => {
            res.status(200);
            res.send(obj);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Delete a tasklist by id
app.delete('/tasklists/:tasklistid', (req, res) => {
    TaskList.findByIdAndDelete({ _id: req.params.tasklistid })
        .then((objdeleted) => {
            res.status(202);
            res.send(objdeleted);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// CRUD operation for task, a task should always belong to a tasklist
// Get all tasks for 1 tasklist http://localhost:3000/tasklists/:tasklist/tasks
app.get('/tasklists/:tasklistid/tasks', (req, res) => {
    Task.find({_taskListId: req.params.tasklistid})
        .then((tasks) => {
            res.status(200);
            res.send(tasks);
        })
        .catch((error) =>{
            res.status(500);
            console.log(error);
        });
});

// Create a task inside a particular tasklist
app.post('/tasklists/:tasklistid/tasks', (req, res) =>{
    let taskObject = {
        title: req.body.title,
        _taskListId: req.params.tasklistid,
        commpleted: req.body.commpleted 
    };
    Task(taskObject).save()
        .then((data) => {
            res.status(201);
            res.send(data);
        })
        .catch((error) => {
            res.status(500);
            console.log(error)
        });
});

// Get 1 tasks for 1 tasklist http://localhost:3000/tasklists/:tasklist/tasks/:taskid
app.get('/tasklists/:tasklistid/tasks/:taskid', (req, res) => {
    Task.find({ _taskListId: req.params.tasklistid, _id: req.params.taskid })
        .then((task) => {
            res.status(200);
            res.send(task);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Update 1 task for 1 tasklist http://localhost:3000/tasklists/:tasklist/tasks/:taskid
app.put('/tasklists/:tasklistid/tasks/:taskid', (req, res) => {
    let taskObject = {
        title: req.body.title,
        _taskListId: req.params.tasklistid,
        completed: req.body.completed
    };
    Task.findOneAndUpdate({ _id: req.params.taskid, _taskListId: req.params.tasklistid }, {$set: req.body})
        .then((obj) => {
            res.status(201);
            res.send(obj);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Update 1 partial (completed) task for 1 tasklist http://localhost:3000/tasklists/:tasklist/tasks/:taskid
app.patch('/tasklists/:tasklistid/tasks/:taskid', (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.taskid, _taskListId: req.params.tasklistid }, {$set: req.body})
        .then((obj) => {
            res.status(200);
            res.send(obj);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Delete 1 task of 1 tasklist
app.delete('/tasklists/:tasklistid/tasks/:taskid', (req, res) => {
    Task.findByIdAndDelete({ _id: req.params.taskid })
        .then((objdeleted) => {
            res.status(202);
            res.send(objdeleted);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

app.listen(3000,()=>{
    console.log('server started on port 3000!');
});