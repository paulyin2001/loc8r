//This file is used to deinfe Mongoose schema
var mongoose = require( 'mongoose' );

//needs to be in the same file as locationSchema
//and must be before locationSchema
var openingTimeSchema = new mongoose.Schema({
	days: {type: String, required: true},
	opening: String,
	closing: String,
	closed: {type: Boolean, required: true}
});

//use 'anonymouse' as default
var reviewSchema = new mongoose.Schema({
	author: {type: String, required: true},
	rating: {type: Number, "default": 0, min: 0, max: 5, required: true},
	createdOn: {type: Date, "default": Date.now},
	reviewText: {type: String, required: true}
});

var locationSchema = new mongoose.Schema({	//constructor func for new schema
	name: {type: String, required: true},		//validation thru required tag
	address: String,
	rating: {type: Number, "default": 0, min: 0, max: 5},		
	//the default doesn't have to be in quotes, but it is a reserved word in JS
	//validation with min and max
	facilities: [String],	//string array
	coords: {type: [Number], index: '2dsphere'},
	//add GeoJSON path. 2dsphere enables MongoDB to do correct calculations
	//when running queries and return results. It allows MongoDB to calculate geometries
	//based on a spherical object.
	//Coordinate pair must be entered in order: longitude then latitude
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});

//build a model of our location schema. Compile the schema into model
mongoose.model('Location', locationSchema);