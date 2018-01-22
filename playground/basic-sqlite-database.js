const Sequelize = require('sequelize');
let sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

let Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING
    },
    completed: {
        type: Sequelize.BOOLEAN
    }
});

sequelize.sync().then(function () {
    console.log('Everything is synced');

    Todo.create({
        description: 'Walk my dog',
        completed: false
    }).then(function (todo) {
        console.log('Finished');
        console.log(todo);
    });;
});