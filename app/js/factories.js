'user strict';
factories = {};

factories.Resource = function($firebase) {
  var firebaseUrl = 'https://yetanotherchat.firebaseio.com/development/';
  return {
    ref:      function(path) { return new Firebase(firebaseUrl + path); },

    users:    $firebase(new Firebase(firebaseUrl + 'users')),

    rooms:    $firebase(new Firebase(firebaseUrl + 'rooms')),
    room:     function(roomKey) {
      return $firebase(new Firebase(firebaseUrl + 'rooms/' + roomKey));
    },

    messages: function(roomKey) {
      return $firebase(new Firebase(firebaseUrl + 'messages/' + roomKey));
    }
  };
};

factories.CurrentRoom = function () {
  return { key: 'hall' };
};

factories.Authentication = function($rootScope, $cookieStore, $firebaseSimpleLogin, Resource) {
  var setCurrentUser = function(key, user) {
    $cookieStore.put('session', { currentUserKey: key });
    $rootScope.currentUserKey = key;
    $rootScope.currentUser = user || (key ? Resource.users.$child(key) : null);
    console.log('Authentication#setCurrentUser', key);
  };

  var session = $cookieStore.get('session');
  setCurrentUser(session && session.currentUserKey);
  console.log('Authentication - ', session && session.currentUserKey);

  return {
    login: function() {
      var auth = $firebaseSimpleLogin(Resource.ref(''));
      return auth.$login('github').then(function(user) {
        console.log('Authentication#login', user.username);
        setCurrentUser(user.username, user);
        Resource.users[user.username] = user;
        Resource.users.$save(user.username);
      });
    },
    logout: function() { setCurrentUser(null); }
  };
};

factories.User = function(Resource) {
  return function(args) {
    var key = args.key;
    return {
      // key methods: User({ key: x }).avatarUrl(y)
      avatarUrl: function(callback) {
        var path = 'users/' + key + '/thirdPartyUserData/avatar_url';
        Resource.ref(path).on('value', callback);
      }
      // value methods
    };
  };
};

factories.Rooms = function(Resource) {
  return {
    orderedKeys: function (callback) {
      Resource.rooms.$on('loaded', function(response) {
        return callback(_.keys(response).sort());
      });
    }
  };
};

factories.Message = function(User) {
  return function(args) {
    var message = args.message;
    return {
      // key methods
      // value methods: Message({ message: x }).senderAvatarUrl(y)
      senderAvatarUrl: function(callback) {
        User({ key: message.senderKey }).avatarUrl(callback);
      }
    };
  };
};

factories.Messages = function(Message) {
  return {
    addNewSenderAvatarUrls: function(newMessages) {
      if(!newMessages) return;
      _.each(newMessages.$getIndex(), function(messageKey) {
        var message = newMessages[messageKey];
        if(message.senderAvatarUrl) return;
        Message({ message: message }).senderAvatarUrl(function(snapshot) {
          message.senderAvatarUrl = snapshot.val() || 'img/missing_avatar.png?v=1';
        });
      });
    },
  };
};
