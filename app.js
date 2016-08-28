var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 9000;
var path = require('path');
var globals = require('./config/globals');

// set the view engine to ejs
app.set('views', path.join(__dirname, globals.paths.views));
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

require('./config/routes/main')(app, globals, path);

// error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Dans Demos is listening on port ' + port);
});
