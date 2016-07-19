angular.module('roomscreening.controllers.account', [])
  .controller('LoginController', function($scope, $ionicModal, AccountService, $state, $ionicHistory) {
    $scope.loading = true;
    $scope.loginData = {};
    console.log("Balls");
    if(AccountService.isLoggedIn()){
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('app.screenings');

    } else {
      $scope.loading = false;
    }

    $scope.doLogin = function() {
      $scope.loading = true;
      $scope.falseCredentails = false;
      $scope.error = false;
      AccountService.login($scope.loginData.email, $scope.loginData.password, function(){
        $ionicHistory.nextViewOptions({
          historyRoot: true,
          disableBack: true
        });
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
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
  .controller('LogoutController', function($scope, AccountService, $state ,$ionicHistory, $ionicPopup){
    $scope.currentUser = AccountService.currentUser();
    $scope.logout = function(){
      var confirmPopup = $ionicPopup.confirm({
        title: "Logout",
        template: "Bent u zeker dat u wilt uitloggen als <b>"+$scope.currentUser.email+"</b>",
        cancelText: "Annuleer"
      }).then(function(confirmed){
        if(confirmed){
          AccountService.logout();
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();
          $state.go('login');
        }
      });
    };
    $scope.fuckyouangular = function(){
      alert("FU Anuglar and ionic shit");
    }
  })

;
