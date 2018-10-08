'use strict';

const apiai = require('apiai');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const qsr= require('./qsr-apis.js');
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
var email= 'mickeyd.mcd321@gmail.com';
var password= 'mickeyd.mcd321@gmail.com';
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
	console.log(JSON.stringify(req.body));
	var data = req.body;
	var sessionId = req.body.sessionId;
	var actionName = req.body.result.action;
 	var parameters = req.body.result.parameters;
 	var message = req.body.result.resolvedQuery;
	switch (actionName) {

// 			case 'require_sign_in': {
// 		 					console.log('In require_permission');
// 		 					if(isDefined(actionName)){
// 								console.log('Coversation');
// 								messageData = {
// 									"data": {
// 										"google": {
// 												 "conversationToken": "{\"state\":null,\"data\":{}}",
//   												  "expectUserResponse": true,
//   													"expectedInputs": [
//     														{
// 														 "inputPrompt": {
// 														"initialPrompts": [
// 														  {
// 														    "textToSpeech": "PLACEHOLDER_FOR_SIGN_IN"
// 														  }
// 														],
// 														"noInputPrompts": []
// 													      },
// 													      "possibleIntents": [
// 														{
// 														  "intent": "actions.intent.SIGN_IN",
// 														  "inputValueData": {}
// 														}
// 													      ]
// 													    }
// 													  ]

// 											    }
// 										 	}
// 							 	   		    }
// 										}
// 								res.send(messageData);
// 							}
// 		 				break;


// 			case 'check_sign_in': {
// 		 				console.log('In check_sign_in');
// 		 					if(isDefined(actionName)){
// 								if(req.body){
// 								messageData = {
// 									"data": {
// 										"google": {
// 											"expectUserResponse": true,
// 											"systemIntent": {
// 													"intent": "actions.intent.PERMISSION",
// 													"data": {
// 														"@type": "type.googleapis.com/google.actions.v2.PermissionValueSpec",
// 														"optContext": "To process your order, ",
// 														"permissions": ["DEVICE_PRECISE_LOCATION"]
// 														}
// 													}
// 											    }
// 										 }
// 							 	   		}
// 								qsr.getAuthTokenService(email, password, (error, result) => {
// 									if(error){
// 										console.log("Token cannot be generated");
// 									} else {
// 										access_token = result.token;
// 										refresh_token = result.refresh_token;
// 									}
// 								});
// 							    }
// 							}
// 							res.send(messageData);
// 						}
// 		 				break;


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
											  "permissions": [
											    "DEVICE_COARSE_LOCATION",
											    "DEVICE_PRECISE_LOCATION"
											  ]
											}
										      }
										    }
										  }
										 }
// 								aiapp.intent('order-restaurant', (conv) => {
// 									  // If the request comes from a phone, we can't use coarse location.
// 									  conv.data.requestedPermission =
// 									    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')
// 									    ? 'DEVICE_PRECISE_LOCATION'
// 									    : 'DEVICE_COARSE_LOCATION';
// 									  if (!conv.user.storage.location) {
// 									    return conv.ask(new Permission({
// 									      context:  "To process your order, ",
// 									      permissions: conv.data.requestedPermission,
// 									    }));
// 									  }
// 									});

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
// 								 aiapp.intent('actions.intent.PERMISSION', (conv, params, permissionGranted) => {
//                                                                           if (!permissionGranted) {
//                                                                             throw new Error('Permission not granted');
//                                                                           }

//                                                                           const {requestedPermission} = conv.data;
//                                                                           if (requestedPermission === 'DEVICE_COARSE_LOCATION') {
//                                                                             // If we requested coarse location, it means that we're on a speaker device.
//                                                                             var formattedAddress = conv.device.location.formattedAddress;
//                                                                             }

//                                                                           if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
//                                                                             // If we requested precise location, it means that we're on a phone.
//                                                                             // Because we will get only latitude and longitude, we need to
//                                                                             // reverse geocode to get the city.
//                                                                             const {coordinates} = conv.device.location;
//                                                                           }
//                                                                           throw new Error('Unrecognized permission');
//                                                                         });
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
						function myNewFunc(productName, recommendedName) {
							text= `Okay ! I have ordered you a ${productName}, would you also like to order ${recommendedName}?`;
										messageData = {
											speech: text,
											displayText: text
											}
										res.send(messageData);
						};
						qsr.getRecommendedProductService(productName, (error, result) => {
							if(error){
								console.log(error);
							} else {
								console.log(result.name + "   " +recommendedName)
								recommendedName=result.name;
								setTimeout(() => myNewFunc(productName, recommendedName), 4000)
							qsr.getProductCodeByNameService(productName, (error, prodResult) =>{
							if(error){
								console.log(error);
							}else {
								console.log('code for product ',prodResult.productCode);
								qsr.addProductsToCart(access_token, cartId, email, prodResult.productCode, storeName, (error,productResult)=> {
									if(error){
										console.log(error);
									}else {
										console.log('Mac added '+productResult);
												}
										});
									}
								});
							}
						});

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
						qsr.getProductCodeByNameService(recommendedName, (error, prodResult) => {
							if(error){
 							console.log(error);
 							}else {
								console.log('code for product ',prodResult.productCode);
 								qsr.addProductsToCart(access_token, cartId, email, prodResult.productCode, storeName, (error,result)=> {
								 if(error){
									console.log(error);
									}else {
										console.log('Fries added');
											}
										   });
 									}
						});

								text= `Okay, I've added a ${recommendedName} to your order. Anything else ?`;
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
									 	 text= `The total will be ${result.totalPrice} $. Would you like to use your default card on file ending with ${defCardNumber.substr(12,4)}?`;
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
							text= `Your order has been submitted. Your order code is ${orderCode.substr(4,4)}. Please provide this code when you get to the restaurant and they'll get your order started. I will also text it to you for reference. Thank you for your order!`
								 messageData = {
										speech: text,
										displayText: text
										}
								res.send(messageData);
						};
						qsr.placeOrderService(access_token, cartId, email, storeId, (error, orderResult) =>{
							if(error){
								console.log(error);
							}else{
								console.log(orderResult.code);
								orderCode=orderResult.code;
								setTimeout(() => myFunc(orderCode), 4000)
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
