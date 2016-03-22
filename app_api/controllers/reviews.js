var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//create a Location model
module.exports.reviewsReadOne = function(req,res){
	if(req.params && req.params.locationid && req.params.reviewid){
		Loc
		.findById(req.params.locationid)	//find document and return query
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
					sendJsonResponse(res,200,response);		//send document found as JSON response
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
		});
	}
};

module.exports.reviewsCreate = function(req,res){
	if(req.params && req.params.locationid){
		Loc
		.findById(req.params.locationid)
		.select('reviews')								//Mongoose select method will tell MongoDB to get the reviews of a location
		.exec(function(err, location){		
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

			doAddReview(req,res,location);		//successful find operation will call new function to add
		});
	}
	else{
		sendJsonResponse(res,404,{
			"message": "Not found, locationid required"
		});
	}
};

module.exports.reviewsUpdateOne = function(req,res){
	if(!req.params.locationid){
		sendJsonResponse(res,404,{
			"message": "Not found, locationid required"
		});
		return;
	}

	Loc
	.findById(req.params.locationid)
	.select('reviews')								//Mongoose select method will tell MongoDB to get the reviews of a location
	.exec(function(err, location){	
		var reviewToUpdate;	
		if(!location){									//if location is undefined, then it will be true
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

		if(location.reviews && location.reviews.length > 0){
			reviewToUpdate = location.reviews.id(req.params.reviewid);
			console.log('reviewToUpdate: '+reviewToUpdate);
			if(reviewToUpdate != null){
				reviewToUpdate.author = req.body.author;
				reviewToUpdate.rating = req.body.rating;
				reviewToUpdate.reviewText = req.body.reviewText;
				location.save(function(err,location){
					if(err){
						sendJsonResponse(res, 404, err);
					} else {
						updateAverageRating(req.params.locationid);
						sendJsonResponse(res, 200, reviewToUpdate);
					}
				});
			} else {
				sendJsonResponse(res, 404, {
					"message": "No reviews found to update"
				});
			}
		} else {
			sendJsonResponse(res, 404, {
				"message": "Not found, locationid and reviewid are both required"
			});
		}
	});
	
};

var sendJsonResponse = function(res, status, content){
	res.status(status);		//send response status code
	res.json(content);		//send response JSON data
};

var doAddReview = function(req,res,location){
	if(!location){								//add validation for being accessible from other controllers
		sendJsonResponse(res, 404, {
			"message": "locationid not found"
		});
	} else {
		location.reviews.push({			//add a new object to an array by using Javascript push method
			author: req.body.author,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});
		location.save(function(err,location){		//subdoc can't be saved on their own. Parent doc needs to use Mongoose save method.
			var thisReview;
			if(err){
				sendJsonResponse(res,400,err);
			} else {
				console.log('location.reviews[0]: '+location.reviews[0]);
				updateAverageRating(location._id);
				thisReview = location.reviews[location.reviews.length - 1];
				//find latest added review in array and return as JSON confirmation response
				sendJsonResponse(res,201,thisReview);
			}
		})
	}
};

var updateAverageRating = function(locationid){
	Loc
		.findById(locationid)
		.select('rating reviews')
		.exec(function(err,location){
			if(!err){
				doSetAverageRating(location);
			}
		});
};

var doSetAverageRating = function(location){
	var i, reviewCount, ratingAverage, ratingTotal;
	if(location.reviews && location.reviews.length > 0){
		reviewCount = location.reviews.length;
		ratingTotal = 0;
		for(i = 0; i< reviewCount; i++){
			ratingTotal = ratingTotal + location.reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save(function(err){
			if(err){
				console.log(err);
			} else {
				console.log("Average rating updated to", ratingAverage);
			}
		});
	}
};