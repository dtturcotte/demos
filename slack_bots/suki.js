var request = require('request');

module.exports = function (req, res, next) {
	var botPayload = {};
	botPayload.username = 'urban';
	botPayload.icon_url = 'http://i.imgur.com/BWyCcsA.png';
	botPayload.text = 'No result found...';
	botPayload.channel = req.body.channel_id;
	botPayload.user_id = req.body.user_id;

	/*
		req.query: query from URL or DHC
	 		localhost:3004/suki?text=csb

		req.body: text from cURL request or Slack
	 		curl -X POST --data "text=csb" http://localhost:3004/suki
	 */

	if (typeof req.body.text !== 'undefined') {

		getWordDefinition(req.body.text, function (error, status, body) {
			if (error) {
				return next(error);
			} else if (status !== 200) {
				return next(new Error('Incoming WebHook: ' + status + ' ' + body));
			} else {
				var w = JSON.parse(body);
				botPayload.text = req.body.user_name + ' wants to know what "' + req.body.text + '" means... : ' + w.list[0].definition;
				postToSlack(botPayload, function (error, status, body) {
					if (error) {
						return next(error);
					} else if (status !== 200) {
						postToSlack(botPayload, function (error, status, body) {
							return res.status(200);
						});
					} else {
						return res.status(200);
					}
				});
			}
		});
	}
};

function postToSlack (payload, callback) {
	request({
		headers: {
			'content-type': 'application/json'
		},
		uri: 'https://hooks.slack.com/services/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',
		body: JSON.stringify(payload),
		method: 'POST'
	}, function (error, response, body) {
		if (error) {
			return callback(error);
		}
		callback(null, response.statusCode, body);
	});
};

function getWordDefinition (text, callback) {
	request({
		uri: 'http://api.urbandictionary.com/v0/define?term='+text,
		method: 'GET'
	}, function (error, response, body) {
		if (error) {
			return callback(error);
		}
		callback(null, response.statusCode, body);
	});
};
