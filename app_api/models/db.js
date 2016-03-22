//reference: http://mongoosejs.com/docs/index.html
var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/Loc8r';
console.log('NODE_ENV: '+process.env.NODE_ENV);	//debug
if(process.env.NODE_ENV === 'production'){
	//dbURI = process.env.MONGOLAB_URI;	//use URI env var in Heroku
}
mongoose.connect(dbURI);

var readLine = require('readline');

//Below will emit the SIGINT signal on Windows,
//allowing to capture it and gracefully close
//down anything else you need to before the
//process ends
console.log('This platform is ' + process.platform);	//debug
if (process.platform === 'win32') {
	var rl = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.on('SIGINT', function(){
		process.emit('SIGINT');
	});
}

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' +dbURI+' PID: '+process.pid);
	//monitoring for successful connection through Mongoose
});
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

//Close Mongoose connection, passing through
//an anonymous function to run when closed
//Define function to accept message and callback
//Output message and call back when Mongoose
//connection is closed
var gracefulShutdown = function (msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through '+msg+' PID: '+process.pid);
		callback();
	});
};

//Listen for SIGUSR2, which is what nodemon uses
//Send message to gracefulShutdown and callback
//to kill process, emitting(restart) SIGUSR2 again
//Use process.once as opposed to process.on, as we
//only want to listen for the SIGUSR2 event once.
//nodemon also listens for the same event and we
//don't want to capture it each time, preventing
//nodemon from working
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	})
});

//test 'SIGUSR2' to see how often it emits. Debug
process.on('SIGUSR2', function(){
	console.log('SIGUSR2 captured');
})

//Listen for SIGINT emitted on application termination
//send msg before exit Node process
process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});

//Listen for SIGTERM emitted when Heroku shuts down process
//send msg before exit Node process
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});

require('./locations');