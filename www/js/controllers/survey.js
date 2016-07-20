angular.module('roomscreening.controllers.survey', [])
  .controller('TestCtrl', function($scope, StructureService, $log){
    StructureService.get(function(structure){
      $scope.structure = structure;
    }, function(error){
      $log.error(error);
    })
  })
  .controller('SurveyDetailCtrl', function($rootScope, $scope, StructureService, $log, LocalScreeningService, $stateParams){
    StructureService.get(function(structure){
      $scope.structure = structure;
    }, function(error){
      $log.error(error);
    });
    $scope.screening = LocalScreeningService.get($stateParams.screeningId);
    $scope.$on('roomIndexSelected', function(event, index){
      $scope.room = $scope.screening.rooms[index];
    });

    $rootScope.$broadcast('surveyDetailReady');

  })
  .controller('SurveyOverviewCtrl', function($scope, $stateParams, LocalScreeningService, $ionicModal,StructureService, RoomToIconService, $rootScope){
    var selectedIndex;
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

    $scope.select = function(index){
      selectedIndex = index;
      $rootScope.$broadcast('roomIndexSelected', index);
    }

    $scope.isSelected = function(index){
      return selectedIndex == index;
    }


    $scope.$on('surveyDetailReady', function(){
      $scope.select(0);
    })


  })
  .filter('categoriesFilter', function(){
    return function(categories, roomId){
      if(categories == null || roomId == null){
        return [];
      }
      return categories.filter(function(category){
        return category.room_id == roomId;
      })
    }
  })
  .filter('itemFilter', function(){
    return function(items, roomId, categoryId){
      if(items == null || roomId == null || categoryId == null){
        return [];
      }
      return items.filter(function(item){
        return item.room_id == roomId && item.category_id == categoryId;
      })
    }
  })
  .filter('subitemFilter', function(){
    return function(items, roomId, categoryId, itemId){
      if(items == null || roomId == null || categoryId == null || itemId == null){
        return [];
      }
      return items.filter(function(item){
        return item.room_id == roomId && item.category_id == categoryId && item.item_id == itemId;
      })
    }
  })
  ;
