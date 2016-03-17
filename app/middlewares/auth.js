var jwt = require('jsonwebtoken')
    , config = require('../../config')
    , secretKey = config.secret;

module.exports = function (req, res, next) {
    // do logging
    console.log('checking token');

    // check header or url parameters or post parameters for token
    var token =
        req.body.token
        || req.param('token')
        || req.headers['x-access-token']; //+ssl
    // https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens#comment-2534279249

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err)
                return res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next(); // make sure we go to the next routes and don't stop here
            }
        });

    } else {

        // if there is no token
        // return an HTTP response of 403 (access forbidden) and an error message
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
}

