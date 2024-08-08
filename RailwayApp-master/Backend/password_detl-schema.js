var mongoose = require('mongoose');

var password_detlSchema = mongoose.Schema({
   userid: { type: String, required: true },
   shortener: { type: String, required: true },
   sessionId: { type: String, required: true },
   status: { type: String, required: true },
   updated: { type: Date, default: Date.now }
});


var Password_detls = module.exports = mongoose.model('Password_detls', password_detlSchema, 'password_issue');


module.exports.createPasswordChangeToken = function(passw_detls){
	console.log("Creating createPasswordChangeToken API()");
   	Password_detls.create(passw_detls);
}

module.exports.verifyPasswordChangeRequest = function(userEmail, shorten, callback){
   console.log("Requested verifyPasswordChangeRequest() API");
   Password_detls.findOne({userid: userEmail, shortener: shorten, "status": "New Link"}, callback);
}


module.exports.updatePasswordStatus = function(userEmail, shorten, callback){
   console.log("Requested updatePasswordStatus() API");
   var query = {"userid": userEmail, "shortener": shorten};
   var update = {
         "status": "Verified"
   };
   var options = {};

   Password_detls.findOneAndUpdate(query, update, options, callback);
}