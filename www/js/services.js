angular.module('roomscreening.services', [])
  .constant('appAuthenticationToken', '1234DFSFSG5T6G678ISFDFEE2ZVBGJIK')
  .constant('baseURL', 'https://pxl.apexhealth.eu/ords/hopp/rs/api/')
  .factory('httpAuthenticationInterceptor', function(appAuthenticationToken){
    return {
      request: function(config){
        config.headers['Authentication'] = appAuthenticationToken;
        return config;
      }
    }
  })
  .factory('httpLogginInterceptor', function($log, $q){
    return {
      request: function(config){
        //$log.debug("HTTP Request: "+angular.toJson(config, false));
        return config;
      },
      response: function(response){
        //$log.debug("HTTP Response: "+angular.toJson(response, false));
        return response;
      },
      requestError: function(rejectReason){
        $log.error("HTTP Request: "+angular.toJson(rejectReason, false));
        return $q.reject(rejectReason);
      },
      responseError: function(response){
        $log.error("HTTP Response: "+angular.toJson(response, false));
        return $q.reject(response);
      }

    }
  })
  .factory('LocalScreeningService', function($localStorage) {
    var guid = function() {
      var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }

    return {
      getAll: function() {
        return $localStorage.screenings;
      },
      get: function(id) {
        return $localStorage.screenings[id];
      },
      add: function(screening) {
        screening.id = guid();
        $localStorage.screenings[screening.id] = screening;
        return screening.id;
      },
      remove: function(id) {
        delete $localStorage.screenings[id];
      },
      update: function(screening) {
        $localStorage.screenings[screening.id] = screening;
      }
    }
  })
  .factory('AccountService', function($localStorage, baseURL, $http, $log) {
    return {
      //success = successful login, failure = failed to login, error = some kind of error occured
      login: function(email, password, success, failure ,error) {
        $http.get(baseURL + 'login', {
          headers: {
            'username': email,
            'password': password
          }
        }).then(function(response) {
          if (response.status == 200) {
            if (response.data != "") {
              var user = response.data;
              user.email = email;
              $localStorage.currentUser = user;
              $localStorage.loggedIn = true;
              success();
            } else {
              $log.warn("Login", angular.toJson(response));
              failure();
            }
          }
        }, function(response) {
          $log.error("Login", angular.toJson(response));
          error();
        });
      },
      logout: function() {
         $localStorage.currentUser = {};
         $localStorage.loggedIn = false;
      }
    }
  })
  .factory('ClientService', function($localStorage, baseURL, $http){
    return {
      getAll: function(success, failure){
        $http.get(baseURL+'clients').then(function(response){
          $localStorage.clients = {};
          response.data.items.forEach(function(client){
            $localStorage.clients[client.id] = client;
          });
          success(response.data.items);
        }, function(response) {
          failure(response)
        })
      },
      get: function(id){
          return $localStorage.clients[id];
      }
    }
  })

;
