var mongoose = require('mongoose');

var stationSchema = mongoose.Schema({
	stn: { type: String, required: true },
   	stnCode: { type: String, required: true }
});

var Stations = module.exports = mongoose.model('Stations', stationSchema, 'stations');


module.exports.getStations = function(callback){
	console.log("Requested getStations() API");
	Stations.find(callback);
}

module.exports.getStnCode = function(stnName, callback){
	console.log("Requested getStnCode() API");
	Stations.find({stn: stnName}, callback);
}
