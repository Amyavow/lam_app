var enforceSSL = require("express-enforces-ssl"),
	helmet = require("helmet"),
	ms = require("ms"),
	express = require("express"),
	mongoose = require("mongoose"),
	path = require("path"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	flash = require("connect-flash"),
	routes = require("./routes.js"),
	passport = require("passport"),
	setUpPassport = require("./setuppassport.js"),
	app = express();

mongoose.connect("mongodb://localhost:27017/test"); //connect to mongodb server in the in the test database
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
	helmet.hsts({
		maxAge: ms("1 year"),
		includeSubdomains: true
	})
);

app.enable("trust proxy");
app.use(enforceSSL());

//body-parser middleware is used to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	session({
		secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
		resave: true,
		saveUninitialized: true
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(app.get("port"), function(err) {
	if (err) {
		return console.log(err);
	}
	console.log("App started on port " + app.get("port"));
});
