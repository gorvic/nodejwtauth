var express = require('express')
    , router = express.Router()
    , User = require('../models/user')
    , jwt = require('jsonwebtoken')
    , config = require('../../config')
    , secretKey = config.secret;

router.post('/signup', function (req, res) {
    var me = this;
    me.credentials = {
        email: req.body.email,
        password: req.body.password,
    }
    User.findOne(
        {'email': credentials.email},
        function (err, user) {

            if (!user) {

                var signupUser = new User();

                signupUser.email = me.credentials.email;
                signupUser.password = me.credentials.password;
                signupUser.save();

                res.json({
                    success: true,
                    message: 'User ' + me.credentials.email + ' created successfully'
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
router.post('/login', function(req,res){
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
})

module.exports = router