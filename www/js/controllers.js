angular.module('roomscreening.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})


.controller('ScreeningOverviewController', function($scope){
  $scope.screenings = [
    {client_name: "Jos", date: new Date()},
    {client_name: "Jos", date: new Date()},
    {client_name: "Jos", date: new Date()},
    {client_name: "Jos", date: new Date()},
    {client_name: "Jos", date: new Date()},
    {client_name: "Jos", date: new Date()},
  ]
})


;
