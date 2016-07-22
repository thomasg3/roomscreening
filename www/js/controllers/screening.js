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

  $scope.$watch('screenings', reset, true);

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

.controller('ScreeningDetailCtrl', function($rootScope, $scope, ClientService, $ionicPopup){
  $scope.$on('screeningSelected', function(event, screening){
    $scope.screening = screening;
  });
  $rootScope.$broadcast('screeningDetailReady');
  $scope.complete = function(screening){
    if($scope.screening.rooms && $scope.screening.rooms.length){
      var confirmPopup = $ionicPopup.confirm({
        title: "Screening Afwerken",
        template: "Bent u zeker dat u deze Screening wilt afwerken? U kan deze <b>Screening niet meer aanpassen</b> na deze actie.",
        cancelText: 'Annuleer'
      }).then(function (confirmed) {
        if(confirmed){
          $scope.screening.last_edit = new Date();
          $scope.screening.complete = true;
        }
      });
    }
  }
})

.controller('ScreeningEditController', function($scope, LocalScreeningService, $state, $stateParams,$ionicHistory, ClientService, $ionicLoading){
  $ionicLoading.show();
  ClientService.getAll(function(clients){
    $scope.clients = clients;
    $ionicLoading.hide();
  }, function(error){
    $scope.clients = [];
    $ionicLoading.hide();
  })

  if($stateParams.id != null){
    $scope.screening = angular.copy(LocalScreeningService.get($stateParams.id));
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
      $scope.screening.rooms = [{name:"Inkom", issues:2}];
      var id = LocalScreeningService.add($scope.screening);
    }
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go('app.specific_screening', {id: id});
  };
})

;
