'use strict';
var services = {};

services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    ref:      function(path) { return new Firebase(firebaseUrl + path) },
    users:    $firebase(new Firebase(firebaseUrl + 'users')),
    rooms:    $firebase(new Firebase(firebaseUrl + 'rooms')),
    messages: function(roomKey) {
      return $firebase(new Firebase(firebaseUrl + 'rooms/' + roomKey + '/messages'))
    }
  };
};

services.User = function(Resource) {
  return function(args) {
    var key = args.key;
    return {
      avatarUrl: function(callback) {
        var path = 'users/' + key + '/thirdPartyUserData/avatar_url';
        Resource.ref(path).on('value', callback);
      }
    };
  };
};

services.Message = function(User) {
  return function(args) {
    var message = args.message;
    return {
      senderAvatarUrl: function(callback) {
        User({ key: message.senderKey }).avatarUrl(callback);
      }
    };
  };
};

services.Authentication = function($rootScope, $cookieStore, $firebaseSimpleLogin, Resource) {
  var setCurrentUser = function(key, user) {
    $cookieStore.put('session', { currentUserKey: key });
    $rootScope.currentUserKey = key;
    $rootScope.currentUser = user || (key ? Resource.users.$child(key) : null);
    console.log('Authentication#setCurrentUser', key, $rootScope.currentUser);
  };

  var session = $cookieStore.get('session');
  setCurrentUser(session && session.currentUserKey);
  console.log('Authentication - ', session && session.currentUserKey);

  return {
    login: function() {
      var auth = $firebaseSimpleLogin(Resource.ref(''));
      return auth.$login('github').then(function(user) {
        console.log('Authentication#login', user);
        setCurrentUser(user.username, user);
        Resource.users[user.username] = user;
        Resource.users.$save(user.username);
      });
    },
    logout: function() { setCurrentUser(null); }
  };
};
