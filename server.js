const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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
    let matchedTodo;

    todos.forEach(element => {
        if (element.id === todoId) {
            matchedTodo = element;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.send('Item not found');
    }

});

// POST /todos
app.post('/todos', function (req, res) {
    let body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    res.json('Item added');
});


app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});