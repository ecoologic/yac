'use strict';
var services = {};

services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    ref:         function(path) { return new Firebase(firebaseUrl + path) },
    messages:    $firebase(new Firebase(firebaseUrl + 'messages')),
    users:       $firebase(new Firebase(firebaseUrl + 'users')),
  };
};

services.User = function(Resource) {
  return function(key) {
    return {
      avatarUrl: function(callback) {
        var path = 'users/' + key + '/thirdPartyUserData/avatar_url';
        Resource.ref(path).on('value', callback);
      }
    };
  };
};

services.Authentication = function(Resource, $cookieStore, $firebaseSimpleLogin) {
  var currentUser, currentUserKey;
  var session = $cookieStore.get('session');

  var setCurrentUserKey = function(key) {
    $cookieStore.put('session', { currentUserKey: key });
    currentUser = key ? Resource.users.$child(key) : null;
    console.log('setCurrentUserKey', currentUser);
    return currentUserKey = key;
  };
  setCurrentUserKey(session['currentUserKey']);
  console.log('Authentication - ', currentUserKey);

  return {
    login: function() {
      var auth = $firebaseSimpleLogin(Resource.ref(''));
      return auth.$login('github').then(function(user) {
        console.log('Authentication#login', user);
        setCurrentUserKey(user.username);
        Resource.users[user.username] = user;
        Resource.users.$save(user.username);
        return user;
      });
    },
    logout:            function() { setCurrentUserKey(null); },
    getCurrentUser:    function() { return currentUser; },
    getCurrentUserKey: function() { return currentUserKey; }
  };
};
