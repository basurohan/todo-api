const bcrypt = require('bcrypt');
const _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNULL: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNULL: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, 
    {
        hooks: {
            beforeValidate: function (user, options) {
                //user.email
                if(typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        }
        // instanceMethods: {
        //     toPublicJSON: function () {
        //         const json = this.toJSON();
        //         return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
        //     }
        // }
    });

    User.prototype.toPublicJSON = function () {
        const json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
    }

    return User;
};