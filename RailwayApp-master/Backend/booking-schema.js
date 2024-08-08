var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
	  userid: { type: String, required: true },
    reservationType: { type: String, required: true },
	  provisionalNumber: { type: String, required: true },
   	pnrNumber: { type: String, required: true },
   	pnrStatus: { type: String, required: true },
    fromStn: { type: String, required: true },
   	toStn: { type: String, required: true },
   	journeyDt: { type: String, required: true },
   	trainNo: { type: String, required: true },
   	coachNo: { type: String, required: true },
    seatNo: { type: String, required: true },
   	bookingDt: { type: String, required: true },
   	bookingStatus: { type: String, required: true },
   	name: { type: String, required: true },
   	age: { type: String, required: true },
   	adult: { type: String, required: true },
    child: { type: String, required: true },
   	gender: { type: String, required: true },
  	mobile: { type: String, required: true },
   	address: { type: String, required: true },
   	quotaType: { type: String, required: true },
   	nationality: { type: String, required: true },
   	identitytype: { type: String, required: true },
   	identityNumber: { type: String, required: true },
   	berth: { type: String, required: true },
   	class: { type: String, required: true },
   	mealType: { type: String, required: true },
   	concessions: { type: String, required: true },
   	baseFare: { type: String, required: true },
    cateringCharge: { type: String, required: true },
    reservationCharge: { type: String, required: true },
    tatkalCharge: { type: String, required: true },
    gst: { type: String, required: true },
   	totalFare: { type: String, required: true },
   	TransactionId: { type: String, required: true },
   	debitCardId: { type: String, required: true },
   	payersDetl: { type: String, required: true },
   	cardValidDt: { type: String, required: true },
   	paymentDt: { type: String, required: true },
   	payConfirmation: { type: String, required: true }

});

var Bookings = module.exports = mongoose.model('Bookings', bookingSchema, 'bookings');


module.exports.getBookings = function(callback){
	console.log("Requested getBookings() API");
	Bookings.find(callback);
}

module.exports.createBooking = function(bookingData){
	console.log("Requested createBooking() API");
	Bookings.create(bookingData);
}

module.exports.generatePayouts = function(provNumber, callback){
   console.log("Requested generatePayouts() API");
   Bookings.find({provisionalNumber: provNumber}, {trainNo:1, provisionalNumber: 1, baseFare: 1,reservationCharge:1, tatkalCharge: 1, cateringCharge: 1,gst:1, totalFare: 1}, callback);
}

module.exports.update_with_OTP = function(provNumber, updates, callback){
  console.log("Requested update_with_OTP() API");

  var query = {"provisionalNumber": provNumber};
  var update = {
    "pnrStatus": updates.pnrStatus,
    "bookingStatus": updates.bookingStatus,
    "debitCardId": updates.debitCardId,
    "payersDetl": updates.payersDetl,
    "cardValidDt": updates.cardValidDt
  };
  var options = {};

  Bookings.findOneAndUpdate(query, update, options, callback);
}

module.exports.confirmBooking = function(updates, callback){
  console.log("Requested confirmBooking() API");

  var query = {"provisionalNumber": updates.provisionalNumber};
  var update = {
    "pnrNumber": updates.pnrNumber,
    "pnrStatus": 'BOOKING SUCCESSFUL',
    "coachNo": updates.coachNo,
    "seatNo": updates.seatNo,
    "bookingStatus": 'BOOKED',
    "TransactionId": updates.TransactionId,
    "paymentDt": updates.paymentDt,
    "payConfirmation": 'PAYMENT VERIFIED'
  };
  var options = {};

  Bookings.findOneAndUpdate(query, update, options, callback);
}


module.exports.myBookings = function(user, callback){
  console.log("Requested myBookings() API");
  Bookings.find({userid: user, payConfirmation: 'PAYMENT VERIFIED'}, callback);
}


module.exports.pnrSearch = function(user, pnr, callback){
  console.log("Requested pnrSearch() API");
  Bookings.find({userid: user, pnrNumber: pnr, payConfirmation: 'PAYMENT VERIFIED'}, callback);
}



