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

controllers.MessagesCtrl = function($scope, Resource, Message) {
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

  $scope.messages = Resource.messages;

  $scope.isCurrentUserMessage = function(messageUserKey) {
    return $scope.currentUserKey === messageUserKey;
  };

  $scope.deleteable = function(senderUserKey) {
    return senderUserKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages.$remove(key);
  };
};

controllers.NewMessageCtrl = function($scope, Authentication, Resource) {
  $scope.create = function() {
    $scope.newMessage.senderUserKey = $scope.currentUserKey;
    $scope.newMessage.createdAt = new Date().toLocaleString();
    Resource.messages.$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
