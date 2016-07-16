angular.module('roomscreening.controllers.account', [])
  .controller('LoginController', function($scope, $ionicModal, LoginService){
    $scope.loginData = {};

    if(!$scope.loginModal){
      $ionicModal.fromTemplateUrl('templates/account/login.modal.html', {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function(modal){
        $scope.loginModal = modal;
        $scope.loginModal.show();
        $scope.loading = false;
      })
    }

    $scope.doLogin = function(){
      $scope.loading = true;
      LoginService.login($scope.loginData.email, $scope.loginData.password);
    }
  })

;
