var http = require('http');
var socket = require('socket.io');
var fs = require('fs');

var handler = function(req, res) {
  if (req.url === '/') req.url = '/index.html';
  fs.readFile(__dirname + '/build' + req.url, function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500, {'Content-Type':'text/plain'});
      return res.end();
    }
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(data);
  });
};

var server = http.createServer(handler);
var io = socket(server);

server.listen(3000, function() {
  console.log('server up');
});

io.on('connection', function(socket) {
  socket.emit('msg', {'msg': 'hello world'});
});
