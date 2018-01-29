const bcrypt = require('bcrypt');
const _ = require('underscore');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

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

    // Class Method
    User.authenticate = function (body) {
        return new Promise(function (resolve, reject) {
            if(!body.hasOwnProperty('email') && !body.hasOwnProperty('password') && !_.isString(body.email) && !_.isString(body.password)) {
                return reject();
            }

            User.findOne({
                where: {
                    email: body.email
                }
            }).then(function (user) {
                if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                    return reject();
                }
                
                resolve(user);
            }, function (e) {
                reject();
            });
        });
    };

    User.findByToken = function (token) {
        return new Promise(function (resolve, reject) {
            try {
                const decodedJWT = jwt.verify(token, 'qwerty098');
                const bytes = crypto.AES.decrypt(decodedJWT.token, 'abc123!@!#');
                const tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));

                User.findById(tokenData.id).then(function (user) {
                    if(user) {
                        resolve(user);
                    }else {
                        reject();
                    }
                }, function () {
                    reject();
                });
            } catch (e) {
                reject();
            }
        });
    };

    // Instance method
    User.prototype.toPublicJSON = function () {
        const json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
    };

    User.prototype.generateToken = function (type) {
        if(!_.isString(type)) {
            return undefined;
        }

        try {
            const stringData = JSON.stringify({
                id: this.get('id'),
                type: type
             });
             const encryptedData = crypto.AES.encrypt(stringData, 'abc123!@!#').toString();
             const token = jwt.sign({
                 token: encryptedData
             }, 'qwerty098');

             return token;
        } catch (e) {
            return undefined;
        }
    };

    return User;
};