const xmlrpc = require('xmlrpc');
const xml2js = require('xml2js');

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
// // listening
var xmlRpcClientService = (callback) => {
  // Creates an XML-RPC client. Passes the host information on where to
  // make the XML-RPC calls.
  var client = xmlrpc.createClient({ host: 'localhost', port: 8088, path: '/'})

  // Sends a method call to the XML-RPC server
  client.methodCall('anAction', ['aParam'], function (error, value) {
    // Results of the method response
    console.log('Method response for \'anAction\': ' + value)
  })

};






module.exports = {
    xmlRpcClientService,
};
