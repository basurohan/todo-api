module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            const token = req.get('Auth');

            // Custom class method in user.js
            db.user.findByToken(token).then(function (user) {
                req.user = user;
                next();
            }, function () {
                res.status(401).send();
            });
        }
    };
};