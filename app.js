var 
// locals
express = require("express"),
http = require("http"),
request = require("request"),
path = require("path"),
cluster = require("cluster"),
connection = require("mangos");

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < 2; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
		cluster.fork();
	});
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
	var
	app = express(),
	db = new connection('riverside-crime', '127.0.0.1', 27017),
	cron = function(job, duration){
		if( typeof job === "function" ){
			job(function(){
				setTimeout(function(){
					cron(job, duration); // start up process again
				}, duration)
			})
		}
	},
	fetch = function(){
		
	};

	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.use(app.router);
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.static(path.join(__dirname, 'public')));
	})

	http.createServer(app).listen(app.get('port'), function(){
	  console.log("Server process " + process.pid + " listening on port " + app.get('port'));
	}) 
}


