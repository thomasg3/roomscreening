angular.module('roomscreening.controllers.account', ['ngCordova'])
  .controller('LoginCtrl', function($scope, $log, AccountService, $state, $ionicHistory, $localStorage, $cordovaNetwork, $ionicPlatform) {
    $scope.connected = true;
    $ionicPlatform.ready(function(){
      $scope.connected = !ionic.Platform.isWebView() || $cordovaNetwork.isOnline();

      $scope.$on('$cordovaNetwork:online', function(){
        $scope.connected = true;
      })

      $scope.$on('$cordovaNetwork:offline', function(){
        $scope.connected = false;
      })

    });
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
        if($localStorage.loggedIn){
          $state.go('app.screenings');
          $scope.loading = false;
        } else {
          $log.warn("Login", "Login did not take, try again");
          $scope.doLogin();
        }
      }, function(){
        $scope.loading = false;
        $scope.falseCredentails = true;
      }, function(){
        $scope.loading = false;
        $scope.error = true;
      })
    }
  })
  .controller('LogoutCtrl', function($scope, AccountService, $state ,$ionicHistory, $ionicPopup, $localStorage){
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
