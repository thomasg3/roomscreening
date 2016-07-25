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
    if($scope.screening.issues == null){
      $scope.screening.issues = [];
    }
    $scope.$on('roomIndexSelected', function(event, index){
      $scope.room = $scope.screening.rooms[index];
    });

    $scope.hasIssue = function(roomId, categoryId, itemId, subItemId){
        return $scope.screening.issues.some(function(issue){
          return issue.room_id == roomId
            && issue.category_id == categoryId
            && (itemId == null || issue.item_id == itemId)
            && (subItemId == null || issue.sub_item_id == subItemId);
        });
    }

    $scope.getIssue = function(roomId, categoryId, itemId, subItemId){
        return $scope.screening.issues.filter(function(issue){
          return issue.room_id == roomId
            && issue.category_id == categoryId
            && (itemId == null || issue.item_id == itemId)
            && (subItemId == null || issue.sub_item_id == subItemId);
        })[0];
    }

    $scope.addIssue = function(roomId, categoryId, itemId, subItemId){
      $scope.screening.issues.push({
        room_id: roomId,
        category_id: categoryId,
        item_id: itemId,
        sub_item_id: subItemId
      });
    }

    $scope.removeIssue = function(roomId, categoryId, itemId, subItemId){
      $scope.screening.issues = $scope.screening.issues.filter(function(issue){
        return !(issue.room_id == roomId
          && issue.category_id == categoryId
          && (itemId == null || issue.item_id == itemId)
          && (subItemId == null || issue.sub_item_id == subItemId));
      })
    }

    $scope.toggleIssue = function(roomId, categoryId, itemId, subItemId){
      if($scope.hasIssue(roomId, categoryId, itemId, subItemId)){
        $scope.removeIssue(roomId, categoryId, itemId, subItemId);
      } else {
        $scope.addIssue(roomId, categoryId, itemId, subItemId);
      }
    }

    $rootScope.$broadcast('surveyDetailReady');

  })

  .controller('IssueCtrl', function($scope, $log, $ionicPopover){
    if($scope.issue == null){
      $log.error("IssueCtrl did not receive an issue from it's directive");
    }

    $scope.toggleApplicable = function(){
      $scope.issue.not_applicable = !$scope.issue.not_applicable;
    }

    $scope.toggleClient = function(){
      $scope.issue.issue_client = !$scope.issue.issue_client;
    }

    $scope.toggleCareGiver = function(){
      $scope.issue.issue_care_giver = !$scope.issue.issue_care_giver
    }


  })


  .controller('SurveyOverviewCtrl', function($scope, $stateParams, LocalScreeningService, $ionicModal,StructureService, RoomToIconService, $rootScope, $ionicPopup){
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
    $scope.addRoom = function(room){$scope.screening.rooms.push(angular.copy(room)); $scope.hideAddRoom();}

    $scope.select = function(index){
      selectedIndex = index;
      $rootScope.$broadcast('roomIndexSelected', index);
    }

    $scope.isSelected = function(index){
      return selectedIndex == index;
    }

    $scope.swipeLeft = function(){
      $scope.showDelete = false;
    }

    $scope.swipeRight = function(){
      $scope.showDelete = true;
    }

    $scope.removeRoom = function(index){
      $ionicPopup.confirm({
        title: "Ruimte Verwijderen",
        template: "Bent u zeker dat u de Ruimte \"" + $scope.screening.rooms[index].room + "\" wilt verwijderen?",
        cancelText: 'Annuleer'
      }).then(function(confirmed){
        if(confirmed){
          $scope.screening.rooms.splice(index, 1);
          if($scope.selectedIndex == index){
            $scope.select();
          }
        }
        $scope.showDelete = false;
      })
    }

    $scope.$on('surveyDetailReady', function(){
      $scope.select(0);
    })


  })

  ;
