var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var secretKey = config.secret;

module.exports = function (app, express) {

    var apiRouter = express.Router();

    // route to generate signup user
    apiRouter
        .route('/signup')
        .post(function (req, res) {

            var _this = this;

            var email = req.body.email;
                password = req.body.password,
                isAdmin = req.body.isAdmin;

            var credentials = {
                email: req.body.email,
                password: req.body.password,
                isAdmin: req.body.isAdmin
            };
            _this.credentials  = credentials;
            //var isValid = (email && password);

            User.findOne(
                {'email': credentials.email},
                function (err, user) {

                    if (!user) {

                        var signupUser = new User();

                        signupUser.email = _this.credentials.email;
                        signupUser.password = _this.credentials.password;
                        signupUser.isAdmin = _this.credentials.isAdmin;
                        signupUser.save();

                        res.json({
                            success: true,
                            message: 'User ' + _this.credentials.email + ' created successfully'
                        });

                    } else {
                        console.log(user);
                        res.status(403)
                            .json(
                                 {
                                success: false,
                                message: 'User ' + user.email + ' is already exist!'
                            });
                    }
                });
        });

    //
    // route to authenticate a user (POST http://localhost:8080/api/)
    apiRouter
        .route('/login')
        //.get(function (req, res) { res.send('Hello')})
        .post(function (req, res) {
            console.log(req.body.email);

            var _this = this;

            credentials = {
                //email: req.param('email'),
                //password: req.param('password')
                email:req.body.email,
                password:req.body.password
            };

            _this.credentials = credentials;
            // find the user
            User.findOne({
                    email: credentials.email
                })  //make query
                .select('name email isAdmin password') //select fields
                .exec(function (err, user) {
                        console.log(user);
                        if (err) throw err;

                        // no user with that email was found or password was incorrect
                        var isValid = (user && user.comparePassword(req.body.password));

                        if (!isValid) {
                            res.json({
                                success: false,
                                message: 'Authentication failed. Incorrect email or password.'
                            });
                        } else {


                            // if user is found and password is right
                            // create a token
                            // https://www.npmjs.com/package/jsonwebtoken
                            //payload could be an object literal, buffer or string. Please note that exp is only set if the payload is an object literal.

                            var payload = {
                                email: user.email,
                                username: user.username,
                                isAdmin: user.isAdmin
                            };

                            var token = jwt.sign(payload
                                , secretKey
                                , {
                                    expiresIn: 60 * 60 // 1 hour
                                });

                            // return the information including token as JSON
                            res.json({
                                success: true,
                                message: 'Got token!',
                                token: token
                            });
                        }
                    }
                );
        });

    // route middleware to verify a token
    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');

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


    });

    // test route to make sure everything is working
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function (req, res) {
        res.json({message: 'Api home!'});
    });

    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

        // create a user (accessed at POST http://localhost:8080/users)
        .post(function (req, res) {

            var user = new User();		// create a new instance of the User model
            user.name = req.body.name;  // set the users name (comes from the request)
            user.email = req.body.email;  // set the users email (comes from the request)
            user.password = req.body.password;  // set the users password (comes from the request)

            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({success: false, message: 'A user with that email already exists. '});
                    else
                        return res.send(err);
                }

                // return a message
                res.json({message: 'User created!'});
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function (req, res) {

           if (req.decoded.isAdmin) {
               User.find(function (err, users) {
                   if (err) {
                       res.send(err);
                   }
                   // return the users
                   res.json(users);
               });
           } else {
               User.findOne(
                   {'email': req.decoded.email},
                   function (err, user) {
                       if (err) res.send(err);

                       // return that user
                       res.send([{
                           email: user.email,
                           isAdmin: user.isAdmin
                       }]);
                   });
           }
        });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {

                if (err) res.send(err);

                // set the new user information if it exists in the request
                if (req.body.name) user.name = req.body.name;
                if (req.body.email) user.email = req.body.email;
                if (req.body.password) user.password = req.body.password;

                // save the user
                user.save(function (err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({message: 'User updated!'});
                });

            });
        })

        // delete the user with this id
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err) res.send(err);

                res.json({message: 'Successfully deleted'});
            });
        });

    return apiRouter;
};
