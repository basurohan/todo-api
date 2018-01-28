const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db.js');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API root');
});

// GET  /todos?completed=true&q=
app.get('/todos', function (req, res) {
    const query = req.query;
    let where = {};

    if(query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    }else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    });

    // let filteredTodos = todos;

    // if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {completed: true});
    // }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {completed: false});
    // }

    // if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function (todo) {
    //         return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
    //     });
    // }
    // res.json(filteredTodos);

});

// GET /todos/id
app.get('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    // const matchedTodo = _.findWhere(todos, {id: todoId});
    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // }
    // else {
    //     res.send('Item not found');
    // }

    db.todo.findById(todoId).then(function (todo) {
        if(!!todo) {
            res.json(todo.toJSON());
        }else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });

});

// POST /todos
app.post('/todos', function (req, res) {
    let body = _.pick(req.body, 'description', 'completed');

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);

    db.todo.create(body).then(function (todo) {
        res.json('Item added');
    }, function (e) {
        res.status(400).json(e);
    });

});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    
    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) {
        if(rowsDeleted === 0) {
            res.status(404).json({
                error: 'Item not found'
            });
        }else {
            res.status(200).json('Item Deleted');
        }
    }, function (e) {
        res.status(500).send();
    });


    
    // const matchedTodo = _.findWhere(todos, {id: todoId});

    // if(matchedTodo){
    //     todos = _.without(todos, matchedTodo);
    //     res.json("Item deleted");
    // } else {
    //     res.json('Item not found');
    // }

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    let body = _.pick(req.body, 'description', 'completed');
    let attributes = {};

    if(body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if(body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function (todo) {
        if(todo) {
            todo.update(attributes).then(function (todo) {
                res.json({
                    success: "Item updated"
                })
            }, function (e) {
                res.status(400).json(e);
            });
        }else {
            res.status(404).json({
                error: 'Item not found'
            });
        }
    }, function () {
        res.status(500).send();
    });

    
    // let matchedTodo = _.findWhere(todos, {id: todoId});
    // let body = _.pick(req.body, 'description', 'completed');
    // let validAttributes = {};

    // if(!matchedTodo) {
    //     return res.status(404).send();
    // }

    // // Check whether completed field has been provided
    // if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    //     validAttributes.completed = body.completed;
    // }else if (body.hasOwnProperty('completed')) {
    //     return res.status(400).send();
    // }

    // // Check whether description field has been provided
    // if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    //     validAttributes.description = body.description;
    // }else if (body.hasOwnProperty('description')) {
    //     return res.status(400).send();
    // }

    // //HERE - validation passed. Update values
    // _.extend(matchedTodo, validAttributes);
    // res.json('Item Updated');

});

// POST /users
app.post('/users', function (req, res) {
    let body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

// POST /users/login
app.post('/users/login', function (req, res) {
    const body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(401).send();
    });

});


db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});