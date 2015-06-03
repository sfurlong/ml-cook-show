
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

(function () {

  'use strict';

  angular
    .module('sample.common', [])
    .directive('chart', Chart);


  function Chart() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="chart"></div>',
      scope: {
        data: '=',
        labels: '='
      },
      controller: '@',
      controllerAs: 'ctrl',
      name: 'controllerName',
      link: function(scope, ele, attr) {
        var defaultHeight = Math.max(window.innerHeight - 225, 400); // magic number: account for header and footer height (no less than 400)
        scope.createChart = function(options) {
          ele.css('height', attr.height || defaultHeight);

          var o = angular.extend(options, {});
          if (!o.chart) {
            o.chart = {};
          }
          o.chart.renderTo = ele[0];
          ele.css('height', attr.height || '400px');
          scope.chart = new Highcharts.Chart(o);
        };

        scope.compareDates = function(a, b) {
          if (a.x && b.x) {
            if (a.x < b.x) {
              return -1;
            }
            else if (a.x > b.x) {
              return 1;
            }
          }
          else {
            if (a[0] < b[0]) {
              return -1;
            }
            else if (a[0] > b[0]) {
              return 1;
            }
          }
          return 0;
        };
      }
    };
  }

})();


angular.module('sample.common', [])
  .filter('object2Array', function() {
    'use strict';

    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
});

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

