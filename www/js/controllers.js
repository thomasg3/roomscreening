angular.module('roomscreening.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})


.controller('ScreeningOverviewController', function($rootScope, $scope, $stateParams ,LocalScreeningService){

  var array = function(screenings){
    return Object.keys(screenings).map(function(id){return screenings[id];});
  }

  $scope.screenings = LocalScreeningService.getAll();
  $scope.screeningsArray = array($scope.screenings);

  $scope.$on('$ionicView.enter', function(e){
    $scope.screenings = LocalScreeningService.getAll();
    $scope.screeningsArray = array($scope.screenings);
    $scope.$apply();
  })

  $scope.select = function(id){
    $scope.selectedId = id;
    $rootScope.$broadcast('screeningSelected', $scope.screenings[id]);
  };

  $scope.isSelected = function(id){
    return $scope.selectedId == id;
  };

  $scope.$on('screeningDetailReady', function(){
    if($stateParams.id != null){
      $scope.select($stateParams.id);
    } else {
      $scope.select(screeningsArray[0].id);
    }
  });

  $scope.swipeRight = function(){
    $scope.showDelete = true;
  }

  $scope.remove = function(id){
    LocalScreeningService.remove(id);
    $scope.screenings = LocalScreeningService.getAll();
    $scope.screeningsArray = array($scope.screenings);
    $scope.showDelete = false;
  }



})

.controller('ScreeningDetailController', function($rootScope, $scope){
  $scope.$on('screeningSelected', function(event, screening){
    $scope.screening = screening;
  });
  $rootScope.$broadcast('screeningDetailReady');
})

.controller('ScreeningEditController', function($scope, LocalScreeningService, $state, $stateParams,$ionicHistory){
  if($stateParams.id != null){
    $scope.screening = LocalScreeningService.get($stateParams.id);
  } else {
    $scope.screening = {};
  }
  $scope.save = function(){
    $scope.screening.last_edit = new Date();
    if($stateParams.id != null){
      LocalScreeningService.update($scope.screening);
      var id = $stateParams.id;
    } else {
      var id = LocalScreeningService.add($scope.screening);
    }
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go('app.specific_screening', {id: id});
  };
})


;
