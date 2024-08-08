var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
   email: { type: String, required: true },
   password: { type: String, required: true },
   lang: { type: String, required: true },
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   dob: { type: String, required: true },
   aadhar: { type: String, required: false },
   pan: { type: String, required: false },
   occupation: { type: String, required: false },
   countryCode: { type: String, required: true },
   phone: { type: String, required: true },
   address: { type: String, required: true },
   city: { type: String, required: true },
   state: { type: String, required: false },
   country: { type: String, required: true },
   pin: { type: String, required: true },
   userType: { type: String, required: true },
   lastLoggIn: { type: String, required: true },
   sessionStatus: { type: String, required: true },
   currentSession: { type: String, required: true },
   updated: { type: Date, default: Date.now }
});

var Users = module.exports = mongoose.model('Users', userSchema, 'users');


module.exports.createToken = function(userEmail, callback){
	console.log("Requested createToken() API");
	Users.findOne({email: userEmail}, callback);
}


module.exports.updateToken = function(email, status, token, options, callback){
	console.log("Requested InsertedToken()");

   var query = {"email": email};
	var update = {
      "sessionStatus": status,
		"currentSession": token,
	};

	Users.findOneAndUpdate(query, update, options, callback);
}


module.exports.verifyToken = function(userEmail, callback){
   console.log("Requested verifyToken() API");
   Users.findOne({email: userEmail}, {userType:1, sessionStatus: 1, currentSession: 1}, callback);
}

module.exports.createUser = function(userData, callback){
   console.log("Creating User API()");
   Users.create(userData);
}


module.exports.checkUserStatus = function(userEmail, callback){
   console.log("Requested checkUserStatus() API");
   Users.findOne({email: userEmail}, callback);
}


module.exports.updateUserStatus = function(userEmail, callback){
   console.log("Requested updateUserStatus() API");
   var query = {"email": userEmail};
   var update = {
         "sessionStatus": "Verified"
   };
   var options = {};

   Users.findOneAndUpdate(query, update, options, callback);
}

module.exports.basicDetls = function(userEmail, callback){
   console.log("Requested basicDetls() API");
   Users.findOne({email: userEmail}, {email:1, firstName: 1, phone: 1}, callback);
}


module.exports.updatePassword = function(userEmail, pass, callback){
   console.log("Requested updatePassword() API");
   var query = {"email": userEmail};
   var update = {
         "password": pass
   };
   var options = {};

   Users.findOneAndUpdate(query, update, options, callback);
}

module.exports.profileDetails = function(userEmail, callback){
   console.log("Requested profileDetails() API");
   Users.findOne({email: userEmail}, callback);
}
