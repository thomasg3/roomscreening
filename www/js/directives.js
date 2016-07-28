angular.module('roomscreening.directives', [])
  .directive('rsIssue', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/survey/issue.html',
      scope: {
        issue: '=',
        kinds: '=',
      },
      controller: 'IssueCtrl',
    }
  })
  .directive('rsSurveyList', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/survey/surveyList.html',
      scope: {
        structure: '=',
        screening: '=',
        room: '=',
        kinds: '='
      },
      controller: 'SurveyListCtrl'
    }
  })
  .directive('rsSurveyPhotos', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/survey/photos.html',
      scope: {
        screening: '=',
        room: '=',
      },
      controller: 'SurveyPhotosCtrl'
    }
  })
;
