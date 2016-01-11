angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$cordovaSQLite,$ionicPlatform,$cordovaInAppBrowser,$ionicLoading,$http,$cordovaDevice) {
  //$scope.$on('$ionicView.enter', function(e) {
  //});



    $scope.goto = function(url){
        var options = {location: 'yes',clearcache: 'yes',toolbar: 'yes'};
        $cordovaInAppBrowser.open(url, '_blank', options)
        .then(function(event) {
          // success
        })
        .catch(function(event) {
          // error
        });
    };

    $ionicPlatform.ready(function() {

      $ionicLoading.show({
        template: 'Chargement ...'
      }.data);

      $http.get('http://ec2-52-25-133-148.us-west-2.compute.amazonaws.com/drinkcitiz/web/app_dev.php/publicite/5').then(function(resp) {

        jQuery("#startup").show();

        var tempElement = $('<div></div>').html(resp.data);
        jQuery("startup").show();
        jQuery('#startup').html(
          tempElement.html()+'<i onclick="document.getElementById(\'startup\').style.display = \'none\';" style="float:right;" class="icon closeicon ion-close-circled"></i>'
        );
        //v.replace('a target="_blank" href=', 'a href=');


        $ionicLoading.hide();

       }, function(err) {
          console.error('ERR', err);
      });

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
      $cordovaSQLite.execute(db, "select * from history").then(function(data) {
        $scope.history = new Array();
        for (var int = 0; int < data.rows.length; int++) {
          var tmp= data.rows.item(int);
          $scope.history.push(tmp);
        }
        console.log( $scope.history );

      }, function (err) {
        console.error(err);
      });
    });
})

.controller('HomeCtrl', function($scope,$cordovaSQLite,$cordovaBarcodeScanner,$timeout,$ionicPlatform,$cordovaInAppBrowser,$http) {

    $ionicPlatform.ready(function() {
      if (window.cordova) {
        db = window.sqlitePlugin.openDatabase({name : "drinkcitiz.db" , androidDatabaseImplementation: 2}); // device
      } else {
          db = window.openDatabase("drinkcitiz.db", '1', 'my', 1024 * 1024 * 10); // browser
      }
    });
    $scope.scanQRCODE = function(){

      var options = {location: 'yes',clearcache: 'yes',toolbar: 'no'};
      $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
         //alert('###################'+ JSON.stringify(barcodeData) +'######################');
         var query = "INSERT INTO history (date, url) VALUES (?,?)";
         $cordovaSQLite.execute(db, query, [ new Date().getHours() + "h " + new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear(), barcodeData.text ]).then(function(res) {
           console.log("insertId: " + res.insertId);
         }, function (err) {
           console.error(err);
         });
//new Date().getHours() + "h " + new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()
//var uuid = $cordovaDevice.getUUID();
//device_id
         $cordovaSQLite.execute(db, "select * from history").then(function(data) {
           $scope.history = new Array();
           for (var int = 0; int < data.rows.length; int++) {
             var tmp= data.rows.item(int);
             $scope.history.push(tmp);
           }
           console.log( $scope.history );

         }, function (err) {
           console.error(err);
         });
         $http({
               url : "http://ec2-52-25-133-148.us-west-2.compute.amazonaws.com/drinkcitiz/web/app_dev.php/qrcode/",
               method : "POST",
               data : {
                 deviceId : uuid,
                 content : barcodeData.text,
               },
               headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
               },
               transformRequest: function(obj) {
                 var str = [];
                 for ( var p in obj)
                   str.push(encodeURIComponent(p) + "="
                           + encodeURIComponent(obj[p]));
                 return str.join("&");
               },
               timeout : 2000
           }).then(function(data){
             console.log(data);
           },function(err){

           });
         $cordovaInAppBrowser.open(barcodeData.text, '_blank', options)
         .then(function(event) {
           // success
         })
         .catch(function(event) {
           // error
         });
         // Success! Barcode data is here
      }, function(error) {
        // An error occurred
     });

    };


})

;
