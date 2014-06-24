'use strict';
var controllers = {};

controllers.AuthenticationCtrl = function($scope, Authentication) {
  $scope.login  = Authentication.login;
  $scope.logout = Authentication.logout;
};

controllers.MessagesCtrl = function($scope, Resource, User) {
  var setMessageSenderUserAvatarUrl = function(messageKey) {
    var message = $scope.messages[messageKey];
    if(!message.senderUserAvatarUrl) {
      User(message.senderUserKey).avatarUrl(function(snapshot) {
        $scope.messages[messageKey].senderUserAvatarUrl = snapshot.val() || 'images/missing_avatar.png?';
      });
    }
  };
  $scope.$watchCollection('messages', function(newMessages, oldMessages) {
    if(newMessages) {
      _.each(newMessages.$getIndex(), function(messageKey) {
        setMessageSenderUserAvatarUrl(messageKey);
      });
    };
  });

  $scope.messages = Resource.messages;

  $scope.deleteable = function(senderUserKey) {
    return senderUserKey === $scope.currentUserKey;
  };

  $scope.delete = function(key) {
    Resource.messages.$remove(key);
  }
};

controllers.NewMessageCtrl = function($scope, Authentication, Resource) {
  $scope.create = function() {
    $scope.newMessage.senderUserKey = $scope.currentUserKey;
    $scope.newMessage.createdAt = (new Date()).toLocaleString();
    Resource.messages.$add($scope.newMessage);
    $scope.newMessage = {};
  };
};
