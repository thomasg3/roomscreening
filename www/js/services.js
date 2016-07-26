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
  .factory('DictToArray', function(){
    return {
      convert: function(dictionary){
        return Object.keys(dictionary).map(function(id){return dictionary[id];});
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
  .factory('AccountService', function($localStorage, baseURL, $http, $log, $rootScope) {
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
              $rootScope.$broadcast('LogIn');
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
         $rootScope.$broadcast('LogOut');

      }
    }
  })
  .factory('ClientService', function($localStorage, baseURL, $http, DictToArray){
    return {
      getAll: function(success, failure){
        return DictToArray.convert($localStorage.clients);
      },
      get: function(id){
          return $localStorage.clients[id];
      },
      sync: function(success, failure){
        $http.get(baseURL+'clients').then(function(response){
          $localStorage.clients = {};
          response.data.items.forEach(function(client){
            $localStorage.clients[client.id] = client;
          });
          success();
        }, function(response) {
          failure();
        });
      }
    }
  })
  .factory('StructureService', function(baseURL, $http, $localStorage){
    return {
      get: function(){
        return $localStorage.structure;
      },
      sync: function(success, error){
        $http.get(baseURL+'structure').then(function(response){
          var structure = response.data.items[0];
          structure.lastUpdated = new Date();
          $localStorage.structure = structure;
          success();
        }, function(response){
            error();
        })
      }
    };
  })
  .factory('KindOfIssueService', function(baseURL, $http, $localStorage){
    return {
      get: function(){
        return $localStorage.kinds;
      },
      sync: function(success, error){
        $http.get(baseURL+'sort_issues').then(function(response){
          $localStorage.kinds = response.data.items;
          success();
        }, function(response){
          error();
        });
      },
      convert: function(kindArray){
        var kinds = this.get();
        return kindArray.map(function(kind){
          for(var i=0; i<kinds.length; i++){
            if(kinds[i].sort_issue == kind){
              return i+1;
            }
          }
          return -1;
        }).join();
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
  .factory('SyncService', function(baseURL, $rootScope, $cordovaNetwork, $log, $localStorage ,LocalScreeningService, ClientService, StructureService, KindOfIssueService, DictToArray, $http){
    var syncCompleteScreenings = function(){
      $log.debug("Sync::CompleteScreenings");
      var completeScreenings = DictToArray.convert(LocalScreeningService.getAll()).filter(function(screening){
        return screening.complete;
      });
      data = completeScreenings.map(function(screening){
        return {
          client_id: screening.client.id,
          registration_date: screening.last_edit,
          question: screening.goal,
          issues: screening.issues.map(function(issue){
            return {
                room_id: issue.room_id,
                category_id: issue.category_id,
                item_id: issue.item_id,
                sub_item_id: issue.sub_item_id,
                description: issue.description,
                not_applicable: (issue.not_applicable)?'Y':'N',
                issue_client: (issue.issue_client)?'Y':'N',
                issue_care_giver: (issue.issue_care_giver)?'Y':'N',
                sort_issue_ids: KindOfIssueService.convert(issue.sort_issues)
            }
          })
        };
      });
      $log.debug("Sync::completeScreenings::onHold");
      $rootScope.$emit("Sync.completeScreenings.success");

      //send
      //adjust storage to success/error
      //feedback
    };

    var syncStructure = function(){
      $log.debug("Sync::Structure");
      StructureService.sync(function(){
        $log.debug("Sync::Structure::Success");
        $rootScope.$emit("Sync.structure.success");
      }, function(){
        $log.error("Sync::Structure::Error");
        $rootScope.$emit("Sync.structure.error");
      });
    };

    var syncClients = function(){
      $log.debug("Sync::Clients");
      ClientService.sync(function(){
          $log.debug("Sync::Clients::Success");
          $rootScope.$emit("Sync.clients.success");
      }, function(){
          $log.error("Sync::Clients::Error");
          $rootScope.$emit("Sync.clients.error");
      });
    }

    var syncKinds = function(){
      $log.debug("Sync::Kinds");
      KindOfIssueService.sync(function(){
        $log.debug("Sync::Kinds::Success");
        $rootScope.$emit("Sync.kinds.success");
      }, function(){
        $log.error("Sync::Kinds::Error");
        $rootScope.$emit("Sync.kinds.error");
      });
    }

    var executionQueue = [syncCompleteScreenings, syncStructure, syncClients, syncKinds];



    var counter = {
      count: 0,
      increment: function(){
        this.count++;
        if(this.count==executionQueue.length){
          $localStorage.last_sync = new Date();
          $log.debug("Sync::Complete");
          $rootScope.$broadcast('SyncComplete');
        }
      }
    }


    return {
      sync: function(){
        if((!ionic.Platform.isWebView() || $cordovaNetwork.getNetwork() == "wifi") && $localStorage.loggedIn){
          $log.debug("Sync::Start");
          $rootScope.$broadcast('SyncStart');

          (['Sync.completeScreenings.success','Sync.structure.success', 'Sync.clients.success', 'Sync.kinds.success']).forEach(function(e){
            $rootScope.$on(e,function(){
              counter.increment();
            });
          });

          (['Sync.completeScreenings.error','Sync.structure.error', 'Sync.clients.error', 'Sync.kinds.error']).forEach(function(e){
            $rootScope.$on(e, function(){
              counter.increment();
            });
          });

          executionQueue.forEach(function(f){
            f();
          });
        }
      },
      lastSyncDate : function(){
        return $localStorage.last_sync;
      }
      //update after some time too...
      //CHAINING...
    };
  })

;
