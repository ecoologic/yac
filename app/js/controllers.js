'use strict';
var controllers = {};

controllers.AuthenticationCtrl = function($scope, Authentication, User) {
  $scope.$watch('currentUserKey', function(key) {
    User({ key: key }).avatarUrl(function(snapshot) {
      $scope.avatarUrl = snapshot.val();
    });
  });

  $scope.login  = Authentication.login;
  $scope.logout = Authentication.logout;
};

controllers.RoomsCtrl = function($scope, Resource, ActiveRoom) {
  ActiveRoom.key = 'hall';
  $scope.rooms = Resource.rooms;
};

controllers.MessagesCtrl = function($scope, Resource, Message) {
  // TODO? can we automate this??
  $scope.$watchCollection('messages', function(newMessages, oldMessages) {
    if(!newMessages) return;
    _.each(newMessages.$getIndex(), function(messageKey) {
      var message = newMessages[messageKey];
      if(message.senderAvatarUrl) return;
      Message({ message: message }).senderAvatarUrl(function(snapshot) {
        message.senderAvatarUrl = snapshot.val() || 'img/missing_avatar.png?';
      });
    });
  });

  $scope.messages = Resource.messages($scope.roomKey); // TODO? access $scope.room from ng-repeat?

  $scope.isCurrentUserMessage = function(userKey) {
    return $scope.currentUserKey === userKey;
  };

  $scope.deleteable = function(senderKey) {
    return senderKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages(roomKey).$remove(key);
  };
};

controllers.NewMessageCtrl = function($scope, Authentication, Resource, ActiveRoom) {
  // eg text: `/newroom let's move the conversation here`
  var setActiveRoom = function() {
    $scope.newMessage.text = $scope.newMessage.text.replace(/^\/(\w+)\W?/, function(match, $1) {
      ActiveRoom.key = $1;
      return '';
    });
  };

  var create = function() {
    if(!$scope.newMessage.text.trim()) return;
    $scope.newMessage.senderKey = $scope.currentUserKey;
    $scope.newMessage.createdAt = new Date().toLocaleString();
    Resource.messages(ActiveRoom.key).$add($scope.newMessage);
    $scope.newMessage = {};
  };

  $scope.parse = function() {
    setActiveRoom();
    create();
  };
};
