var http = require('http');
var sys = require('sys');
var fs = require('fs');

var server = http.createServer(function(request, response) {
  var file = fs.createWriteStream('copy.txt');
  var fileSize = request.headers['content-length'];
  var uploadedSize = 0;

  console.log("Req, ", sys.inspect(request));

  request.on('data', function (chunk) {
    uploadedSize += chunk.length;
    uploadProgress = (uploadedSize/fileSize) * 100;
    response.write(Math.round(uploadProgress) + "%" + " uploaded\n" );
    var bufferStore = file.write(chunk);
    if(bufferStore == false)
      request.pause();
  });

  file.on('drain', function() {
    request.resume();
  })

  request.on('end', function() {
    response.write('Upload done!');
    response.end();
  })
});


console.log("Starting up the server");
server.listen(8000);
