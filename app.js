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
	for (var i = 0; i < 1; i++) {
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
	//fouroneone = new connection('riverside-crime', '127.0.0.1', 27017),
	cron = function(job, duration){
		if( typeof job === "function" ){
			job(function(){
				setTimeout(function(){
					cron(job, duration); // start up process again
				}, duration)
			})
		}
	},
	update = function(set, index, length, fn){
		set.rid = set._id;
		delete set._id;
		db.read({rid:set.rid}, function(err, res){

			if(!res.length){
				console.log("store");
				db.create(set, function(){});
			}

			if(length === index + 1){
				fn();
				console.log("ready for next queue")
			}

		})
	},
	fetch = function(fn){
		request("http://www.riversideca.gov/data/dataset/json/27?max=100", function(err, response, body){
			if(err) fn();
			else{
				var data = JSON.parse(body);
				var length = data.length;
				console.log(length);
				for(var i = 0; i < length; i++){
					var set = data[i];
					update(set, i, length, fn);
				}
			}
		})
	};

	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.use(app.router);
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.static(path.join(__dirname, 'public')));
	})

	app.get("/archive", function(req, res){
		db.read({}, function(err, response){
			if(err) res.send("Error")
			else{
				res.json(response);
			}
		})
	})

	cron(fetch, 1200000);

	http.createServer(app).listen(app.get('port'), function(){
	  console.log("Server process " + process.pid + " listening on port " + app.get('port'));
	}) 
}


