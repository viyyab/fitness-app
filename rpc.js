const xmlrpc = require('xmlrpc');
const xml2js = require('xml2js');
 //console.log("XML RPC client call")
// // Creates an XML-RPC server to listen to XML-RPC method calls
// var server = xmlrpc.createServer({ host: 'localhost', port: 9090 })
// // Handle methods not found
// server.on('NotFound', function(method, params) {
//   console.log('Method ' + method + ' does not exist');
// })
// // Handle method calls by listening for events with the method call name
// server.on('anAction', function (err, params, callback) {
//   console.log('Method call params for \'anAction\': ' + params)
//
//   // ...perform an action...
//
//   // Send a method response with a value
//   callback(null, 'aResult')
// })
// console.log('XML-RPC server listening on port 9091')
//
// // Waits briefly to give the XML-RPC server time to start up and start
// // listening { host: 'http://54.211.9.131', port: 8088, path: '/RPC2'}
var xmlRpcClientService = (dataResult, callback) => {
  // Creates an XML-RPC client. Passes the host information on where to
  console.log("Entered RPC client call "+ dataResult)
  var client = xmlrpc.createClient('http://54.211.9.131:8088/RPC2');
  console.log("Client created");
  // Sends a method call to the XML-RPC server
  client.call('DoFoeStoreFromFile', [dataResult], function (error, value) {
    console.log("Into RPC client method call")
    if(error){
      console.log('error:', error);
      console.log('req headers:', error.req && error.req._header);
      console.log('res code:', error.res && error.res.statusCode);
      console.log('res body:', error.body);
    } else {
      console.log('Method response for \'DoFoeStoreFromFile\': ' + value);
      callback("XML to RPC client hit successful !")
    }
})

};





module.exports = {
    xmlRpcClientService
};
