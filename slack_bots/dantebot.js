var request = require('request');

module.exports = function (req, res, next) {
	var botPayload = {};
	botPayload.username = 'nedry';
	botPayload.icon_url = 'http://i.imgur.com/AwFZGEa.png';
	botPayload.text = 'AH AH AH, YOU DIDN\'T SAY THE MAGIC WORD!';
	botPayload.channel = req.body.channel_id;

	//return res.status(200).send('dante is losssaded');

	if (typeof req.body.text !== 'undefined') {
		botPayload.userToGet = req.body.text.split('^')[0];

		getUserData(botPayload, function (error, status, body) {

			if (error) {
				return next(error);
			} else if (status !== 200) {
				return next(new Error('Incoming WebHook: ' + status + ' ' + body));
			} else {
				var userDataArray = JSON.parse(body),
					profileFound = false;
				for (var i = 0; i < userDataArray.members.length; i++) {
					if (!profileFound) {
						if (userDataArray.members[i].name === botPayload.userToGet) {
							botPayload.username = userDataArray.members[i].name;
							botPayload.icon_url = userDataArray.members[i].profile.image_48;
							botPayload.text = req.body.text.substring(req.body.text.lastIndexOf('^') + 1, req.body.text.length);
							profileFound = true;
						}
					}
				}
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

function getUserData (payload, callback) {
	request({
		uri: 'https://slack.com/api/users.list?token=xoxp-2697721554-7445793969-19098479429-9e38e4b0b1&pretty=1',
		method: 'GET',
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if (error) {
			return callback(error);
		}
		callback(null, response.statusCode, body);
	});
};
