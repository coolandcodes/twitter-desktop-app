angular.module('app', [])
  .controller('main', function($scope, socket, Window) {
    //Array to store tweets temporarily
    $scope.tweets = [];
    //Activate loader
    $scope.noTweets = true;
    //Listen on info
    socket.on('info', function(info) {
      //Activate loader
      $scope.noTweets = false;
      //Add new tweets on top of the array when the come in
      $scope.tweets.unshift(info.tweet);

      var options = {
        icon: info.tweet.user.profile_image_url,
        body: info.tweet.text
      };
      //Notify the user of new tweets
      var notification = new Notification(info.tweet.user.name, options);
    });
    //Close application
    $scope.close = function() {
      Window.close();
    };
    //Minimize application
    $scope.minimize = function() {
      Window.minimize();
    };
  })
  //Angular wrapper for Socket.io
  .factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  })
  //Angular Wrapper for NW GUI
  .factory('GUI', function() {
    return require('nw.gui');
  })
  //Angular Wrapper for NW Window
  .factory('Window', function(GUI) {
    return GUI.Window.get();
  });
