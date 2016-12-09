var express = require('express'),
app = express();

var path = require('path');

var http = require('http');

var bodyParser = require('body-parser');

app
    .use(bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    }))
    .use(bodyParser.json({limit: '20mb'}))
    .use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(7000, function(){
    console.log('Express server listening on port ' + 7000);
});

require('./routes.js').directory( app );