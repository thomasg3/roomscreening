// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('roomscreening', ['ionic', 'ngStorage' ,'roomscreening.controllers', 'roomscreening.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/account/login.html',
    controller: 'LoginController',
    cache: false
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/overviewDetail.html',
    controller: 'AppCtrl'
  })
  .state('app.screenings', {
    url: '/screenings',
    views: {
      'overviewContent' : {
        templateUrl: 'templates/screening/overview.html',
        controller: 'ScreeningOverviewController'
      },
      'detailContent': {
        templateUrl: 'templates/screening/detail.html',
        controller: 'ScreeningDetailController'
      },
    }
  })
  .state('app.specific_screening', {
    url: '/screenings/:id',
    views: {
      'overviewContent' : {
        templateUrl: 'templates/screening/overview.html',
        controller: 'ScreeningOverviewController'
      },
      'detailContent': {
        templateUrl: 'templates/screening/detail.html',
        controller: 'ScreeningDetailController'
      },
    }
  })
  .state('new_screening',{
    url: '/screenings/edit',
    templateUrl: 'templates/screening/edit.html',
    controller: 'ScreeningEditController'
  })
  .state('edit_screening', {
    url: '/screenings/edit/:id',
    templateUrl: 'templates/screening/edit.html',
    controller: 'ScreeningEditController'
  })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
