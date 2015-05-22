(function () {
  'use strict';

  angular.module('sample.data', [])
    .service('DataService', function ($http) {
      this.loadMedData = function() {
        var payload = '';
        return $http.post('/v1/resources/load-feeds', payload);
      };
      this.loadClaims = function() {
        var payload = '';
        return $http.post('/v1/resources/load-claims', payload);
      };
      this.loadMemberData = function() {
        var payload = '';
        return $http.post('/v1/resources/load-members', payload);
      };
    })
    .controller('DataCtrl', ['$scope', '$routeParams', 'DataService', function ($scope, $routeParams, DataService) {
      //var uri = $routeParams.uri;
      var model = {
        // your model stuff here
        results: null,
        medNews: {
          status: null,
          loadRunning: false,
          loadSucceeded: false,
          loadFailed: false
        },
        claims: {
          status: null,
          loadRunning: false,
          loadSucceeded: false,
          loadFailed: false
        },
        memberData: {
          status: null,
          loadRunning: false,
          loadSucceeded: false,
          loadFailed: false
        }
      };

      angular.extend($scope, {
        model: model,
        loadMedicalNews: function() {
          model.medNews.loadSucceeded = false;
          model.medNews.loadFailed = false;
          model.medNews.loadRunning = true;
          model.medNews.status = 'Loading Medical News';

          model.results = DataService.loadMedData().success(function(data, status, headers, config) {
            model.medNews.loadSucceeded = true;
            model.medNews.loadRunning = false;
            model.medNews.status = 'Medical News Loaded';
          }).error(function(data, status, headers, config) {
            console.log('Medical News Load - error: ' + data);
            model.medNews.loadFailed = true;
            model.medNews.loadRunning = false;
            model.medNews.status = 'Medical News Load Failed: ' + data;
          });
        },
        loadClaims: function() {
          model.claims.loadSucceeded = false;
          model.claims.loadFailed = false;
          model.claims.loadRunning = true;
          model.claims.status = 'Loading Claims';

          model.results = DataService.loadClaims().success(function(data, status, headers, config) {
            console.log(data);
            model.claims.loadSucceeded = true;
            model.claims.loadRunning = false;
            model.claims.status = 'Claims Loaded';
          }).error(function(data, status, headers, config) {
            console.log('Claims Load - error: ' + data);
            model.claims.loadFailed = true;
            model.claims.loadRunning = false;
            model.claims.status = 'Claims Load Failed: ' + data;
          });
        },
        loadMemberData: function() {
          model.memberData.loadSucceeded = false;
          model.memberData.loadFailed = false;
          model.memberData.loadRunning = true;
          model.memberData.status = 'Loading Member Data';

          model.results = DataService.loadMemberData().success(function(data, status, headers, config) {
            console.log(data);
            model.memberData.loadSucceeded = true;
            model.memberData.loadRunning = false;
            model.memberData.status = 'Member Data Loaded';
          }).error(function(data, status, headers, config) {
            console.log('Member Data Load - error: ' + data);
            model.memberData.loadFailed = true;
            model.memberData.loadRunning = false;
            model.memberData.status = 'Member Data Load Failed: ' + data;
          });
        },
      });
    }]);
}());
