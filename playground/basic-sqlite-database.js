const Sequelize = require('sequelize');
let sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

let Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1,250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

// sequelize.sync({force: true}).then(function () {
sequelize.sync().then(function () {
    console.log('Everything is synced');

    Todo.findAll().then(function (todos) {
        todos.forEach(todo => {
            console.log(todo.toJSON().description);
        });
    });

    Todo.findById(7).then(function (todo) {
        if(todo) {
            console.log(todo.toJSON());
        }else {
            console.log('Item not found');
        }
    });


    // Todo.create({
    //     description: 'Walk my dog'
    //     // completed: false
    // }).then(function (todo) {
    //     return Todo.create({
    //         description: 'Clean office'
    //     });
    // }).then(function () {
    //     // return Todo.findById(1);
    //     return Todo.findAll({
    //         where: {
    //             // completed: false
    //             description: {
    //                 $like: '%Office%'
    //             }
    //         }
    //     });
    // }).then(function (todos) {
    //     if (todos) {
    //         todos.forEach(todo => {
    //             console.log(todo.toJSON()); 
    //         });
    //     }else {
    //         console.log('No todo found');
    //     }
    // }).catch(function (e) { 
    //     console.log(e.message);
    // });
});