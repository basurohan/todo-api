const Sequelize = require('sequelize');
let sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

const Todo = sequelize.define('todo', {
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

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
    }
});

Todo.belongsTo(User);
User.hasMany(Todo);


// sequelize.sync({force: true}).then(function () {
sequelize.sync().then(function () {
    console.log('Everything is synced');

    User.findById(1).then(function(user) {
        user.getTodos({where: {
            completed: false
        }}).then(function(todo) {
            todo.forEach(element => {
                console.log(element.toJSON());
            });
        });
    });


    // User.create({
    //     email: 'rohan@example.com'
    // }).then(function (user) {
    //     return Todo.create({
    //         description: 'Clear yard'
    //     });
    // }, function () {
    //     reset.status(500).send();
    // }).then(function (todo) {
    //     User.findById(1).then(function (user) {
    //         user.addTodo(todo);
    //     });
    // });

    // Todo.findAll().then(function (todos) {
    //     todos.forEach(todo => {
    //         console.log(todo.toJSON().description);
    //     });
    // });

    // Todo.findById(7).then(function (todo) {
    //     if(todo) {
    //         console.log(todo.toJSON());
    //     }else {
    //         console.log('Item not found');
    //     }
    // });

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