angular.module('roomscreening.controllers.account', [])
  .controller('LoginController', function($scope, $ionicModal, AccountService, $state, $ionicHistory) {

    if(AccountService.isLoggedIn){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('app.screenings');
    } else {
      $scope.loginData = {};
      if (!$scope.loginModal) {
        $ionicModal.fromTemplateUrl('templates/account/login.modal.html', {
          scope: $scope,
          backdropClickToClose: false,
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.loginModal = modal;
          $scope.loginModal.show();
          $scope.loading = false;
        })
      }
    }

    $scope.doLogin = function() {
      $scope.loading = true;
      $scope.falseCredentails = false;
      $scope.error = false;
      AccountService.login($scope.loginData.email, $scope.loginData.password, function(){
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $scope.loginModal.hide();
        $state.go('app.screenings');
      }, function(){
        $scope.loading = false;
        $scope.falseCredentails = true;
      }, function(){
        $scope.loading = false;
        $scope.error = true;
      })

    }
  })

;
