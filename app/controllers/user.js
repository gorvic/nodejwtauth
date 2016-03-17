var express = require('express')
    , router = express.Router()
    , User = require('../models/user')
    , auth = require('../middlewares/auth');

//router.use(auth);
router.post('/',auth, function (req, res) {

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

});
router.get('/',auth, function(req,res){
    console.log(req);
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

router.get('/:user_id',auth,function(req,res){
        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);

            // return that user
            res.json(user);
        });
});
router.put('/:user_id',auth,function(req,res){
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
});


router.delete('/:user_id',auth, function (req, res) {
    User.remove({
        _id: req.params.user_id
    }, function (err, user) {
        if (err) res.send(err);

        res.json({message: 'Successfully deleted'});
    });
})

module.exports = router