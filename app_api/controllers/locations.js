var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//bring in Location model
module.exports.locationsListByDistance = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsCreate = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsReadOne = function(req,res){
	sendJsonResponse(res, 200, {
		"status":"success"
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