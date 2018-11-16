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
var token;
var text = '';
var cardId;
var basketId;
var customer_id;
var emailId;
var address;
var orderCode;
var messageData = '';
var email; //= 'mickeyd.mcd321@gmail.com';
var password; //= 'mickeyd.mcd321@gmail.com';
var customer_id;
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

			case 'check_sign_in': {
		 				console.log('In check_sign_in');
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



			case 'shoes-in-stock': {
					console.log("In shoes-in-stock");
					if(isDefined(actionName)){
						var token=req.body.originalRequest.data.user.idToken;
						var decoded = jwtdecode(token);
						//console.log(decoded);
						if(decoded.iss == 'https://accounts.google.com'){
						email=decoded.email;
						password=decoded.email;
						console.log(email+'   '+password)
						}
						var passwordTest=password.charAt(0).toUpperCase() + password.slice(1);
						console.log(passwordTest);
						sfcc.getAuthTokenService(email, passwordTest, (error, result)=> {
							if(error){
								console.log(error);
							} else {
								customer_id=result.customer_id
								token=result.token
								emailId=result.email
								sfcc.createCartService(result.token, (error, cartResult)=> {
									if(error){
										console.log(error);
									} else {
										basketId=cartResult.basketId;
										//console.log(result.token+' '+result.customer_id+" "+result.email);
										text="Yes, there is currently a promotion - they are at 200 swiss francs until the end of the month and are available at your usual Cap Sports Style store. Same color as current one";
										messageData = {
												speech: text,
												displayText: text
												}
										res.send(messageData);		
								 	      }
									});
							     	}
						   	});
 						}
					}
		 			break;


		 case 'shoes-in-stock-order': {
					console.log('In shoes-in-stock-order');
			 		console.log(basketId+ "  "+ token);
			 		if(isDefined(actionName)){
			 		var productName = req.body.result.contexts[0].parameters.sportsProducts
					if(productName == 'Gloves') {
						var product_id='TG250';
					} else if(productName == 'Jackets'){
						var product_id='11736753';
					}
					sfcc.addProductsToCart(token, product_id, basketId, (error, result)=> {
							if(error){
								console.log(error);
							} else {
								customer_id=result.customer_id
								token=result.token
								emailId=result.email
								sfcc.createCartService(result.token, (error, cartResult)=> {
									if(error){
										console.log(error);
									} else {
										basketId=cartResult.basketId;
										//console.log(result.token+' '+result.customer_id+" "+result.email);
										text="Yes, there is currently a promotion - they are at 200 swiss francs until the end of the month and are available at your usual Cap Sports Style store. Same color as current one";
										messageData = {
												speech: text,
												displayText: text
												}
										res.send(messageData);		
								 	      }
									});
							     	}
						   	});
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
