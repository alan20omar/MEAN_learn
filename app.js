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

// Upadate a object (update full object)
app.put('/tasklists/:tasklistid',(req, res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistid},{$set: req.body})
        .then((obUpdated) => {
            res.status(201);
            res.send(obUpdated);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Upadate a parcial object 
app.patch('/tasklists/:tasklistid',(req, res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistid},{$set: req.body})
        .then((obUpdated) => {
            res.status(200);
            res.send(obUpdated);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

// Delete a tasklist by id
app.delete('/tasklists/:tasklistid', (req, res) => {
    TaskList.findByIdAndDelete({ _id: req.params.tasklistid })
        .then((obUpdated) => {
            res.status(202);
            res.send(obUpdated);
        })
        .catch((error) => {
            res.status(500);
            console.log(error);
        });
});

app.listen(3000,()=>{
    console.log('server started on port 3000');
});