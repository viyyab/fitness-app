const axios= require('axios');


var nearestStoreService = (ulat, ulng) =>{
  console.log('Nearest store API hit');
  return new Promise((resolve, reject) => {
  axios.get({
    url : `https://34.195.45.172:9002/qsrcommercewebservices/v2/qsr/fasteststores?latitude=${ulat}&longitude=${ulng}&radius=8000`,
    rejectUnauthorized: false,
    headers: {
         "content-type": "application/x-www-form-urlencoded"
      },
    json: true
  }).then((response) => {
    if(response.statusCode !== 200) {
      throw new Error('Unable to fetch the address');
    }else {
      resolve({
      latitude : response.body.pointOfServices[0].geoPoint.latitude;
      longitude : response.body.pointOfServices[0].geoPoint.longitude;
      address : response.body.pointOfServices[0].address.line1;
    });
    }
  }).catch((error) =>{
    if(error.code == 'ENOTFOUND'){
      reject('Unable to connect to servers');
    } else {
      reject(error.message);
    }
  });
});
};





module.exports = {

    nearestStoreService
  };
