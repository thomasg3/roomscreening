angular.module('roomscreening.controllers.goals', [])

.controller('ScreeningOverviewCtrl', function($rootScope, $scope, $stateParams ,LocalScreeningService, $ionicPopup, $ionicHistory, $window){
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  var array = function(screenings){
    return Object.keys(screenings).map(function(id){return screenings[id];});
  }

  var reset = function(){
    $scope.screenings = LocalScreeningService.getAll();
    $scope.screeningsArray = array($scope.screenings).sort(function(s1, s2){
      var d1 = s1.last_edit;
      var d2 = s2.last_edit;
      if(+d1 < +d1){
        return 1
      } else if(+d1 === +d2){
        return 0;
      } else {
        return -1;
      }

    });
  }

  $scope.$on('SyncComplete', reset);


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
    } else if($scope.screeningsArray != null && $scope.screeningsArray.length) {
      $scope.select($scope.screeningsArray[0].id);
    }
  });

  $scope.swipeRight = function(){
    $scope.showDelete = true;
  }

  $scope.swipeLeft = function(){
    $scope.showDelete = false;
  }

  $scope.toggleDelete = function(){
    $scope.showDelete = !$scope.showDelete;
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

  $scope.numberOfIssues = function(screening, room){
    if(screening.issues == null){
      return 0;
    }
    return screening.issues.filter(function(issue){
      return issue.room_id == room.room_id;
    }).length;
  };

  $scope.numberOfPhotos = function(screening, room){
    if(screening.photos == null){
      return 0;
    }
    return screening.photos.filter(function(photo){
      return photo.room_id == room.room_id;
    }).length;
  }

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
  $scope.clients = ClientService.getAll();

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
      $scope.screening.rooms = [];
      $scope.screening.complete = false;
      var id = LocalScreeningService.add($scope.screening);
    }
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go('app.specific_screening', {id: id});
  };
})

;
