angular.module('roomscreening.directives', [])
  .directive('rsIssue', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/survey/issue.html',
      scope: {
        issue: '=',
      },
      controller: 'IssueCtrl'
    }
  })
;
