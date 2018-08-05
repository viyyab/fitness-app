const request= require('request');




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
      console.log(error);
      console.log(response);
      callback('There was an error connecting to the nearest store server');
    }
    else if(response.statusCode == 401){
      callback('Unable to get the result');
    }
    else if(response.statusCode == 200){
      console.log('API hit:', response.statusCode)
      console.log(JSON.stringify(body));
      console.log(body.pointOfServices[0].geoPoint.latitude);
      console.log(body.pointOfServices[0].displayName);
      callback(undefined, {
        address: body.pointOfServices[0].address.line1,
        storeId : body.pointOfServices[0].address.id,
        name: body.pointOfServices[0].displayName,
        distance : body.pointOfServices[0].formattedDistance,
        sLat : body.pointOfServices[0].geoPoint.latitude,
        sLng : body.pointOfServices[0].geoPoint.longitude
        });
      };
  });

};





module.exports = {

    nearestStoreService
  };
