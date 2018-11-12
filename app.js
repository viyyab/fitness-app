'use strict';

const apiai = require('apiai');
const config = require('./config');
const express = require('express');
const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const sfcc= require('./sfcc-apis.js');
const jwtdecode = require('jwt-decode');
const {dialogflow, Permission} = require('actions-on-google');
const aiapp = dialogflow();
const app = express();
var recommendedName;
var access_token;
var refresh_token;
var text = '';
var cardId;
var cartId;
var storeName;
var storeId;
var address;
var orderCode;
var messageData = '';
var email; //= 'mickeyd.mcd321@gmail.com';
var password; //= 'mickeyd.mcd321@gmail.com';
var shortCode;
var totalItems;
var entries;
var xmlFile;
debugger;


if (!config.API_AI_CLIENT_ACCESS_TOKEN) {
	throw new Error('missing API_AI_CLIENT_ACCESS_TOKEN');
}
if (!config.SERVER_URL) { //used for ink to static files
	throw new Error('missing SERVER_URL');
}


app.set('port', (process.env.PORT || 4988))

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

	//console.log(access_token);
	console.log(JSON.stringify(req.body));
	var data = req.body;
	var sessionId = req.body.sessionId;
	var actionName = req.body.result.action;
 	var parameters = req.body.result.parameters;
 	var message = req.body.result.resolvedQuery;
	switch (actionName) {

			case 'input.welcome': {
		 				console.log('In user sign in');
		 					if(isDefined(actionName)){
								messageData = {
									"data": {
										"google": {
										"expectUserResponse": true,
										"systemIntent": {
										"intent": "actions.intent.SIGN_IN",
										"data": {}
										         }
										       }
										 }
									}
								res.send(messageData);
							     }
							}
		 				break;



			case 'check_sign_in': {

					if(isDefined(actionName)){
						var token=req.body.originalRequest.data.user.idToken;
						var decoded = jwtdecode(token);
						console.log(decoded);
						if(decoded.iss == 'https://accounts.google.com'){
						email=decoded.email;
						password=email.charAt[0].toUpperCase();
						console.log(email+'   '+password)
						}
						sfcc.getAuthTokenService(email, password, (error, result)=> {
							if(error){
								console.log(error);
							} else {
								console.log(result.token+' '+result.customer_id+" "+result.email);
							
							}
						});
// 								messageData = {

// 										}

// 			 					}
// 							res.send(messageData);
					}
						}
		 				break;


		case 'check_permission': {
							 console.log('In check_permission');
							 if(isDefined(actionName)){
									text= 'I am sorry ! I cannot process your order without your permission';
								messageData = {
										speech: text,
										displayText: text
										}
								res.send(messageData);
								}
				 		}
				 		break;

		 case 'productsOrderMac': {
					if(isDefined(actionName)){

						function myNextFunc() {
							text= 'Would you like to order anything else ?';
							messageData = {
									speech: text,
									displayText: text
									}
							res.send(messageData);
		   				}
						}
					}
					break;

		case 'ordermoreProductsFollowUp': {

 					if(isDefined(actionName)){
 						text= `What else would you like to have ?`;
								messageData = {
									speech: text,
									displayText: text
										}
								    res.send(messageData);
								}
							 }
 					     break;


 		 case 'productsOrderFries': {
			 if(isDefined(actionName)){
				 text= `What else would you like to have ?`;
						 messageData = {
							 speech: text,
							 displayText: text
								 }
								 res.send(messageData);
						 		}
							 }
 					     break;


		case 'productsOrderConfirmedCart': {
			if(isDefined(actionName)){
				text= `What else would you like to have ?`;
						messageData = {
							speech: text,
							displayText: text
								}
								res.send(messageData);
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
