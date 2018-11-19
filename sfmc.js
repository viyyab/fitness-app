const request= require('request');

var getAuthTokenService = (username, password, callback) =>{

  console.log('Auth token API hit');
  request({
    url: 'http://auth.exacttargetapis.com/v1/requestToken' ,
    body: {
        "clientId": "p0ss0ptpfmjcuosj0m70cvqt",
        "clientSecret": "toHsvwXF5BBeUggKk7ZjAG8r"
    },
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
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
      callback(undefined, {
        token: value.substr(7,value.length),
        customer_id: body.customer_id,
        email: body.email,
        first_name: body.first_name
        });
      }
  });
};


var getDeviceTokenService = (token, callback) => {
        console.log('getDeviceTokenService API hit');
        request({
          url: `http://www.exacttargetapis.com/contacts/v1/attributes/search `,
          body: {
              "request": {
              "attributes": [{
                    "key": "MobilePush Demographics.System Token"
                     }]
                },
                "conditionSet": {
                    "operator": "And",
                    "conditionSets": [],
                    "conditions": [{
                        "attribute": {
                            "key": "MobilePush Demographics.Device ID"
                           },
                        "operator": "Equals",
                        "value": {
                            "items": ["12168B3355DB4A3E95505C8122D5767DD05F3984F1519846C01CB4E7215525E8"] //Device ID 
                           }
                       }]
                    }
             },
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
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
            callback(undefined, {
              productId: body.hits[0].product_id
              });
           }
       });
};


var sendPushNotificationService = (token, callback) => {

  console.log('sendPushNotificationService API hit');
  request({
    url: `http://www.exacttargetapis.com/push/v1/messageContact/MTY0OjExNDow/send`,
    body: 
    {
     "DeviceTokens": ["e2NcvWHgF3M:APA91bGVXTn5QzFQ7VWETu6rPaTxmPvWRBw99KAKiL0RFqitjSGHdOlYFm43Vr_V5NiYRYhf216IHk29i2mCAqUME64A4cf4VVj8SYm1K--Li-AkDDdkwgqvqIt2dTjxXt-N6D3vNKMC"]
    },
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
    else if(response.statusCode == 200){
      console.log('createCartService API hit:', response.statusCode)
      callback(undefined, {
        basketId: body.basket_id
        });
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
    getDeviceTokenService,
    sendPushNotificationService
};
