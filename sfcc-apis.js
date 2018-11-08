const request= require('request');
var base64 = require('base-64');
var utf8 = require('utf8');

var getAuthTokenService = (username, password, callback) =>{

  console.log('Auth token API hit');
  // var bytes = utf8.encode(username+":"+password);
  // var bearer = base64.encode(bytes);
  var bearer= "Basic " +new Buffer(username + ':' + password).toString('Base64');
  request({
    url: 'https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/customers/auth?client_id=e4bd2b6d-1567-475d-9eb2-b2c86a37a560' ,
    body: {
    "type": "credentials"
    },
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
        "Authorization": bearer,
        "Content-Type": "application/json"
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
      console.log('getAuthTokenService API hit:', response.statusCode)
      var value=response.headers['authorization'];
      callback(undefined, {
        token: value.substr(7,value.length),
        customer_id: body.customer_id,
        email: body.email
        });
      }
  });
};


var getProductDetailsService = (productName, callback) => {

        console.log('Getting product details API hit');
        request({
          url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/products/(${productName})?expand=,prices&client_id=e4bd2b6d-1567-475d-9eb2-b2c86a37a560`,
          method: 'GET',
          headers: {
           "content-type": "application/json"
                  },
          timeout: 40000,
          rejectUnauthorized: false,
          json: true
          }, (error, response, body) => {

          if(error){
            callback('There was an error connecting to the server');
          }
          else if(response.statusCode == 400){
            callback('Unable to get the details');
          }
          else if(response.statusCode == 200){
            console.log("Product by name API hit:", response.statusCode);
            if(body.products[0]){
            callback(undefined, {
              productCode: body.products[0].code
              });
            }else {
              callback(undefined, {
              productCode: 'no product'
              });
            }
          }

         });
};


var createCartService = (authToken, email,callback) => {

  console.log('Create cart API hit');
  request({
    url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets`,
    method: 'POST',
    headers: {
        "content-type": "application/json",
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
      console.log('createCartService API hit:', response.statusCode)

      callback(undefined, {
        cartId: body.code
        });
      }
    });

};

var addProductsToCart = (authToken, product_id, callback) => {

  console.log('Add products API entered');
  var qty = 1;
  request({
    url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/0f8af66a97e89546eb61185036/items`,
    body: {
        "product_id" : product_id,
        "quantity": qty
      },
    timeout: 40000,
    method: 'POST',
    headers: {
        "content-type": "application/json",
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
      console.log('Add products API hit:', response.statusCode);
      callback('Add products API hit');
     }
  });

};


var getAddressService = (authToken, callback) => {
  console.log('Get address API hit');
  request({
    url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/customers/abjZWwTq5Bx5KSFpGGT6E2mzIp/addresses`,
    method: 'GET',
    headers: {
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
      console.log('fetchCartService API hit:', response.statusCode)
      callback(undefined, {
        totalItems: body.totalItems ,
        totalPrice: body.totalPriceWithTax.value
        });
      }
  });

};

var setShipmentService = (authToken, callback) => {

  console.log('Setting shipment API hit');
  request({
    url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/0f8af66a97e89546eb61185036/shipments/me/shipping_address?use_as_billing=true&customer_address_id=home`,
    method: 'PUT',
    headers: {
        "content-type": "application/json",
        "authorization": `bearer ${authToken}`
      },
    body: {},
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
      console.log("settingDeliveryModeService API hit:", response.statusCode);
    }
  });

};

var setShipmentIdService = (authToken, callback) => {

    console.log('Setting shipment id for a basket API hit');
    request({
      url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/0f8af66a97e89546eb61185036/shipments/me/shipping_method`,
      method: 'PUT',
      headers: {
        "content-type": "application/json",
        "authorization": `bearer ${authToken}`
      },
      body: {
          "id":"cafcafe"
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
        console.log("gettingSavedCardDetailsService API hit:", response.statusCode);
        callback(undefined, {
          cardNumber: body.payments[0].cardNumber,
          cardId: body.payments[0].id
          });
        }
    });
};

var addPaymentService = (authToken, callback) => {

      console.log('Adding payment API hit', cardId);
      request({
        url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/baskets/0f8af66a97e89546eb61185036/payment_instruments`,
        method: 'POST',
        headers: {
          "content-type": "application/json",
          "authorization": `bearer ${authToken}`
         },
        body: {
          "amount" : 58.69,
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
          console.log("addCardPaymentService API hit:", response.statusCode);
         }
      });
};

var placeOrderService = (authToken, basket_id, callback) => {

        console.log('Placing order API hit');
        request({
          url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/orders`,
          method: 'POST',
          headers: {
           "content-type": "application/json",
           "authorization": `bearer ${authToken}`
           },
          body: {
            "basket_id": basket_id
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
              code: body.code,
              totalItems: body.totalItems,
              entries: body.entries
              });
          }
         });
};




var updatePaymentService = (authToken, callback) => {

        console.log('Update payment API hit');
        request({
          url: `https://capgemini01-alliance-prtnr-eu06-dw.demandware.net/s/CapCafe/dw/shop/v18_3/orders/00001202/payment_instruments/979b8560332beb76da855e055e`,
          method: 'PATCH',
          headers: {
           "content-type": "application/json",
           "authorization": `bearer ${authToken}`
          },
          body: {
                "amount" : 58.69,
                "payment_card" : {
                  "card_type":"Visa"
                 },
                "payment_method_id" : "CREDIT_CARD"
          },
          rejectUnauthorized: false,
          json: true
          }, (error, response, body) => {

          if(error){
            callback('There was an error connecting to the server');
          }
          else if(response.statusCode == 400){
            callback('Unable to get recommended products');
          }
          else if(response.statusCode == 200){
            console.log("Get recommended product API hit:", response.statusCode);
            if(isEmpty(body.products[0])){
              console.log("no recommended product");
              callback(undefined, {
              name: 'no product'
              });
             }else {
              console.log("recommended product present");
              callback(undefined, {
              name: body.products[0].recommendProduct
              });
            }
          }
         });
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
    getAuthTokenService,
    getProductDetailsService,
    createCartService,
    addProductsToCart,
    getAddressService,
    setShipmentService,
    setShipmentIdService,
    addPaymentService,
    placeOrderService,
    updatePaymentService
};
