// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '96857768325685', // your App ID
        'clientSecret': 'f7e0b10012678c517558477054bffb36', // your App Secret
        'callbackURL': 'http://localhost:8080/api/auth/facebook/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    },

    'tokenAuth': {
        secret: 'secretsecret'
    }

};