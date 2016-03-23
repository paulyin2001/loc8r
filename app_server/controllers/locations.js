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
			maxDistance: 1000
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
	res.render('location-info', {
		title: 'Starcups',
		pageHeader:{
			title: 'Starcups'
		},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location: {
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			coords:{
				lat: 41.318386,
				lng: -81.779041
			},
			openingTime:[{
				days: 'Monday -Friday',
				opening: '7:00am',
				closing: '7:00pm',
				closed: false
			},{
				days: 'Saturday',
				opening: '8:00am',
				closing: '5:00pm',
				closed: false
			},{
				days: 'Sunday',
				closed: true
			}],
			reviews: [{
				author: 'Connie Wang',
				rating: 5,
				timestamp: '23 July 2015',
				reviewText: 'What a great place. I can\'t say enough good things about it.'
			},{
				author: 'Paul Yin',
				rating: 3,
				timestamp: '20 June 2015',
				reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
			}]
		}
	});
};
/* Get 'Add review' page */
module.exports.addReview = function(req,res){
	res.render('location-review-form', {
		title: 'Review Starcups on Loc8r',
		pageHeader: {
			title: 'Review Starcups'
		}
	});
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
