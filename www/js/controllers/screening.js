angular.module('roomscreening.controllers.goals', [])

.controller('ScreeningOverviewCtrl', function($rootScope, $scope, $stateParams ,LocalScreeningService, $ionicPopup, $ionicHistory){
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  var array = function(screenings){
    return Object.keys(screenings).map(function(id){return screenings[id];});
  }

  var reset = function(){
    $scope.screenings = LocalScreeningService.getAll();
    $scope.screeningsArray = array($scope.screenings);
  }

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
    } else if($scope.screeningsArray.length) {
      $scope.select($scope.screeningsArray[0].id);
    }
  });

  $scope.swipeRight = function(){
    $scope.showDelete = true;
  }

  $scope.swipeLeft = function(){
    $scope.showDelete = false;
  }

  $scope.remove = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: "Doel Verwijderen",
      template: "Bent u zeker dat u dit doel wilt verwijderen?",
      cancelText: 'Annuleer'
    }).then(function(confirmed){
      if(confirmed){
        LocalScreeningService.remove(id);
        $scope.screenings = LocalScreeningService.getAll();
        $scope.screeningsArray = array($scope.screenings);
        if($scope.selectedId == id){
          $scope.select();
        }
        $scope.showDelete = false;
      } else {
        $scope.showDelete = false;
      }
    })
  }

  reset();
})

.controller('ScreeningDetailCtrl', function($rootScope, $scope){
  $scope.$on('screeningSelected', function(event, screening){
    $scope.screening = screening;
  });
  $rootScope.$broadcast('screeningDetailReady');
})

.controller('ScreeningEditController', function($scope, LocalScreeningService, $state, $stateParams,$ionicHistory){
  $scope.clients = [
    {name: "Zorro"},
    {name: "Curt"},
    {name: "Alice"},
    {name: "Bob"},
    {name: "Denise"},
    {name: "Engelbert"},
    {name: "Fons"}
  ];

  if($stateParams.id != null){
    $scope.screening = LocalScreeningService.get($stateParams.id);
    $scope.title = 'Doel Bewerken';
  } else {
    $scope.screening = {};
    $scope.title = 'Nieuw Doel';
  }

  $scope.save = function(){
    $scope.screening.last_edit = new Date();
    if($stateParams.id != null){
      LocalScreeningService.update($scope.screening);
      var id = $stateParams.id;
    } else {
      $scope.screening.rooms = [];
      var id = LocalScreeningService.add($scope.screening);
    }
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go('app.specific_screening', {id: id});
  };
})

;
