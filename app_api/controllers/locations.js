var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//bring in Location model
module.exports.locationsListByDistance = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsCreate = function(req,res){
	sendJsonResponse(res, 200, {"status":"success"});
};
module.exports.locationsReadOne = function(req,res){
	console.log('in locationsReadOne'+', req.params:'+req.params+', req.params.locationid:'+req.params.locationid);	//debug
	if(req.params && req.params.locationid){	//check locationid and params exist
		Loc
			.findById(req.params.locationid)	//findById is mongoose model methods to query db. req.params give access to locationid
			.exec(function(err, location){		//execute query
				if(!location){									//if location is undefined, then it will be true. If Mongoose doesn't return a location...
					console.log('location: '+location);	//debug
					sendJsonResponse(res, 404, {				//send 404 message
						"message": "locationid not found"
					});
					return;															//exit function scope using return statement
				}
				sendJsonResponse(res,200,location);		//send document found as JSON response
			});
	}
	else{
		// For now, this will only happen if I have line "router.get('/locations', ctrlLocations.locationsReadOne);" in routes
		sendJsonResponse(res,404,{
			"message": "No locationid in request"
		});
	}
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