const js2xmlparser= require('js2xmlparser');
const rpc = require('./rpc.js');

var xmlData = (orderCode, shortCode, entries, totalItems, callback) => {

  var obj = {

    "Header": {
        "@": {
            "Version": "2",
            "Command": "0"
        },
    },
    "Order": {
      "@": {
          "localOrderKey":"24176",
          "multipleMenuType":"true",
          "paymentType":"1",
          "pod":"0",
          "podName":"FOE0001",
          "remPod":"0",
          "storeId":"99993",
          "tableId":"",
          "major":"-1",
          "minor":"-1",
          "status":"64",
          "trackStatus":"0",
          "transactionKind":"0",
          "saleDate":"20181020",
          "saleTime":"121056",
          "businessDate":"20181020",
          "type":"0",
          "taxMode":"2",
          "crossedBoundary":"False",
          "customerNickname":"",
          "customerId":"43221533",
          "greeting":"",
          "orderSrc":"2",
          "checkInData":"",
          "tableServiceId":"-1",
          "tableServiceZoneId":"-1",
          "tableTagId":"-1",
          "longCode":orderCode,
          "shortCode":shortCode
        },

        "Item": [
          {
            "@": {
            "index": "1"
          },
          "product":{
            "@":{
              "code":"3",
              "qty":"1",
              "name":"Cheeseburger",
              "deliverEarlyQuantity":"0",
              "unitPrice":"0.01"
            }
          }
        },
        {
          "@": {
            "index": "2"
          },
          "product":{
            "@":{
              "code":"5599",
              "qty":"1",
              "name":"M French Fries",
              "deliverEarlyQuantity":"0",
              "unitPrice":"0.00"
            }
          }
        }
      ]
  },
    "ExternalServices": {
      "Service": {}
    }
};

var xmlFile = js2xmlparser.parse("ProdInfo", obj);
callback(js2xmlparser.parse("ProdInfo", obj));
rpc.xmlRpcClientService(xmlFile, (error, result) => {
  if(error) {
    console.log('XML to RPC Client Hit Failed');
  } else {
    console.log(result);
  }
});

};




module.exports ={
xmlData

};
