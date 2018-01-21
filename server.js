const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('underscore');

const PORT = process.env.PORT || 3000;

let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET  /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});

// GET /todos/id
app.get('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    const matchedTodo = _.findWhere(todos, {id: todoId});
    
    // let matchedTodo;
    // todos.forEach(element => {
    //     if (element.id === todoId) {
    //         matchedTodo = element;
    //     }
    // });

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.send('Item not found');
    }

});

// POST /todos
app.post('/todos', function (req, res) {
    let body = _.pick(req.body, 'description', 'completed');

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json('Item added');
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    const matchedTodo = _.findWhere(todos, {id: todoId});

    if(matchedTodo){
        todos = _.without(todos, matchedTodo);
        res.json("Item deleted");
    } else {
        res.json('Item not found');
    }

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    let matchedTodo = _.findWhere(todos, {id: todoId});
    let body = _.pick(req.body, 'description', 'completed');
    let validAttributes = {};

    if(!matchedTodo) {
        return res.status(404).send();
    }

    // Check whether completed field has been provided
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    }else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    // Check whether description field has been provided
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    }else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    //HERE - validation passed. Update values
    _.extend(matchedTodo, validAttributes);
    res.json('Item Updated');

});


app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});