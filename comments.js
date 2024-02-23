// Create web server
// 1. Load http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');
var mime = require('mime');
var cache = {};

// 2. Create web server
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = "assets" + pathname;
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    console.log(realPath);
    if (pathname === '/comment') {
        comments.addComment(request, response);
    } else {
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write('This request URL ' + pathname + ' was not found on this server.');
                response.end();
            } else {
                fs.readFile(realPath, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err);
                    } else {
                        var contentType = mime.lookup(ext);
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    }
});

// 3. Listen on port 8080
server.listen(8080);
