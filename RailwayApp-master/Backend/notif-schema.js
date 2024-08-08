var mongoose = require('mongoose');

var notifSchema = mongoose.Schema({
   userid: { type: String, required: true },
   dateOfCreation: { type: String, required: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   status: { type: String, required: true },
   updated: { type: Date, default: Date.now }
});




var Notifications = module.exports = mongoose.model('Notifications', notifSchema, 'notification');


module.exports.createNotification = function(notify){
	console.log("Creating createNotification API()");
   	Notifications.create(notify);
}

module.exports.notificationUnRead = function(userEmail, callback){
   console.log("Requested notificationUnRead() API");
   Notifications.find({userid: userEmail, "status": "UNREAD"}, callback);
}


module.exports.notificationRead = function(id, userEmail, callback){
   console.log("Requested notificationRead() API");
   var query = {_id: id, userid: userEmail};
   var update = {
         "status": "READ"
   };
   var options = {};

   Notifications.findOneAndUpdate(query, update, options, callback);
}