const js2xmlparser= require('js2xmlparser');

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
          "localOrderKey":"e70b1ab4-6446-11e8-8725-7cee12724176",
          "multipleMenuType":"true",
          "paymentType":"1",
          "pod":"0",
          "podName":"FOE0001"
          "remPod":"0",
          "storeId":"99993",
          "tableId":"",
          "major":"-1",
          "minor":"-1",
          "status":"64",
          "trackStatus":"0",
          "transactionKind":"0",
          "saleDate":"20181016",
          "saleTime":"152032",
          "businessDate":"20181016",
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
        "Item": {
            "@": {
              "index": "1"
            },
            "product":{
              "@":{
                "code":"",
                "qty":"1",
			          "name":"Cheeseburger",
			          "deliverEarlyQuantity":"0",
			          "unitPrice":"0.01"
              }
            }
        },

        "Item": {
            "@": {
              "index": "2"
            },
            "product":{
              "@":{
                "code":"",
                "qty":"1",
			          "name":"Cheeseburger",
			          "deliverEarlyQuantity":"0",
			          "unitPrice":"0.01"
              }
            }
        }

    },
    "ExternalServices": {
      "Service": {}
    }
};

callback(js2xmlparser.parse("ProdInfo", obj));

};




module.exports {
xmlData

};
