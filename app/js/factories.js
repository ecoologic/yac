'user strict';
factories = {};

factories.CurrentRoom = function () {
  return { key: null };
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

factories.Messages = function(Message) {
  return {
    addNewSenderAvatarUrls: function(newMessages) {
      if(!newMessages) return;
      _.each(newMessages.$getIndex(), function(messageKey) {
        var message = newMessages[messageKey];
        if(message.senderAvatarUrl) return;
        Message({ message: message }).senderAvatarUrl(function(snapshot) {
          message.senderAvatarUrl = snapshot.val() || 'img/missing_avatar.png?';
        });
      });
    },
  };
};
