var mongoose = require('mongoose');

var otpReqSchema = mongoose.Schema({
	email: { type: String, required: true },
   	session_id: { type: String, required: true },
   	otpn: { type: String, required: true },
   	type: { type: String, required: true },
   	status: { type: String, required: true }
});


var OTPreq = module.exports = mongoose.model('OTPreq', otpReqSchema, 'otpreq');

module.exports.requestOTPGeneration = function(otp, callback){
	console.log("Requested OTP Generation() API");
	OTPreq.create(otp);
}

module.exports.verifyOTP = function(otpUID, callback){
	console.log("Requested verifyOTP() API");
	OTPreq.find({email: otpUID}, callback);
}

module.exports.verifyResponse = function(identifier, s_id, otpass, callback){
	console.log("Requested verifyResponse() API");
	OTPreq.find({email: identifier, session_id: s_id, otpn: otpass, status: 'Not Verified'}, callback);
}


module.exports.updateStatus = function(oid, callback){
	console.log("Requested updateStatus() API");
	var query = {_id: oid};
	var update = {
      	"status": "Verified"
	};
	var options = {};

	OTPreq.findOneAndUpdate(query, update, options, callback);
}