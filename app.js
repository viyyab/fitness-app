'use strict';

const apiai = require('apiai');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
//const { dialogflow } = require('actions-on-google');
const qsr= require('./qsr-apis.js');
const request= require('request');
const app = express();
debugger;

if (!config.API_AI_CLIENT_ACCESS_TOKEN) {
	throw new Error('missing API_AI_CLIENT_ACCESS_TOKEN');
}
if (!config.SERVER_URL) { //used for ink to static files
	throw new Error('missing SERVER_URL');
}


app.set('port', (process.env.PORT || 4984))

//serve static files in the public directory
app.use(express.static('public'));

// Process application/json
app.use(bodyParser.json());

const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
	language: "en",
});

const sessionIds = new Map();

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

app.post('/webhook/', (req, res) => {
	var data = req.body;
	var sessionId = req.body.sessionId;
	var actionName = req.body.result.action;
 	var parameters = req.body.result.parameters;
 	var message = req.body.result.resolvedQuery;
  var displayText = '';
	var text = '';
	var address = '';
	var messageData = '';
	switch (actionName) {

			case 'require_permission': {
		 					console.log('In require_permission');
		 					if(isDefined(actionName)){
							console.log('Coversation');
							messageData = {
									"data": {
										"google": {
											"expectUserResponse": true,
											"systemIntent": {
													"intent": "actions.intent.PERMISSION",
													"data": {
															"@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
															"optContext": "To process your order, ",
															"permissions": ["DEVICE_PRECISE_LOCATION"]
																	}
																}
															}
														}
													}
												}
												res.send(messageData);
		 								}
		 							break;

			case 'check_permission': {
							 console.log('In check_permission');
							 if(isDefined(actionName)){
								//console.log("After entering check permission", JSON.stringify(req.body));
								//console.log(req.body.originalRequest.data.inputs[0].arguments[0].boolValue);
								if(req.body.originalRequest.data.inputs[0].arguments[0].boolValue){
								var ulat=req.body.originalRequest.data.device.location.coordinates.latitude;
								var ulng=req.body.originalRequest.data.device.location.coordinates.longitude;
								qsr.nearestStoreService(ulat, ulng, (error, storeResult) =>{
									if(error){
										console.log(error);
									}else {
										console.log(storeResult);
										qsr.calculateDistanceService(ulat, ulng, storeResult.uLat, storeResult.uLng, (error, durationResult) =>{
											if(error){
												console.log(error);
											}else {
												console.log(duationResult.duration);
											}
										});
									};
								});
								}else{
								text= 'I am sorry ! I cannot process your order without your permission';
								}
								messageData = {
										speech: text,
										displayText: text
										}
							}
						res.send(messageData);
				 		}
				 		break;


		 case 'pincode.request': {
					console.log('In action pincode');
					var displayText = '';
					if(isDefined(actionName) && parameters !== ''){
						var text = '';
						var pincode = parameters.any;
						app1.requestCoordinate(pincode,(error, results) => {
							if(error){
								text = 'Error fetching the data';
							}else {
								text = `Latitude: ${results.latitude}  Longitude: ${results.longitude}`;
								messageData = {
										speech: text,
										displayText: text
										}

							}
							console.log(messageData);
							//res.sendStatus(200);
							res.send(messageData);
						});
					}
				}
				break;

		default:
			//unhandled action, just send back the text
			break;
	}
});


function isDefined(obj) {
	if (typeof obj == 'undefined') {
		return false;
	}

	if (!obj) {
		return false;
	}

	return obj != null;
}

// Spin up the server
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})
