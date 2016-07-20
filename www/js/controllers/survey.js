angular.module('roomscreening.controllers.survey', [])
  .controller('TestCtrl', function($scope, StructureService, $log){
    StructureService.get(function(structure){
      $scope.structure = structure;
    }, function(error){
      $log.error(error);
    })
  })
  .controller('SurveyDetailCtrl', function($rootScope, $scope, StructureService, $log){
    StructureService.get(function(structure){
      $scope.structure = structure;
    }, function(error){
      $log.error(error);
    });
  })
  .controller('SurveyOverviewCtrl', function($scope, $stateParams, LocalScreeningService, $ionicModal,StructureService, RoomToIconService){
    StructureService.get(function(structure){
      $scope.structure = structure;
    }, function(error){
      $log.error(error);
    });
    $scope.screening = LocalScreeningService.get($stateParams.screeningId);
    $ionicModal.fromTemplateUrl('templates/survey/addRoom.modal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.addRoomModal = modal;
    })

    $scope.convert = function(room){
      return RoomToIconService.convert(room.room);
    }

    $scope.showAddRoom = function(){$scope.addRoomModal.show();}
    $scope.hideAddRoom = function(){$scope.addRoomModal.hide();}
    $scope.addRoom = function(room){$scope.screening.rooms.push(room); $scope.hideAddRoom();}


  })
  ;
