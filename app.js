'use strict';

const apiai = require('apiai');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const qsr= require('./qsr-apis.js');
const request= require('request');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const app = express();
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
var email= 'a.b@gmail.com';
var password= 'a.b@gmail.com';
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

	//console.log(access_token);
	//console.log(JSON.stringify(req.body));
	var data = req.body;
	var sessionId = req.body.sessionId;
	var actionName = req.body.result.action;
 	var parameters = req.body.result.parameters;
 	var message = req.body.result.resolvedQuery;
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
								qsr.getAuthTokenService(email, password, (error, result) => {
								if(error){
									console.log("Token cannot be generated");
								} else {
									access_token = result.token;
									refresh_token = result.refresh_token;
									}
								});
								}
												res.send(messageData);
		 					}
		 				break;

			case 'check_permission': {
							 console.log('In check_permission');
							 if(isDefined(actionName)){
								console.log("After entering check permission");
								//console.log(req.body.originalRequest.data.inputs[0].arguments[0].boolValue);
								if(req.body){
								//var uLat=req.body.originalRequest.data.device.location.coordinates.latitude;
								//var uLng=req.body.originalRequest.data.device.location.coordinates.longitude;
								//var uLat = 12.9666400;
								//var uLng = 77.7232870;
								var uLat = 41.8834;
								var uLng = -87.6537;

								qsr.nearestStoreService(uLat, uLng, (error, storeResult) =>{
									if(error){
										console.log(error);
									}else {
										
										storeId=storeResult.storeId;
										storeName=storeResult.storeName;
										//console.log(storeName+'-----------------'+storeId);
										qsr.calculateDistanceService(uLat, uLng, storeResult.sLat, storeResult.sLng, (error, durationResult) =>{
											if(error){
												console.log(error);
											}else {
												console.log(durationResult.duration);
												qsr.createCartService(access_token, email, (error,cartResult) =>{
												if(error){
													console.log(error);
												}else {
													cartId=cartResult.cartId;
													qsr.settingDeliveryModeService(access_token, cartId, email, (error,result)=> {
 						 							if(error){
 													console.log(error);
 													}else {
													console.log(result);
														}
													});	
													}
												});
												text= `Thank you for your permission ! I can place an order for you at the nearest ${storeResult.name} at ${storeResult.address}, which is a ${durationResult.duration} walk from your place. What would you like to order ?`;
												messageData = {
														speech: text,
														displayText: text
														}
													res.send(messageData);
											}
										});
									};
								});
								}else{
								text= 'I am sorry ! I cannot process your order without your permission';
								messageData = {
										speech: text,
										displayText: text
										}
								res.send(messageData);
								}
							}
				 		}
				 		break;
		 case 'productsOrderMac': {
					console.log('In action products order Mac');
					var productName = req.body.result.contexts[0].parameters.productName;
					if(isDefined(actionName)){
						console.log("Access Token  generated-  "+access_token+"for- "+productName);
						console.log(cartId);
								qsr.addProductsToCart(access_token, cartId, email, 5, storeName, (error,productResult)=> {
									if(error){
										console.log(error);
									}else {
										console.log('Mac added '+productResult);
										}
									});
								text= `Okay ! I have ordered you a ${productName}, would you also like to order fries?`;
										messageData = {
											speech: text,
											displayText: text
											}
										res.send(messageData);
							}else{
								text= 'I am sorry ! I cannot process your order.';
								messageData = {
										speech: text,
										displayText: text
										}
								res.send(messageData);
						   }
					}
					break;


 		 case 'productsOrderFries': {
 					console.log('In action products order Fries');
 					if(isDefined(actionName)){
 						console.log(cartId);
						qsr.addProductsToCart(access_token, cartId, email, 8932, storeName, (error,result)=> {
						 if(error){
							console.log(error);
							}else {
								console.log('Fries added');
									}
								   });
								text= `Okay, I've added a medium fries to your order. Anything else ?`;
								messageData = {
									speech: text,
									displayText: text
										}
								    res.send(messageData);
								}
							 }
 					     break;
			
		
		case 'productsOrderConfirmedCart': {
 					console.log('In action productsOrderConfirmedCart');
 					if(isDefined(actionName)){
 						qsr.fetchCartService (access_token, cartId, email, (error,result)=> {
						 if(error){
							console.log(error);
							}else {
								console.log(result.totalPrice);
								qsr.gettingSavedCardDetailsService(access_token, email, (error, cardResult)=>{
									if(error){
										console.log(error);
									}else {
									cardId= cardResult.cardId;
									qsr.addCardPaymentService(access_token, cartId, email, cardId, (error, paymentResult)=>{
									if(error){
										console.log(error);
									 }else {
										console.log('Payment details added with storeId: ',storeId);
									   }
									 });
									  var defCardNumber=cardResult.cardNumber;
									  text= `The total will be ${result.totalPrice}. Would you like to use your default card on file ending with ${defCardNumber.substr(12,4)}?`;
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
			
		case 'OrderConfirmed': {
 					console.log('In action OrderConfirmed');
 					if(isDefined(actionName)){
 					console.log(cartId+'   '+cardId);
					function myFunc(orderCode) {
						text= `Your order has been submitted. Your order code is ${orderCode}. Please provide this code when you get to the restaurant and they'll get your order started. I will also text it to you for reference. Thank you for your order!`
								 messageData = {
										speech: text,
										displayText: text
										}
								res.send(messageData);	
					}
					qsr.placeOrderService(access_token, cartId, email, storeId, (error, orderResult) =>{
						if(error){
							console.log(error);
							}else{
								console.log(orderResult.code);
								orderCode=orderResult.code;
								setTimeout(myFunc(orderCode), 500, "Order Placed");
								}
							    });					
						         }else{
							       text= 'I am sorry, I was not able to place an order for you.';
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
