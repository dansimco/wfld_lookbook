// var http = require("http");

// var options = {
//   host: 'api.westfieldlabs.com',
//   port: 80,
//   path: '/api/product/master/products/100.json?api_key=mkypad9rymqm8fs5a6n3c8m8',
//   method: 'GET'
// };

// var req = http.request(options, function (res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });

// req.on('error', function (e) {
//   console.log('problem with request: ' + e.message);
// });

// // write data to request body
// req.write('data\n');
// req.write('data\n');
// req.end();

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  console.log(req.headers.host, req.url);

  var options = {
    host: req.headers.host.split(':')[0],
    port: 80,
    path: req.url,
    method: 'GET'
  };

  console.log(options);

  var api_req = http.request(options, function (api_res) {
    console.log('STATUS: ' + api_res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(api_res.headers));
    api_res.setEncoding('utf8');

    api_res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      res.end('ok');
    });



  });

}).listen(9615);