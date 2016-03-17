//put logic for database initialization here
(function(){
      var json = require('./acl_role_name');
      var model = require('./../models/acl_role_name');

      model.remove().exec(function () {
            model.insertMany(json);
      });
})();


