var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 4000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

app.get('/', function (req, res) {
	res.status(200).sendFile('/index.html');
});

// error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(400).send(err.message);
});

app.listen(port, function () {
	console.log('Dans Demos is listening on port ' + port);
});
