var http = require('http');
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(process.env));
  var child_process = require("child_process");
  if (process.platform === 'darwin') {
	command = "open";
  } else if (process.platform === 'win32') {
    if (fs.existsSync(userAppPath)) {
      command = userAppPath;
    } else if (fs.existsSync(sysAppPath)) {
      command = sysAppPath;
    }
  }
  child = child_process.spawn(command, [protocolUrl], 
    { 
        detached:true,
        stdio:['ignore']
    });
  child.unref();
  console.log('started');
  //res.end('Hello World\n');
});

server.listen(18170, '127.0.0.1');
console.log('Server running at http://127.0.0.1:18170/');

// Force the process to close after 15 seconds
/*setTimeout(function(){
  process.exit();
},15000);
*/