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

factories.GithubAvatar = function(Resource) {
  return function(args) {
    var userKey = args.userKey;
    var size = args.size || 24;
    var path = 'users/' + userKey + '/thirdPartyUserData/avatar_url';

    return {
      url: function(callback) {
        Resource.ref(path).on('value', function(snapshot) {
          var result = snapshot.val() || 'img/missing_avatar.png?v=1'
          result += '&s=' + size;
          callback(result);
        });
      }
    };
  };
}

factories.AFH = function(Resource) { // -> "Angular-Fire" Helpers
  return function(args) {
    var items = args.items;

    return {
      forEveryNewCollectionItem: function(callback) {
        if(!items) return;
        _.each(items.$getIndex(), function(key) {
          callback(items[key], key);
        });
      }
    };
  };
}

factories.Message = function(Resource, Authentication, CurrentRoom) {
  return function(args) {
    var message = args.message;
    return {
      create: function() {
        if(!message.text.trim()) return;
        message.senderKey = Authentication.currentUserKey; // FIXME
        message.createdAt = new Date().toLocaleString();
        Resource.messages(CurrentRoom.key).$add(message);
        Resource.room(CurrentRoom.key).$set({ lastMessageAt: $scope.newMessage.createdAt });
      }
    }
  };
};
