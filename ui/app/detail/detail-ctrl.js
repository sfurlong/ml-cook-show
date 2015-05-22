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
