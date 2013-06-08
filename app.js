var 
// locals
express = require("express"),
http = require("http"),
request = require("request"),
path = require("path"),
app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(app.router);
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
})

app.configure('development', function(){
  app.use(express.errorHandler());
})

app.get('/', function(req,res){
 res.sendfile(__dirname + '/public/index.html');
})

app.get("/latest", function(req, res){
	request("http://www.riversideca.gov/data/dataset/json/27", function(err, response, body){
		res.json(JSON.parse(body));
	})
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
})


