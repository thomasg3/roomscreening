angular.module('roomscreening.directives', [])
  .directive('rsIssue', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/survey/issue.html',
      scope: {
        screening: '=',
        roomId: '=',
        categoryId: '=',
        itemId: '=',
        subItemId: '='
      }
    }
  })
;
