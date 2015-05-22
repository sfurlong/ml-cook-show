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
