//First run the following command to install all required dependencies
//'npm i body-parser cookie-parser express express-session passport passport-local ejs passport-http'
//or run 'npm install'

//Require Node Modules
var express = require('express'),
		bodyParser = require('body-parser'),
		cookieParser = require('cookie-parser'),
		expressSession = require('express-session'),
		passport = require('passport'),
		passportLocal = require('passport-local');

//Set app as the Express
var app = express();

//Set view engine to EJS
app.set('view engine', 'ejs');

//Initiate the middleware - Body Parser, Cookie Parser, Express Session
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'huawei2016',
	resave: false,
	saveUninitialized: false }));

//Initialize Passport to handle authentication
app.use(passport.initialize());
app.use(passport.session());

//Use passport local strategy and check is username and password are correct
passport.use(new passportLocal.Strategy(function(username, password, done) {
	//Replace the following username, password check method with database query
	if (username == 'admin' && password == 'admin') {
		done(null, { id:1, name: username });
	} else {
		done(null, null);
	}
}));

//Serialize user infomartion
passport.serializeUser(function(user, done) {
	done(null, user.name);
});

//Deserialize user infomartion
passport.deserializeUser(function(user, done){
	//Query actual database here
	done(null, { id:1, name: user });
})

//isAuthenticated() is a function from passport to check if user is authenticated or not.
app.get('/', function(req, res){
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

//Get login.ejs
app.get('/login', function(req, res){
	res.render('login');
});

//Post the credential; if success, create and pass a token back in response, deserialize it for user so user don't need to re-authenticated. Tell passport to use 'local' authentication strategy.
app.post('/login', passport.authenticate('local'), function(req, res){
	res.redirect('/');
});

//Logout, destroy session using Passport logout method, not Express
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

//Set port number
var port = process.env.PORT || 9997;

//Start the server
app.listen(port, function() {
	console.log('Server started at port:', port);
})