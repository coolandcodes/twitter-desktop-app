// Require dependencies
var express = require('express'),
  http = require('http')
  path = require('path'),
  cookieParser = require('cookie-parser'),
  socket = require('socket.io'),
  Twit = require('twit'),
  bodyParser = require('body-parser');

//Configure express app
var app = express();
//Require the routes
var routes = require('./routes');

//Setup Twitter credentials
var T = new Twit({
  consumer_key: 'DtUyxpHfpEHbRq2A0GyoQd5u3',
  consumer_secret: '8lh47jVGUwiUTDmuaaZd2e7Yx9N5bRPkLH9mxAA8yuTBHowoZZ',
  access_token: '811098595-IQDL6sxmtnIXQ8ug6vwaV9ggBWy3sjm0UUNCmXFv',
  access_token_secret: '7WZzZl8SV5b3Pf2MeTsxwOS9a0vlBKq8Guj7VfI4Gk78o'
});

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

//Create the default route
app.get('/', routes.index);

//Set port to 3000
app.set('port', process.env.PORT || 3000);

// Create a Http Server
var server = http.createServer(app).listen(
  app.get('port'), function() {
    console.log('Express server listening on port ' +
    app.get('port'));
});

//Assing socket a server to listen to
var io = socket.listen(server);

//Create a stream at 'user' endpoints and include feeds from
//from those followed by the user
var stream = T.stream('user', {with:'followings'})

//Listen for conenction
io.sockets.on('connection', function (socket) {
  //Listen for a new tweet from the stream
  stream.on('tweet', function(tweet) {
    //Once there is a tweet, emit its information.
    socket.emit('info', { tweet: tweet});
  });
});

//Export the app
module.exports = app;
