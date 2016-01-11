// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform,$cordovaSQLite) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova) {
      db = window.sqlitePlugin.openDatabase({name : "drinkcitiz.db" , androidDatabaseImplementation: 2}); // device
    } else {
        db = window.openDatabase("drinkcitiz.db", '1', 'my', 1024 * 1024 * 10); // browser
    }

    try {
        $cordovaSQLite.execute(db,
          'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, url text,date datetime)'
        ).then(function(value) {
              //alert( value );
          }, function(reason) {
              console.log(reason);
          }, function(value) {

          });
        //return 0;
    } catch (e) {
      console.log(e);
      //return 1;
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {


        var db = $cordovaSQLite.openDB({ name: "DrinkCitiz.db" });

        // for opening a background db:
        //var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$cordovaInAppBrowserProvider) {

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };


  $cordovaInAppBrowserProvider.setDefaultOptions(options)


  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/home');
/*

.state('app.search', {
  url: '/search',
  views: {
    'menuContent': {
      templateUrl: 'templates/search.html'
    }
  }
})
.state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })
 .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

*/


  // if none of the above states are matched, use this as the fallback

})
;
