// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('roomscreening', ['ionic', 'ngStorage', 'ngCordova' ,'roomscreening.controllers', 'roomscreening.services'])

.run(function($ionicPlatform, $localStorage, $rootScope, $state, $log) {
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

    $localStorage = $localStorage.$default({
      currentUser: {},
      loggedIn: false,
      screenings: {},
      clients: {}
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(toState.name != 'login' && !$localStorage.loggedIn){
        event.preventDefault();
        $state.go('login');
      }
    });

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $log.warn(networkState);
    })

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      $log.warn(networkState);
    })


  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('httpAuthenticationInterceptor');
  $httpProvider.interceptors.push('httpLogginInterceptor');
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/account/login.html',
    controller: 'LoginCtrl',
    cache: false
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/overviewDetail.html'
  })
  .state('app.screenings', {
    url: '/screenings',
    views: {
      'overviewContent' : {
        templateUrl: 'templates/screening/overview.html',
        controller: 'ScreeningOverviewCtrl'
      },
      'detailContent': {
        templateUrl: 'templates/screening/detail.html',
        controller: 'ScreeningDetailCtrl'
      },
    }
  })
  .state('app.specific_screening', {
    url: '/screenings/:id',
    views: {
      'overviewContent' : {
        templateUrl: 'templates/screening/overview.html',
        controller: 'ScreeningOverviewCtrl'
      },
      'detailContent': {
        templateUrl: 'templates/screening/detail.html',
        controller: 'ScreeningDetailCtrl'
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
})


;
