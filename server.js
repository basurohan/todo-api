const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let todos = [{
    id: 1,
    description: "Meet mom for lunch",
    completed: false
},
{
    id: 2,
    description: "Go to market",
    completed: false
},
{
    id: 3,
    description: "Buy groceries",
    completed: true
}];

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

app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});