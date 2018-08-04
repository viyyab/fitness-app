const request= require('request');


// var getAuthTokenService = (callback) =>{
//
//   var username= 'gwengraman@gmail.com';
//   var password= 'Gwen@123';
//   console.log('Auth token API hit');
//   request({
//     url: 'https://localhost:9002/authorizationserver/oauth/token' ,
//     form: {
//     username: username,
//     password: password
//     },
//     method: 'POST',
//     headers: {
//         "content-type": "application/x-www-form-urlencoded"
//       },
//     json: true
//   }, (error, response, body) => {
//
//     if(error){
//       callback('There was an error connecting to the server');
//     }
//     else if(response.statusCode == 400){
//       callback('Unable to get the token');
//     }
//     else if(response.statusCode == 200){
//       console.log('API hit:', response.statusCode)
//
//       callback(undefined, {
//         token: body.access_token,
//         refresh_token: body.refresh_token,
//         });
//       }
//   });
// };

var nearestStoreService = (ulat, ulng, callback) =>{
  console.log(ulat);
  console.log(ulng);
  console.log('Nearest store API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/fasteststores?latitude=${ulat}&longitude=${ulng}&radius=8000`,
    method: 'GET',
    headers: {
         "content-type": "application/x-www-form-urlencoded",
      },
    //json: true
    }, (error, response, body) => {
      console.log(body);
    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to get the result');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      callback(undefined, {
        address: body.pointOfServices[0].address.line1,
        storeId : body.pointOfServices[0].address.id,
        name: body.pointOfServices[0].displayName,
        distance : body.pointOfServices[0].formattedDistance,
        sLat : body.pointOfServices[0].geoPoint.latitude,
        sLng : body.pointOfServices[0].geoPoint.longitude
        });
      }
  });

};


