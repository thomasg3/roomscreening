angular.module('roomscreening.controllers.survey', [])
  .controller('SurveyOverviewCtrl', function($scope, $stateParams, LocalScreeningService, $ionicModal,StructureService, RoomToIconService, $rootScope, $ionicPopup, $log){
    var selectedIndex;
    $scope.structure = StructureService.get();
    $scope.screening = LocalScreeningService.get($stateParams.screeningId);

    $ionicModal.fromTemplateUrl('templates/survey/addRoom.modal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.addRoomModal = modal;
    })

    $scope.convert = function(room){
      return RoomToIconService.convert(room.room);
    }

    $scope.showAddRoom = function(){$scope.addRoomModal.show();};
    $scope.hideAddRoom = function(){$scope.addRoomModal.hide();};
    $scope.addRoom = function(room){$scope.screening.rooms.push(angular.copy(room)); $scope.hideAddRoom(); $scope.select($scope.screening.rooms.length-1);};

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
          var room = $scope.screening.rooms.splice(index, 1)[0];
          $scope.screening.issues = $scope.screening.issues.filter(function(issue){
            return issue.room_id != room.room_id
          })
          $scope.screening.photos = $scope.screening.photos.filter(function(photo){
            return photo.room_id != room.room_id
          })
          if(selectedIndex == index){
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
  .controller('SurveyDetailCtrl', function($rootScope, $scope, StructureService, LocalScreeningService, $stateParams, KindOfIssueService){
    $scope.structure = StructureService.get();
    $scope.screening = LocalScreeningService.get($stateParams.screeningId);
    $scope.kinds = KindOfIssueService.get();


    if($scope.screening.issues == null){
      $scope.screening.issues = [];
    }
    if($scope.screening.photos == null){
      $scope.screening.photos = [];
    }

    $scope.$on('roomIndexSelected', function(event, index){
        $scope.room = $scope.screening.rooms[index];
    });

    $scope.showSurvey = function(){
      $scope.tabIndex = 0;
    }

    $scope.showPhotos = function(){
      $scope.tabIndex = 1;
    }

    $scope.surveyTab = function(){
      return $scope.tabIndex == 0;
    }

    $scope.photoTab = function(){
      return $scope.tabIndex == 1;
    }

    $rootScope.$broadcast('surveyDetailReady');

  })

  .controller('SurveyListCtrl', function($scope, $ionicPopup){

    var isIssue = function(issue, roomId, categoryId, itemId, subItemId){
      return issue.room_id == roomId
        && issue.category_id == categoryId
        && issue.item_id == itemId
        && issue.sub_item_id == subItemId;
    }

    $scope.hasIssue = function(roomId, categoryId, itemId, subItemId){
        return $scope.screening.issues.some(function(issue){
            return isIssue(issue, roomId, categoryId, itemId, subItemId);
        });
    }

    $scope.getIssue = function(roomId, categoryId, itemId, subItemId){
        return $scope.screening.issues.filter(function(issue){
          return isIssue(issue, roomId, categoryId, itemId, subItemId);
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
      $ionicPopup.confirm({
        title: "Hindernis verwijderen",
        template: "Bent u zeker dat u deze hindernis wilt verwijderen? Alle ingegeven gegevens voor deze hindernis zijn dan verloren.",
        cancelText: "Annuleer"
      }).then(function(confirmed){
        if(confirmed){
          $scope.screening.issues = $scope.screening.issues.filter(function(issue){
            return !isIssue(issue, roomId, categoryId, itemId, subItemId);
          })
        }
      })
    }

    $scope.toggleIssue = function(roomId, categoryId, itemId, subItemId){
      if($scope.hasIssue(roomId, categoryId, itemId, subItemId)){
        $scope.removeIssue(roomId, categoryId, itemId, subItemId);
      } else {
        $scope.addIssue(roomId, categoryId, itemId, subItemId);
      }
    }

  })

  .controller('SurveyPhotosCtrl', function($scope, $ionicPlatform, $cordovaCamera, GUID, $log, $ionicModal){
    $ionicPlatform.ready(function(){
      $scope.takePicture = function(){
        $cordovaCamera.getPicture({
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.PNG,
          allowEdit: false,
          saveToPhotoAlbum: false,
          correctOrientation: true
        }).then(function(imageData){
          $scope.screening.photos.push({
            room_id: $scope.room.room_id,
            title: $scope.room.room,
            file_name: "photo_"+GUID.generate()+".png",
            mime_type: "image/png",
            file_base64: imageData,
            last_update_date: new Date()
          });
        }, function(error){
          $log.info(error);
        })
      }
    });

    $ionicModal.fromTemplateUrl('templates/survey/photo.modal.html', {
      scope: $scope
    }).then(function(modal){
      $scope.photoModal = modal;
    })

    $scope.showPhotoDetail = function(photo){
      $scope.selectedPhoto = photo;
      $scope.photoModal.show();
    }

    $scope.hidePhotoDetail = function(){
      $scope.photoModal.hide();
    }

  })

  .controller('IssueCtrl', function($scope, $log, $ionicPopover){
    if($scope.issue == null){
      $log.error("IssueCtrl did not receive an issue from it's directive");
    }
    if($scope.kinds == null){
      $log.error("IssueCtrl did not receive kinds from it's directive");
    }
    if($scope.issue.sort_issues == null){
      $scope.issue.sort_issues = [];
    }
    $ionicPopover.fromTemplateUrl('templates/survey/kinds.popover.html', {
      scope: $scope,
    }).then(function(popover){
      $scope.kindsPopover = popover;
    })

    $scope.toggleApplicable = function(){
      $scope.issue.not_applicable = !$scope.issue.not_applicable;
    }

    $scope.toggleClient = function(){
      $scope.issue.issue_client = !$scope.issue.issue_client;
    }

    $scope.toggleCareGiver = function(){
      $scope.issue.issue_care_giver = !$scope.issue.issue_care_giver
    }

    $scope.showKinds = function($event){
      $scope.kindsPopover.show($event);
    }

    $scope.toggleKind = function(sortIssue){
      if($scope.hasKind(sortIssue)){
        $scope.issue.sort_issues.splice($scope.issue.sort_issues.indexOf(sortIssue), 1);
      } else {
        $scope.issue.sort_issues.push(sortIssue);
      }
    }

    $scope.hasKind = function(sortIssue){
      return $scope.issue.sort_issues.indexOf(sortIssue) != -1;
    }


  })




  ;
