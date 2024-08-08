var mongoose = require('mongoose');

var trainSchema = mongoose.Schema({
	trainNo:{ type: Number, required: true },
	trainName:{ type: String, required: true },
	runsFromStn:{ type: String, required: true },
	src:{ type: String, required: true },
	srcCode:{ type: String, required: true },
	dstn:{ type: String, required: true },
	dstnCode:{ type: String, required: true },
	fromStn:{ type: String, required: true },
	fromStnCode:{ type: String, required: true },
	toStn:{ type: String, required: true },
	toStnCode:{	type: String, required: true },
	depAtFromStn:{ type: String, required: true },
	arrAtToStn:{ type: String, required: true },
	travelTime:{ type: String, required: true },
	trainType:{ type: String, required: true },
	AC1Tier:{ type: Number, required: true },
	AC2Tier:{ type: Number, required: true },
	sleeperClass:{ type: Number, required: true },
	updated: { type: Date, default: Date.now }
});

var Trains = module.exports = mongoose.model('Trains', trainSchema, 'train');


module.exports.getTrains = function(callback, limit) {
	console.log("Requested getTrains() API");
	Trains.find(callback).limit(15);
}


module.exports.getTrains = function(from, to, callback) {
	console.log("Requested getTrains() API");
	//Trains.find({src: from, dstn: to}, callback);
	Trains.find({ $or: [{src: from, dstn: to}, {src: to, dstn: from}] }, callback);
}

module.exports.baseFares = function(traino, callback){
   console.log("Requested baseFares() API");
   Trains.findOne({trainNo: traino}, {AC1Tier:1, AC2Tier: 1, sleeperClass: 1}, callback);
}

module.exports.getTrainName_DepAtFromStn = function(traino, callback){
   console.log("Requested getTrainName_DepAtFromStn() API");
   Trains.find({$or: traino}, {trainNo:1, trainName:1, depAtFromStn: 1}, callback);
}