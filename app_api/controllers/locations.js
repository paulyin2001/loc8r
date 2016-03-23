var mongoose = require('mongoose');		//give controllers access to db
var Loc = mongoose.model('Location');	//bring in Location model

module.exports.locationsListByDistance = function(req,res){
	var lng = parseFloat(req.query.lng);	//get coordinates from query string
	var lat = parseFloat(req.query.lat);	//and convert from strings to numbers
	console.log('lng: '+lng+', lat: '+lat);	//debug
	var point = {		//create geoJSON point
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,		//Determine whether the search will be done by spherical object or a flat plane
		num: 10,						//show up to 10 results
		maxDistance: theEarth.getRadsFromDistance(req.query.maxDistance)	//set max distance to 10000 miles
	};
	if(!lng || !lat){
		sendJsonResponse(res,404,{
			"message": "lng and lat query parameters are required"
		});
		return;
	}
	Loc.geoNear(point, geoOptions, function(err,results,stats){	//Use Mongoose geoNear
		var locations = [];	//create array to hold processed results data
		if(err){
			sendJsonResponse(res,404,err);
		}else{
			results.forEach(function(doc){	//loop thru geoNear query results
				locations.push({
					distance: theEarth.getDistanceFromRads(doc.dis),
					name: doc.obj.name,
					address: doc.obj.address,
					rating: doc.obj.rating,
					facilities: doc.obj.facilities,
					_id: doc.obj._id
				});
			});
			sendJsonResponse(res,200,locations);
		}
	});
};

module.exports.locationsCreate = function(req,res){
	Loc.create({																		//use Mongoose create method
		name: req.body.name,
		address: req.body.address,
		//no rating, because default is set in schema
		facilities: req.body.facilities.split(","),		//create array with split. Need validation or required, otherwise undefined.split will cause error
		coords:[parseFloat(req.body.lng),parseFloat(req.body.lat)],	//need validation or required, otherise parse will cause error
		openingTimes:[{
			days: req.body.days1,
			opening: req.body.opening1,
			closing:req.body.closing1,
			closed: req.body.closed1
		},{
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2
		}]
	}, function(err,location){
		if(err){
			console.log('name: '+req.body.name);
			console.log('address: '+req.body.address);
			console.log('facilities: '+req.body.facilities.split(","));
			console.log('coords: '+[parseFloat(req.body.lng),parseFloat(req.body.lat)]);
			sendJsonResponse(res,400,err);
		}else{
			sendJsonResponse(res,201,location);
		}
	});	//validation will be done in schema
};

module.exports.locationsReadOne = function(req,res){
	//console.log('in locationsReadOne'+', req.params:'+req.params+', req.params.locationid:'+req.params.locationid);	//debug
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

module.exports.locationsUpdateOne = function(req,res){
	if(!req.params.locationid){	//check locationid and params exist
		sendJsonResponse(res,404,{
			"message": "No locationid in request"
		});
		return;
	}
	Loc
		.findById(req.params.locationid)	//findById is mongoose model methods to query db. req.params give access to locationid
		.select('-reviews -rating')				//don't query reviews and rating path
		.exec(function(err, location){		//execute query
			if(!location){
				sendJsonResponse(res, 404, {				//send 404 message
					"message": "locationid not found"
				});
				return;															//exit function scope using return statement
			}
			location.name = req.body.name;
			if(req.body.address){
				location.address = req.body.address;
			}
			if(req.body.facilities){				//prevent 'split' of undefined error
				location.facilities = req.body.facilities.split(',');
		  }
		  if(req.body.coords){						//prevent Cast to Array failed error
		  	location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
		  }
		  console.log(location+" openingTimes: "+location.openingTimes);
		  location.openingTimes = [{
		  	days: req.body.days1,
		  	opening: req.body.opening1,
		  	closing: req.body.closing1,
		  	closed: req.body.closed1
		  },{
		  	days: req.body.days2,
		  	opening: req.body.opening2,
		  	closing: req.body.closing2,
		  	closed: req.body.closed2
		  }];
		  location.save(function(err,location){
		  	if(err){
		  		console.log(err);
		  		sendJsonResponse(res, 404, err);
		  	} else {
		  		sendJsonResponse(res,200,location);
		  	}
		  });
		});
};

module.exports.locationsDeleteOne = function(req,res){
	if(req.params && req.params.locationid){			
		Loc
			.findByIdAndRemove(req.params.locationid)		//http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
			.exec(function(err, location){
				if(err){
					sendJsonResponse(res, 404, err);
					return;
				}					
				sendJsonResponse(res,204,null);		//204 means successfully delete content
			});
	}
	else{
		sendJsonResponse(res,404,{
			"message": "No locationid in request"
		});
	}
};

var sendJsonResponse = function(res, status, content){
	res.status(status);		//send response status code
	res.json(content);		//send response JSON data
};

var theEarth = (function(){
	var earthRadius = 3959; //miles, km is 6371. define fixed value for radius of Earth

	var getDistanceFromRads = function(rads){	//convert radians to distance
		return parseFloat(rads * earthRadius);
	};

	var getRadsFromDistance = function(distance){	//convert distance to radius
		return parseFloat(distance/earthRadius);
	};

	return{																		//expose these 2 functions
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance
	}
})();