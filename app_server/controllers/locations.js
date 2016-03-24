var request = require('request');
var apiOptions = {		//API call with request must have fully qualified URL
	server: 'http://localhost:3000'
};										//switch URL depends on environment
if(process.env.NODE_ENV === 'production'){
	apiOptions.server = "https://learnmean.herokuapp.com"
}

/* GET 'home' page */
module.exports.homelist = function(req,res){

	var requestOptions, path;
	path = '/api/locations';		// set path for API request
	requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {},
		qs: {
			lng: -0.9690885,
			lat: 51.455040,
			maxDistance: 10000
		}
	};
	request(												//use request(options,callback) to custom HTTP headers https://github.com/request/request#custom-http-headers
		requestOptions,
		function(err,response,body){
			var i, data;
			data = body;
			if(!err && response.statusCode == 200 && data.length){		//only run loop if API return 200, there is some data
				for(i=0; i<data.length; i++){						//loop through each location and parse distance from something like 14.xxxxxxxxxx to 14.x miles
					data[i].distance = _formatDistance(data[i].distance);
				}
			}
			renderHomepage(res,body);		//use rendering function with requested body
		}
	);

};
/* Get 'Location info' page */
module.exports.locationInfo = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderDetailPage(req,res,responseData);
	});
};
/* Get 'Add review' page */
module.exports.addReview = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderReviewForm(req,res,responseData);
	});
};

module.exports.doAddReview = function(req,res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	var postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};
	path = '/api/locations/' + locationid + '/reviews';		// set path for API request
	requestOptions = {
		url: apiOptions.server + path,
		method: "POST",
		json: postdata
	};
	request(
		requestOptions,
		function(err,response,body){
			console.log('doAddReview');
			console.log('postdata:' + JSON.stringify(postdata));
			console.log('statusCode: '+response.statusCode);
			if(!err && response.statusCode === 201){
				res.redirect('/location/' + locationid);
			} else if (response.statusCode === 400 && body.name && body.name === "ValidationError"){
				res.redirect('/location/'+locationid+'/reviews/new?err=val');		//passing an error flag in query string
			} else {
				_showError(req,res,response.statusCode);
				console.log(response.message);
			}
		}
	);
};

var renderHomepage = function(res, responseBody){	
	var message;
	console.log('responseBody:');
	console.log(responseBody);
	console.log(!(responseBody instanceof Array));
	console.log(responseBody.length);
	if(!(responseBody instanceof Array)){		//if response isn't array, set message and responseBody
		message = 'API lookup error';
		responseBody = [];									//view is expecting an array. prevent view from throwing error
	} else {
		if(!responseBody.length){						//if response is array with no length
			message = "No places found nearby";
		}
	}
	res.render('locations-list',{
		title: 'Loc8r - find place to work with wifi',
		pageHeader:{
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find "+
		"places to work when out and about. Perhaps with coffee, cake "+
		"or a pint? Let Loc8r help you find the place you're looking for.",
		locations: responseBody,
		message: message										//add message to send to view
	});
};

var _formatDistance = function(distance){
	var numDistance, unit;
	numDistance = parseFloat(distance).toFixed(1);
	unit = ' miles';
	return numDistance + unit;
};

var renderDetailPage = function(req, res, locDetail){
	res.render('location-info',{
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar:{
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location: locDetail
	});
};

var _showError = function(req,res, status){
	var title, content;
	if(status === 404){
		title = "404, page not found";
		content = "We can't find this page. Sorry";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone a little bit wonrg.";
	}
	res.status(status);
	res.render('generic-text', {
		title: title,
		content: content
	});
};

var renderReviewForm = function(req,res, locDetail){
	res.render('location-review-form', {
		title: 'Review '+locDetail.name + ' on Loc8r',
		pageHeader: { title: 'Review '+locDetail.name},
		error: req.query.err 	//send new error variable to view, passing it query parameter when it exists
		//query object is always part of req. No need to check whether is exists
	});
}; 

var getLocationInfo = function(req,res,callback){
	var requestOptions, path;
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	};

	request(
		requestOptions,
		function(err,response,body){
			var data = body;
			if(response.statusCode === 200){
				data.coords = {					//reset coords property to be an object, setting lng and lat using values pulled from API response
					lng: body.coords[0],
					lat: body.coords[1]
				};
				callback(req, res, data);
			} else {
				_showError(req,res, response.statusCode);
			}
		}
	);
};

