angular.module('roomscreening.services', [])
  .constant('appAuthenticationToken', '')
  .constant('baseURL', '')
  .factory('LocalScreeningService', function($localStorage){

      $localStorage = $localStorage.$default({
        screenings: {}
      });

      var guid = function(){
        var S4 = function(){
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
      }

      return {
        getAll: function(){
          return $localStorage.screenings;
        },
        get: function(id){
          return $localStorage.screenings[id];
        },
        add: function(screening){
          screening.id = guid();
          $localStorage.screenings[screening.id] = screening;
          return screening.id;
        },
        remove: function(id){
          delete $localStorage.screenings[id];
        },
        update: function(screening){
          $localStorage.screenings[screening.id] = screening;
        }
      }
  })
