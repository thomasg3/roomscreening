angular.module('roomscreening.controllers.account', [])
  .controller('LoginController', function($scope, $ionicModal){

    $ionicModal.fromTemplateUrl('templates/account/login.modal.html', {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal){
      modal.show();
    })



  })

;
