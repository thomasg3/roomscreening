angular.module('roomscreening.controllers.account', [])
  .controller('LoginController', function($scope, $ionicModal, AccountService, $state, $ionicHistory, $localStorage) {
    $scope.loading = true;
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $scope.loginData = {};
    if($localStorage.loggedIn){
      $state.go('app.screenings');
    } else {
      $scope.loading = false;
    }

    $scope.doLogin = function() {
      $scope.loading = true;
      $scope.falseCredentails = false;
      $scope.error = false;
      AccountService.login($scope.loginData.email, $scope.loginData.password, function(){
        $state.go('app.screenings');
        $scope.loading = false;
      }, function(){
        $scope.loading = false;
        $scope.falseCredentails = true;
      }, function(){
        $scope.loading = false;
        $scope.error = true;
      })
    }
  })
  .controller('LogoutController', function($scope, AccountService, $state ,$ionicHistory, $ionicPopup, $localStorage){
    $scope.currentUser = $localStorage.currentUser;

    $scope.logout = function(){
      var confirmPopup = $ionicPopup.confirm({
        title: "Logout",
        template: "Bent u zeker dat u wilt uitloggen als <b>"+$scope.currentUser.email+"</b>?",
        cancelText: "Annuleer"
      }).then(function(confirmed){
        if(confirmed){
          AccountService.logout();
          $state.go('login');
        }
      });
    };
  })

;
