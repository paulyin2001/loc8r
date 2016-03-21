var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//bring in Location model
module.exports.reviewsReadOne = function(req,res){
	if(req.params && req.params.locationid && req.params.reviewid){
		Loc
		.findById(req.params.locationid)
		.select('name reviews')						//Mongoose select method will tell MongoDB to get the name and the reviews of a location
		.exec(function(err, location){		
			
			var response, review;

			if(!location){									//if location is undefined, then it will be true. If Mongoose doesn't return a location...
				console.log('location: '+location);	//debug
				sendJsonResponse(res, 404, {				//send 404 message
					"message": "locationid not found"
				});
				return;															//exit function scope using return statement
			}
			else if(err){
				sendJsonResponse(res,400,err);	//send 400 status bad request
				return;
			}

			if(location.reviews && location.reviews.length > 0){	//check that returned location has reviews
				review = location.reviews.id(req.params.reviewid);	//Use Mongoose subdocument.id method for searching for matching
				if(!review){
					sendJsonResponse(res, 404, {
						"message": "reviewid not found "+req.params.reviewid
					});
				} 
				else{
					response = {
						location : {
							name: location.name,
							id: req.params.locationid
						},
						review: review
					};
					sendJsonResponse(res,200,response);
				}
			} 
			else{
				sendJsonResponse(res,404, {
					"message": "No reviews found"
				});
			}
		});
	}
	else{
		sendJsonResponse(res,404,{
			"message": "Not found, locationid and reviewid are both required"
		});		//send document found as JSON response
	}
};
module.exports.locationsReadOne = function(req,res){
	console.log('in locationsReadOne'+', req.params:'+req.params+', req.params.locationid:'+req.params.locationid);	//debug
	if(req.params && req.params.locationid){	//check locationid and params exist			
		//if Loc is undefined, browser will keep spinning. How do we debug this?
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

var sendJsonResponse = function(res, status, content){
	res.status(status);		//send response status code
	res.json(content);		//send response JSON data
};