// Copied from https://docs.angularjs.org/api/ng/service/$compile
angular.module('sample.create')
  .directive('compile', function($compile) {
    'use strict';

    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
           // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  });

(function () {
  'use strict';

  angular.module('sample.create')
    .controller('CreateCtrl', ['$scope', 'MLRest', '$window', 'User', function ($scope, mlRest, win, user) {
      var model = {
        person: {
          isActive: true,
          balance: 0,
          picture: 'http://placehold.it/32x32',
          age: 0,
          eyeColor: '',
          name: '',
          gender: '',
          company: '',
          email: '',
          phone: '',
          address: '',
          about: '',
          registered: '',
          latitude: 0,
          longitude: 0,
          tags: [],
          friends: [],
          greeting: '',
          favoriteFruit: ''
        },
        newTag: '',
        user: user
      };

      angular.extend($scope, {
        model: model,
        editorOptions: {
          height: '100px',
          toolbarGroups: [
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
            { name: 'links' }
          ],
          //override default options
          toolbar: '',
          /* jshint camelcase: false */
          toolbar_full: ''
        },
        submit: function() {
          mlRest.createDocument($scope.model.person, {
            format: 'json',
            directory: '/content/',
            extension: '.json'
            // TODO: add read/update permissions here like this:
            // 'perm:sample-role': 'read',
            // 'perm:sample-role': 'update'
          }).then(function(response) {
            win.location.href = '/detail?uri=' + response.headers('location').replace(/(.*\?uri=)/, '');
          });
        },
        addTag: function() {
          model.person.tags.push(model.newTag);
          model.newTag = '';
        }
      });
    }]);
}());


angular.module('sample.create', []);

(function () {
  'use strict';

  angular.module('sample.detail')
    .controller('DetailCtrl', ['$scope', 'MLRest', '$routeParams', function ($scope, mlRest, $routeParams) {
      var uri = $routeParams.uri;
      var model = {
        // your model stuff here
        detail: {}
      };

      // mlRest.getDocument(uri, { format: 'json', transform: 'detail' }).then(function(response) {
      mlRest.getDocument(uri, { format: 'json', transform: 'to-json' }).then(function(response) {
        var i=0, member=null;

        if (response.data.root) {
          model.detail = response.data.root;

          for (i=0; i < model.detail._children.length; i++) {
            if (model.detail._children[i].member) {
              member = model.detail._children[i].member;
              break;
            }
          }
        }
        else if (response.data.member) {
          model.detail = response.data.member;
          member = response.data.member;
        }
        else if (response.data.doc) {
          model.detail = response.data.doc;
        }

        if (member) {
          for (i=0; i < member._children.length; i++) {
            if (member._children[i].latitude) {
              model.detail.latitude = member._children[i].latitude._children[0];
            } else if (member._children[i].longitude) {
              model.detail.longitude = member._children[i].longitude._children[0];
            }
          }
        }
      });

      angular.extend($scope, {
        model: model

      });
    }]);
}());


angular.module('sample.detail', []);

(function () {

  'use strict';

  angular.module('sample.esriMap', [])
  .directive('esriMap', [function () {
    return {
      restrict: 'E',
      scope: {
        detail: '='
      },
      template: '<div id="_detailMap" class="map-detail"></div>',
      controller: 'EsriDetailMapController'
    };
  }])
  .controller('EsriDetailMapController', ['$scope',
    function ($scope) {
      var ctrl = this;
      ctrl.baseMap = 'national-geographic';
      ctrl.mapGeometry = null;

      initMap('_detailMap', $scope.detail);

      function initMap(containerId, geoData) {
        require([  // jshint ignore:line
          'esri/map', 'esri/graphic', 'esri/symbols/SimpleFillSymbol',
          'esri/symbols/SimpleMarkerSymbol', 'esri/layers/GraphicsLayer',
          'esri/geometry/Point', 'esri/geometry/Polygon',
          'esri/graphicsUtils', 'esri/Color'
          ], function(
            Map, Graphic, SimpleFillSymbol,
            SimpleMarkerSymbol, GraphicsLayer,
            Point, Polygon,
            graphicsUtils, Color
          )
          {
            processGeoData(geoData);

            ctrl.map = new Map(
              containerId, {
                basemap: ctrl.baseMap,
                zoom: 6,
                smartNavigation: false
              }
            );

            ctrl.graphicsLayer = new GraphicsLayer({id: 'data'});
            ctrl.map.addLayer(ctrl.graphicsLayer);
            ctrl.map.infoWindow.set('popupWindow', false);

            // Use the geometry information to draw on the map after
            // the map has completed loading.
            ctrl.map.on('load', function() {
              if (ctrl.mapGeometry) {
                ctrl.drawData(ctrl.mapGeometry);
              }
            });

            /**
            * Processes the geospatial data passed to the map in order to draw it on the map.
            */
            function processGeoData(geoData) {
              if (geoData && geoData.latitude && geoData.longitude) {
                ctrl.mapGeometry = [];
                ctrl.mapGeometry.push( new Point(geoData.longitude, geoData.latitude) );
              }
            }

            /**
            * Draw a shape on the map based on the specified geometry object.
            */
            ctrl.drawData = function(geometry) {
              if (geometry && geometry.length > 0) {
                for (var i=0; i < geometry.length; i++) {
                  var symbol = null;
                  if (geometry[i] instanceof Point) {
                    symbol = new SimpleMarkerSymbol().setColor(new Color([0, 0, 0, 0.40]));
                  } else if (geometry[i] instanceof Polygon) {
                    symbol = new SimpleFillSymbol().setColor( new Color([0, 0, 0, 0.40]) );
                  }

                  if (symbol) {
                    var graphic = new Graphic(geometry[i], symbol);
                    ctrl.graphicsLayer.add(graphic);
                  }
                }
                // Set extent so that map zooms as close as possible and still
                //  shows all graphics.
                var myExtent = graphicsUtils.graphicsExtent(ctrl.graphicsLayer.graphics);
                ctrl.map.setExtent(myExtent, true);
              }
            };
          });
      }
    }]);
}());

(function () {
  'use strict';

  angular.module('sample.search')
    .controller('SearchCtrl', ['$scope', '$location', 'User', 'MLSearchFactory', 'MLRemoteInputService', function ($scope, $location, user, searchFactory, remoteInput) {
      var mlSearch = searchFactory.newContext(),
          model = {
            page: 1,
            qtext: '',
            search: {},
            user: user
          };

      (function init() {
        // wire up remote input subscription
        remoteInput.initCtrl($scope, model, mlSearch, search);

        // run a search when the user logs in
        $scope.$watch('model.user.authenticated', function() {
          search();
        });

        // capture initial URL params in mlSearch and ctrl model
        mlSearch.fromParams().then(function() {
          // if there was remote input, capture it instead of param
          mlSearch.setText(model.qtext);
          updateSearchResults({});
        });

        // capture URL params (forward/back, etc.)
        $scope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl){
          mlSearch.locationChange( newUrl, oldUrl ).then(function() {
            search();
          });
        });
      })();

      function updateSearchResults(data) {
        model.search = data;
        model.qtext = mlSearch.getText();
        model.page = mlSearch.getPage();

        remoteInput.setInput( model.qtext );
        $location.search( mlSearch.getParams() );
      }

      function search(qtext) {
        if ( !model.user.authenticated ) {
          model.search = {};
          return;
        }

        if ( arguments.length ) {
          model.qtext = qtext;
        }

        mlSearch
          .setText(model.qtext)
          .setPage(model.page)
          .search()
          .then(updateSearchResults);
      }

      angular.extend($scope, {
        model: model,
        search: search,
        toggleFacet: function toggleFacet(facetName, value) {
          mlSearch
            .toggleFacet( facetName, value )
            .search()
            .then(updateSearchResults);
        }
      });

    }]);
}());