var calculateDistanceService = (uLat, uLng, sLat, sLng, callback) => {

  console.log('Calculate distance API hit');
  request({
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${uLat},${uLng}&destinations=${sLat},${sLng}&departure_time=now&mode=walking`,
    method: 'GET',
    //json: true
  }, (error, response, body) => {
    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 200){
      callback(undefined, {
          duration : body.rows[0].elements[0].duration.text
        });
    }
    else {
      callback('Unable to get the distance');
      }
  });

};

var createBasketService = (authToken, email,callback) => {

  console.log('Create basket API hit');
  request({
    url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets',
    body: {
      "customer_info": {
          "email" : email
      }
    },
    method: 'POST',
    headers: {
        "content-type": "application/json",
        "authorization": authToken
      },
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to create the basket');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)

      callback(undefined, {
        basketId: response.basket_id
        });
      }
    else if(response.statusCode == 400){
      console.log('API hit:', response.statusCode)

      callback(undefined, {
        basketId: response.fault.arguments.basketIds
        });
      }
  });

};

var createOrderService = (authToken, basketId, callback) => {

  console.log('Create order API hit');
  request({
    url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/orders',
    body: {
        "basket_id" : basketId
    },
    method: 'POST',
    headers: {
        "content-type": "application/json",
        "authorization": authToken
      },
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to create order for the basket');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      callback(undefined, {
        instrumentId: response.payment_instruments[0].payment_instrument_id,
        orderNumber: response.order_no
        });
      }
  });

};

var addItemService = (authToken, basketId, proteinDrinkId, specialDrinkId, trainerId, callback) => {

    console.log('Add items API hit');
    request({
      url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/'+ basketId + '/items',
      body: [
   {
      "product_id":trainerId,
      "quantity":1.00
   },
   {
      "product_id":specialDrinkId,
      "quantity":1.00
   },
   {
      "product_id":proteinDrinkId,
      "quantity":1.00
   }
 ],
      method: 'POST',
      headers: {
          "content-type": "application/json",
          "authorization": authToken
        },
      json: true
    }, (error, response, body) => {

      if(error){
        callback('There was an error connecting to the server');
      }
      else if(response.statusCode == 401){
        callback('Unable to add items to the basket');
      }
      else if(response.statusCode == 200){
        console.log("API hit:", response.statusCode);
        callback('API hit and items added to the basketId:', basketId);
        }
    });
};

var gettingAddressIdService = (authToken, customerId, callback) => {
  console.log('Get address Id API hit');
  request({
    url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/customers/'+ customerId + '/addresses',
    method: 'GET',
    headers: {
        "content-type": "application/json",
        "authorization": authToken
      },
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to get the address Id');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      callback(undefined, {
        addressId: response.data[0].address_id
        });
      }
  });

};

var settingAddressIdService = (authToken, basketId, addressId) => {

  console.log('Setting address API hit');
  request({
    url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/' + basketId + '/shipments/me/shipping_address?use_as_billing=true&customer_address_id=' + addressId,
    body: {},
    method: 'PUT',
    headers: {
        "content-type": "application/json",
        "authorization": authToken
      },
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to set address Id for the basket');
    }
    else if(response.statusCode == 200){
      console.log("API hit:", response.statusCode);
      callback('API hit and address Id set to the basketId:', basketId);
      }
  });

};

var settingShippingService = (authToken, basketId, callback) => {

    console.log('Setting shipping_method API hit');
    request({
      url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/'+ basketId + '/shipments/me/shipping_method',
      body: {
        "id": "storepickup"
      },
      method: 'PUT',
      headers: {
          "content-type": "application/json",
          "authorization": authToken
        },
      json: true
    }, (error, response, body) => {

      if(error){
        callback('There was an error connecting to the server');
      }
      else if(response.statusCode == 401){
        callback('Unable to set shipping_method for the basket');
      }
      else if(response.statusCode == 200){
        console.log("API hit:", response.statusCode);
        callback(undefined, {
          total: response.order_total
          });
        }
    });
};

var addPaymentService = (authToken, basketId, total, callback) => {

      console.log('Adding payment API hit');
      request({
        url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/'+ basketId +'/payment_instruments',
        body: {
            "amount" : total,
            "payment_card" : {
                     "number":"411111111111111",
                     "security_code":"121",
                     "holder":"John Doe",
                     "card_type":"Visa",
                     "expiration_month":1,
                     "expiration_year":2021
                    },
            "payment_method_id" : "CREDIT_CARD"
          },
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "authorization": authToken
          },
        json: true
      }, (error, response, body) => {

        if(error){
          callback('There was an error connecting to the server');
        }
        else if(response.statusCode == 401){
          callback('Unable to add payment_method for the basket');
        }
        else if(response.statusCode == 200){
          console.log("API hit:", response.statusCode);
          callback('API hit and payment Id set to the basketId:', basketId);
          }
      });
};

var updatingPaymentService = (authToken, instrumentId, total, orderNumber, callback) => {

        console.log('Updating payment API hit');
        request({
          url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/orders/' + orderNumber	+ '/payment_instruments/' + instrumentId,
          body: {
              "amount" : total,
              "payment_card" : {
                  "card_type":"Visa"
                  },
              "payment_method_id" : "CREDIT_CARD"
            },
          method: 'PATCH',
          headers: {
              "content-type": "application/json",
              "authorization": authToken
            },
          json: true
        }, (error, response, body) => {

          if(error){
            callback('There was an error connecting to the server');
          }
          else if(response.statusCode == 401){
            callback('Unable to update payment_method for the basket');
          }
          else if(response.statusCode == 200){
            console.log("API hit:", response.statusCode);
            callback('API hit and updating payment Id done');
            }
        });
};


module.exports = {
    //getAuthTokenService,
    nearestStoreService,
    calculateDistanceService,
    createBasketService,
    createOrderService,
    addItemService,
    gettingAddressIdService,
    settingAddressIdService,
    settingShippingService,
    addPaymentService,
    updatingPaymentService,
};
