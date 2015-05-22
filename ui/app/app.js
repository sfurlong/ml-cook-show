
angular.module('sample', [
  'ngRoute',
  'ngCkeditor',
  'ui.bootstrap',
  'ml.common',
  'ml.search',
  'ml.search.tpls',
  'ml.utils',
  'sample.user',
  'sample.search',
  'sample.common',
  'sample.detail',
  'sample.create',
  'sample.esriMap',
  'sample.sql',
  'sample.data',
  'sample.sources'
])
  .config(['$routeProvider', '$locationProvider', 'mlMapsProvider', function ($routeProvider, $locationProvider, mlMapsProvider) {

    'use strict';

    // to use google maps, version 3, with the drawing and visualization libraries
    // mlMapsProvider.useVersion(3);
    // mlMapsProvider.addLibrary('drawing');
    // mlMapsProvider.addLibrary('visualization');

    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: '/sources/sources.html',
        controller: 'SourcesCtrl',
        controllerAs: 'sourcesCtrl',
        resolve: {
          counts: function($http) {
            return $http.get('/v1/resources/datasources').then(function(resp) {
              return resp.data;
            });
          }
        }
      })
      .when('/search', {
        templateUrl: '/search/search.html',
        controller: 'SearchCtrl',
        reloadOnSearch: false
      })
      .when('/create', {
        templateUrl: '/create/create.html',
        controller: 'CreateCtrl'
      })
      .when('/detail', {
        templateUrl: '/detail/detail.html',
        controller: 'DetailCtrl'
      })
      .when('/profile', {
        templateUrl: '/user/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/sql-explorer', {
        templateUrl: '/sql/sql-explorer.html',
        controller: 'SqlCtrl'
      })
      .when('/sql-editor', {
        templateUrl: '/sql/sql-editor.html',
        controller: 'SqlCtrl'
      })
      .when('/data', {
        templateUrl: '/data/data.html',
        controller: 'DataCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
