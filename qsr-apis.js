const request= require('request');


var getAuthTokenService = (callback) =>{

//   var username= 'gwengraman@gmail.com';
//   var password= 'Gwen@123';
  var username= 'a.b@gmail.com';
  var password= 'a.b@gmail.com';
  console.log('Auth token API hit');
  request({
    url: 'https://34.195.45.172:9002/authorizationserver/oauth/token' ,
    form: {
    client_id:'webshop_client',
    client_secret: 'secret',
    grant_type: 'client_credentials',
    username: username,
    password: password
    },
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 400){
      callback('Unable to get the token');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)

      callback(undefined, {
        token: body.access_token,
        refresh_token: body.refresh_token,
        });
      }
  });
};

var nearestStoreService = (ulat, ulng, callback) =>{
  console.log(ulat);
  console.log(ulng);
  console.log('Nearest store API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/fasteststores?latitude=${ulat}&longitude=${ulng}&radius=8000`,
    method: 'GET',
    rejectUnauthorized: false,
    headers: {
         "content-type": "application/x-www-form-urlencoded"
      },
    json: true
    }, (error, response, body) => {
    if(error){
      callback('There was an error connecting to the nearest store server');
    }
    else if(response.statusCode == 401){
      callback('Unable to get the result');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode);
      callback (undefined, {
        address: body.pointOfServices[0].address.line2,
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
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${uLat},${uLng}&destinations=${sLat},${sLng}&departure_time=now&mode=walking&key=AIzaSyApMGv2qbCLA5Fk9XX4UmiKT7QkhkRcOV4`,
    method: 'GET',
    rejectUnauthorized: false,
    json: true
  }, (error, response, body) => {
    if(error){
      callback('There was an error connecting to the duration server');
    }
    else if(response.statusCode == 200){
      console.log(body);
      callback(undefined, {
         duration : body.rows[0].elements[0].duration.text
        //duration : body.rows[0]
        });
    }
    else {
      callback('Unable to get the distance');
      }
  });

};

var createCartService = (authToken, email,callback) => {

  console.log('Create cart API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/carts`,
    method: 'POST',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
      },
    rejectUnauthorized: false,
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 400){
      callback('Unable to create the cart');
    }
    else if(response.statusCode == 201){
      console.log('API hit:', response.statusCode)

      callback(undefined, {
        cartId: body.code
        });
      }
    });

};

var addProductsToCart = (authToken, cartId, email, productCode, storeName, callback) => {

  console.log('Add products API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/carts/${cartId}/entries`,
    form: {
        'code' : productCode,
        'qty': 1,
        'pickupStore': storeName
    },
    method: 'POST',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
      },
    rejectUnauthorized: false,
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401){
      callback('Unable to add products');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      callback(undefined, {
        //instrumentId: response.payment_instruments[0].payment_instrument_id,
       // orderNumber: body.order_no
        });
      }
  });

};


var fetchCartService = (authToken, cartId, email, callback) => {
  console.log('View cart API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/carts/${cartId}`,
    method: 'GET',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
      },
    rejectUnauthorized: false,
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401 || response.statusCode == 400 ){
      callback('Unable to fetch cart');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      callback(undefined, {
        totalItems: body.totalItems ,
        totalPrice: body.totalPriceWithTax.value
        });
      }
  });

};

var settingDeliveryModeService = (authToken, cartId, email, callback) => {

  console.log('Setting delivery mode API hit');
  request({
    url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/carts/${cartId}/deliverymode?deliveryModeId=pickup`,
    method: 'PUT',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
      },
    rejectUnauthorized: false,
    json: true
  }, (error, response, body) => {

    if(error){
      callback('There was an error connecting to the server');
    }
    else if(response.statusCode == 401 || response.statusCode == 400){
      callback('Unable to set delivery mode for the cart');
    }
    else if(response.statusCode == 200){
      console.log("API hit:", response.statusCode);
    }
  });

};

var gettingSavedCardDetailsService = (authToken, email, callback) => {

    console.log('Getting saved card details of a user API hit');
    request({
      url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/paymentdetails`,
      method: 'GET',
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
      },
      rejectUnauthorized: false,
      json: true
    }, (error, response, body) => {

      if(error){
        callback('There was an error connecting to the server');
      }
      else if(response.statusCode == 401 || response.statusCode == 400){
        callback('Unable to get saved card details for the user');
      }
      else if(response.statusCode == 200){
        console.log("API hit:", response.statusCode);
        callback(undefined, {
          cardNumber: body.payments[0].cardNumber,
          cardId: body.payments[0].billingAddress.id
          });
        }
    });
};

var addCardPaymentService = (authToken, cartId, email, cardId, callback) => {

      console.log('Adding payment API hit');
      request({
        url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/carts/${cartId}/paymentdetails?paymentDetailsId=${cardId}`,
        method: 'PUT',
        headers: {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": `bearer ${authToken}`
         },
        rejectUnauthorized: false,
        json: true
         }, (error, response, body) => {

        if(error){
          callback('There was an error connecting to the server');
        }
        else if(response.statusCode == 401 || response.statusCode == 400){
          callback('Unable to add payment_method for the cart');
        }
        else if(response.statusCode == 200){
          console.log("API hit:", response.statusCode);
         }
      });
};

var placeOrderService = (authToken, cartId, email, storeId, callback) => {

        console.log('Placing order API hit');
        request({
          url: `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/users/${email}/orders?cartId=${cartId}&storeCode=${storeId}&deliveryCode=pickup`,
          method: 'POST',
          headers: {
           "content-type": "application/x-www-form-urlencoded",
           "authorization": `bearer ${authToken}`
           },
          rejectUnauthorized: false,
          json: true
          }, (error, response, body) => {

          if(error){
            callback('There was an error connecting to the server');
          }
          else if(response.statusCode == 401 || response.statusCode == 400){
            callback('Unable to place an order');
          }
          else if(response.statusCode == 201){
            console.log("Place order API hit:", response.statusCode);
            callback(undefined, {
              code: body.code
              });
          }
         });
};


module.exports = {
    getAuthTokenService,
    nearestStoreService,
    calculateDistanceService,
    createCartService,
    addProductsToCart,
    fetchCartService,
    settingDeliveryModeService,
    gettingSavedCardDetailsService,
    addCardPaymentService,
    placeOrderService,
};
