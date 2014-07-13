'use strict';
var services = {};

services.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    ref:      function(path) { return new Firebase(firebaseUrl + path); },
    users:    $firebase(new Firebase(firebaseUrl + 'users')),
    rooms:    $firebase(new Firebase(firebaseUrl + 'rooms')),
    messages: function(roomKey) {
      return $firebase(new Firebase(firebaseUrl + 'rooms/' + roomKey + '/messages'));
    }
  };
};

services.User = function(Resource) {
  return function(args) {
    var key = args.key;
    return {
      // collection methods
      // key methods: User({ key: x }).avatarUrl(y)
      avatarUrl: function(callback) {
        var path = 'users/' + key + '/thirdPartyUserData/avatar_url';
        Resource.ref(path).on('value', callback);
      }
      // value methods
    };
  };
};

services.Message = function(User) {
  var senderAvatarUrl = function(senderKey, callback) {
    User({ key: senderKey }).avatarUrl(callback);
  };

  return function(args) {
    var message = args.message;
    return {
      // collection methods: Message({}).addNewSenderAvatarUrls(xs)
      addNewSenderAvatarUrls: function(newMessages) {
        if(!newMessages) return;
        _.each(newMessages.$getIndex(), function(messageKey) {
          var message = newMessages[messageKey];
          if(message.senderAvatarUrl) return;
          senderAvatarUrl(message.senderKey, function(snapshot) {
            message.senderAvatarUrl = snapshot.val() || 'img/missing_avatar.png?';
          });
        });
      },
      // key methods
      // value methods: Message({ message: x }).senderAvatarUrl(y)
      senderAvatarUrl: function(callback) {
        senderAvatarUrl(message.senderKey, callback);
      }
    };
  };
};
