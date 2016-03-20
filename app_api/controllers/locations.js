var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//bring in Location model
module.exports.locationsListByDistance = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsCreate = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsReadOne = function(req,res){
	Loc
		.findById(req.params.locationid)	//findById is mongoose model methods to query db. req.params give access to locationid
		.exec(function(err, location){		//execute query
			sendJsonResponse(res,200,location);		//send document found as JSON response
		});
};
module.exports.locationsUpdateOne = function(req,res){
	res.render('layout', { title: 'locationsUpdateOne' });
};
module.exports.locationsDeleteOne = function(req,res){
	res.render('layout', { title: 'locationsDeleteOne' });
};

var sendJsonResponse = function(res, status, content){
	res.status(status);		//send response status code
	res.json(content);		//send response JSON data
};