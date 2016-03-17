var express = require('express')
    , router = express.Router();

router.use('/api/auth', require('./auth'));
router.use('/api/users', require('./user'));

router.get('/', function(req, res) {
    res.send('Home page');
});

module.exports = router;