const cryptojs = require('crypto-js');

module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            //set it to empty string so that call to MD5 does not fail
            let token = req.get('Auth') || ''; 

            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function (tokenInstance) {
                if(!tokenInstance) {
                    throw new Error();
                }

                req.token = tokenInstance;
                return db.user.findByToken(token);

            }).then(function (user) {
                req.user = user;
                next();
            }).catch(function () {
                res.status(401).send();
            });

            // Custom class method in user.js
            // db.user.findByToken(token).then(function (user) {
            //     req.user = user;
            //     next();
            // }, function () {
            //     res.status(401).send();
            // });
        }
    };
};