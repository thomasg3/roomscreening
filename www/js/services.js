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
  .factory('AccountService', function($localStorage, baseURL, $http) {
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
              failure();
            }
          }
        }, function(response) {
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
  .factory('StructureService', function(baseURL, $http){
    return {
      get: function(success, error){
        $http.get(baseURL+'structure').then(function(response){
          var structure = response.data.items[0];
          structure.lastUpdated = new Date();
          success(structure);
        }, function(response){
            error(response);
        })
      }
    };
  })
  .factory('KindOfIssueService', function(baseURL, $http){
    return {
      get: function(success, error){
        $http.get(baseURL+'sort_issues').then(function(response){
          success(response.data.items);
        }, function(response){
          error(response);
        })
      }
    }
  })
  .factory('RoomToIconService', function(){
    var dictionary = {
      "Algemeen": "ion-home",
      "Badkamer": "ion-android-favorite-outline",
      "Bergruimte": "ion-android-checkbox-outline-blank",
      "Communicatiemedia": "ion-android-call",
      "Eetkamer": "ion-android-restaurant",
      "Hal": "ion-help-buoy",
      "Hor. Circul.": "ion-arrow-swap",
      "Inkom": "ion-android-exit",
      "Keuken": "ion-pizza",
      "Salon": "ion-android-bar",
      "Slaapkamer": "ion-android-alarm-clock",
      "Terras": "ion-android-sunny",
      "Veranda": "ion-android-cloud-outline",
      "Vert. Circul.": "ion-arrow-up-c"
    }
    return {
      convert: function(roomName){
        return dictionary[roomName] || "ion-home";
      }
    }
  })

;