angular.module('sample.search', []);

(function () {

  'use strict';

  angular.module('sample.sources', [])
    .controller('SourcesCtrl', ['$scope', 'counts', function ($scope, counts) {
      var ctrl = this;
      angular.extend(ctrl, {
        counts: counts
      });
    }])
    .controller('DataStatsChartCtrl', ['$scope', function ($scope) {
      var ctrl = this;
      ctrl.title = 'Data Sources';

      function createOptions(sources) {
        return {
          chart: {
            type: 'column'
          },

          title: {
            text: 'Data Sources'
          },

          xAxis: {
            type: 'category',
            labels: {
              // rotation: -45,
              style: {
                fontSize: '10px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },

          yAxis: {
            min: 1,
            type: 'logarithmic',
            title: {
              text: 'Count'
            }
          },

          tooltip: {
            crosshairs: true,
            shared: false,
            useHTML: true,
            headerFormat: '<span class="name">{point.key}</span><br/>',
            pointFormat: '<b style="margin-top: 2px">{point.y} {point.format}</b><br/><a href="{point.url}" target="_blank">Source</a><br/><p>{point.desc}</p>'
          },

          series: [
            {
              name: 'Data Source',
              data: sources
            }
          ]
        };
      }

      $scope.$watch('data', function(newValue, oldValue) {
        var i, point, sources = [];
        if (newValue) {
          for (i = 0; i < newValue.length; i++) {
            point = newValue[i];
            sources.push({
              name: point.name,
              y: point.count,
              desc: point.description,
              format: point.format,
              url: point.url
            });
          }

          if ($scope.chart) {
            $scope.chart.series[0].setData(sources, true);
          }
          else {
            $scope.createChart(createOptions(sources));
          }
        }
        else if ($scope.chart) {
          $scope.chart.series[0].setData([], true);
        }
      });
    }]);
})();

(function () {
  'use strict';

  angular.module('sample.sql', [])
    .service('SqlService', function ($http) {
      this.query2 = function(statement) {
        var payload = '<sql:request xmlns:sql="http://xqdev.com/sql">' +
          '<sql:type>query</sql:type>' +
          '<sql:query>' + statement + '</sql:query>' +
          '</sql:request>';
        $http.post('http://cookshow-ml1:8080/mlsql/', payload).success(function(data, status, headers, config) {
          console.log('success: ' + data);
        }).error(function(data, status, headers, config) {
          console.log('error: ' + data);
        });

        return statement;
      };

      this.query = function(statement) {
        var payload = { query: statement};
        return $http.post('/v1/resources/run-sql', payload);
      };
    })
    .controller('SqlCtrl', ['$scope', '$routeParams', 'SqlService', function ($scope, $routeParams, SqlService) {
      var uri = $routeParams.uri;
      var model = {
        // your model stuff here
        results: null,
        mlsamUrl: 'http://localhost:8080/mlsql/',
        sqlStatement: 'show tables;'
      };

      angular.extend($scope, {
        model: model,
        submit: function() {
          SqlService.query(model.sqlStatement).success(function(data, status, headers, config) {
            if (data.results) {
              $scope.processResults(data.results);
            }
          }).error(function(data, status, headers, config) {
            console.log('error: ' + data);
            model.results = data;
          });

          // mlRest.createDocument($scope.model.person, {
          //   format: 'json',
          //   directory: '/content/',
          //   extension: '.json'
          // }).then(function(response) {
          //   win.location.href = '/detail?uri=' + response.headers('location').replace(/(.*\?uri=)/, '');
          // });
        },
        processResults: function(results) {
          model.results = results;

          // Get table headers
          model.headings = [];
          if (results && results.length > 0) {
            if (results[0].tuple) {
              var tuple = results[0].tuple;
              for (var j=0; j < tuple._children.length; j++) {
                var hdrs = Object.keys(tuple._children[j]);
                model.headings.push(hdrs[0]);
              }
            }
          } else if (results && results.tuple) {
            // Single tuple was returned.
            var tuple = results.tuple;
            for (var j=0; j < tuple._children.length; j++) {
              var hdrs = Object.keys(tuple._children[j]);
              model.headings.push(hdrs[0]);
            }

            // Need to store single tuple.
            model.results = [];
            model.results.push(results);
          }
        },
        loadTables: function() {
          model.results = SqlService.query('show tables;').success(function(data, status, headers, config) {
            model.tables = [];
            if (data.results && data.results.length > 0) {
              for (var i=0; i < data.results.length; i++) {
                if (data.results[i].tuple) {
                  var tuple = data.results[i].tuple;
                  if (tuple._children && tuple._children.length > 0) {
                    var hdrs = Object.keys(tuple._children[0]);
                    if (hdrs && hdrs.length > 0) {
                      model.tables.push( tuple._children[0][hdrs[0]]._children[0] );
                    }
                  }
                }
              }
            }
          }).error(function(data, status, headers, config) {
            console.log('error: ' + data);
            model.tables = data;
          });
        },
        loadTableData: function(tableName) {
          model.tableName = tableName;
          model.tableCount = 0;
          model.tableDescribeResults = null;
          model.tableDescribeHdrs = [];
          model.tableSelectResults = null;
          model.tableSelectHdrs = [];

          // Count the # of records in the table.
          SqlService.query('select count(*) as count from ' + tableName + ';').success(function(data, status, headers, config) {
            if (data.results && data.results.tuple) {
              var tuple = data.results.tuple;
              if (tuple._children && tuple._children.length > 0) {
                model.tableCount = tuple._children[0].count._children[0];
              }
            }
          }).error(function(data, status, headers, config) {
            console.log('Table Count - error: ' + data);
          });

          // Get the table description.
          SqlService.query('describe ' + tableName + ';').success(function(data, status, headers, config) {
            if (data.results && data.results.length > 0) {
              model.tableDescribeResults = data.results;
              if (data.results[0].tuple) {
                var tuple = data.results[0].tuple;
                for (var j=0; j < tuple._children.length; j++) {
                  var hdrs = Object.keys(tuple._children[j]);
                  model.tableDescribeHdrs.push(hdrs[0]);
                }
              }
            }
          }).error(function(data, status, headers, config) {
            console.log('Table Describe - error: ' + data);
          });

          // Get the table data.
          SqlService.query('select * from ' + tableName + ' limit 10;').success(function(data, status, headers, config) {
            if (data.results && data.results.length > 0) {
              model.tableSelectResults = data.results;
              if (data.results[0].tuple) {
                var tuple = data.results[0].tuple;
                for (var j=0; j < tuple._children.length; j++) {
                  var hdrs = Object.keys(tuple._children[j]);
                  model.tableSelectHdrs.push(hdrs[0]);
                }
              }
            }
          }).error(function(data, status, headers, config) {
            console.log('Table Select - error: ' + data);
          });
        },
      });

      $scope.loadTables();

    }]);
}());

(function () {
  'use strict';

  angular.module('sample.user')
    .controller('ProfileCtrl', ['$scope', 'MLRest', 'User', '$location', function ($scope, mlRest, user, $location) {
      var model = {
        user: user, // GJo: a bit blunt way to insert the User service, but seems to work
        newEmail: ''
      };

      angular.extend($scope, {
        model: model,
        addEmail: function() {
          if ($scope.profileForm.newEmail.$error.email) {
            return;
          }
          if (!$scope.model.user.emails) {
            $scope.model.user.emails = [];
          }
          $scope.model.user.emails.push(model.newEmail);
          model.newEmail = '';
        },
        removeEmail: function(index) {
          $scope.model.user.emails.splice(index, 1);
        },
        submit: function() {
          mlRest.updateDocument({
            user: {
              'fullname': $scope.model.user.fullname,
              'emails': $scope.model.user.emails
            }
          }, {
            format: 'json',
            uri: '/users/' + $scope.model.user.name + '.json'
            // TODO: add read/update permissions here like this:
            // 'perm:sample-role': 'read',
            // 'perm:sample-role': 'update'
          }).then(function(data) {
            $location.path('/');
          });
        }
      });
    }]);
}());

(function () {

  'use strict';

  angular.module('sample.user')
    .directive('mlUser', [function () {
      return {
        restrict: 'EA',
        controller: 'UserController',
        replace: true,
        scope: {},
        templateUrl: '/user/user-dir.html'
      };
    }])
    .controller('UserController', ['$scope', 'User', function ($scope, user) {
      angular.extend($scope, {
        user: user,
        login: user.login,
        logout: function() {
          user.logout();
          $scope.password = '';
        }
      });
    }]);

}());

(function () {
  'use strict';

  angular.module('sample.user')
    .factory('User', ['$http', function($http) {
      var user = {};

      init();

      $http.get('/user/status', {}).then(updateUser);

      function init() {
        user.name = '';
        user.password = '';
        user.loginError = false;
        user.authenticated = false;
        user.hasProfile = false;
        user.fullname = '';
        user.emails = [];
        return user;
      }

      function updateUser(response) {
        var data = response.data;

        user.authenticated = data.authenticated;

        if ( user.authenticated ) {
          user.name = data.username;

          if ( data.profile ) {
            user.hasProfile = true;
            user.fullname = data.profile.fullname;

            if ( _.isArray(data.profile.emails) ) {
              user.emails = data.profile.emails;
            } else {
              // wrap single value in array, needed for repeater
              user.emails = [data.profile.emails];
            }
          }
        }
      }

      angular.extend(user, {
        login: function(username, password) {
          $http.get('/user/login', {
            params: {
              'username': username,
              'password': password
            }
          }).then(function(reponse) {
            updateUser(reponse);
            user.loginError = !user.authenticated;
          });
        },
        logout: function() {
          $http.get('/user/logout').then(init);
        }
      });

      return user;
    }]);
}());


angular.module('sample.user', ['sample.common']);


/*
  Library to use (close to) fluent-style notation to build structured MarkLogic queries..

  This:

    {
      'or-query': {
        'queries': [
          {
            'range-constraint-query': {
              'constraint-name': 'PublishedDate',
              'range-operator': 'LE',
              'value': new Date().toISOString(),
              'range-option': ['score-function=reciprocal','slope-factor=50']
            }
          },
          {
            'and-query': {
              'queries': []
            }
          }
        ]
      }
    }

  Becomes:

    qb.orQuery(
      qb.rangeConstraintQuery(
        'PublishedDate', 'LE', new Date().toISOString(),
        ['score-function=reciprocal','slope-factor=50']
      ),
      qb.andQuery()
    )

  This:

    {
      'or-query': {
        'queries': [{
          'geospatial-constraint-query': {
            'constraint-name': 'meridian-geo',
            'box': [
              bounds
            ]
          }
        },{
          'geospatial-constraint-query': {
            'constraint-name': 'connect-geo',
            'box': [
              bounds
            ]
          }
        }]
      }
    }

  Becomes:

    qb.orQuery(
      qb.geospatialConstraintQuery('meridian-geo', [bounds]),
      qb.geospatialConstraintQuery('connect-geo', [bounds]),
    )

*/

(function() {
  'use strict';

  angular.module('sample.common')
    .factory('MLSampleQueryBuilder', [function() {
      var andQuery = function () {
        if (arguments.length === 1 && angular.isArray(arguments[0])) {
          return {
            'and-query': {
              'queries': arguments[0]
            }
          };
        } else {
          return {
            'and-query': {
              'queries': Array.prototype.slice.call(arguments)
            }
          };
        }
      };
      return {
        andQuery: andQuery,
        boostQuery: function (matchingQuery, boostingQuery) {
          if (matchingQuery) {
            return {
              'boost-query': {
                'matching-query': matchingQuery,
                'boosting-query': boostingQuery
              }
            };
          } else {
            return {
              'boost-query': {
                'matching-query': andQuery(),
                'boosting-query': boostingQuery
              }
            };
          }
        },
        collectionConstraintQuery: function (constraintName, uris) {
          return {
            'collection-constraint-query': {
              'constraint-name': constraintName,
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        customConstraintQuery: function (constraintName, terms) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'text': terms
            }
          };
        },
        customGeospatialConstraintQuery: function (constraintName, annotation, box) {
          return {
            'custom-constraint-query': {
              'constraint-name': constraintName,
              'annotation': annotation,
              'box': box
            }
          };
        },
        documentQuery: function (uris) {
          return {
            'document-query': {
              'uri': Array.isArray(uris) ? uris : [ uris ]
            }
          };
        },
        geospatialConstraintQuery: function (constraintName, boxes) {
          return {
            'geospatial-constraint-query': {
              'constraint-name': constraintName,
              'box': boxes
            }
          };
        },
        operatorState: function (operatorName, stateName) {
          return {
            'operator-state': {
              'operator-name': operatorName,
              'state-name': stateName
            }
          };
        },
        orQuery: function () {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'or-query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'or-query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        propertiesQuery: function (query) {
          return {
            'properties-query': query
          };
        },
        rangeConstraintQuery: function (constraintName, rangeOperator, value, rangeOptions) {
          if (!rangeOptions) {
            rangeOptions = [];
          }
          if (!rangeOperator) {
            rangeOperator = 'EQ';
          }
          return {
            'range-constraint-query': {
              'constraint-name': constraintName,
              'range-operator': rangeOperator,
              'value': value,
              'range-option': rangeOptions
            }
          };
        },
        structuredQuery: function() {
          if (arguments.length === 1 && angular.isArray(arguments[0])) {
            return {
              'query': {
                'queries': arguments[0]
              }
            };
          } else {
            return {
              'query': {
                'queries': Array.prototype.slice.call(arguments)
              }
            };
          }
        },
        termQuery: function (terms, weight) {
          if (weight) {
            return {
              'term-query': {
                'text': terms,
                'weight': weight
              }
            };
          } else {
            return {
              'term-query': {
                'text': terms
              }
            };
          }
        },
        textQuery: function (text) {
          return {
            'qtext': text
          };
        }
      };
    }]);
}());
