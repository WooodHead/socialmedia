(function() {
  angular.module('SocialMedia').directive('edit', function() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/edit.directive.jade',
      scope: {
        item: '=',
        channels: '=',
        networks: '=',
        geo: '='
      },
      controller: function($scope, Items, Item, Upload) {
        $scope.localLang = {
          selectAll: 'Select all',
          selectNone: 'Select none',
          reset: 'Reset',
          search: 'Search...',
          nothingSelected: 'Nothing is selected'
        };

        $scope.isScheduled = (new Date() < $scope.item.scheduled);

        $scope.channelsText = JSON.parse(JSON.stringify($scope.localLang)); $scope.channelsText.nothingSelected = 'Channels';
        $scope.countriesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.countriesText.nothingSelected = 'Countries';
        $scope.regionsText = JSON.parse(JSON.stringify($scope.localLang)); $scope.regionsText.nothingSelected = 'Regions';
        $scope.citiesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.citiesText.nothingSelected = 'Cities';
        $scope.languagesText = JSON.parse(JSON.stringify($scope.localLang)); $scope.languagesText.nothingSelected = 'Languages';

        $scope.publish = function() {
          $scope.prepareData();
          $scope.item = Items.save($scope.item, function(res) {
          }, function(err) {
            console.error(err);
          });
        };

        $scope.update = function() {
          $scope.prepareData();
          Item.update({ id: $scope.item._id }, $scope.item, function(res) {
          }, function(err) {
            console.error(err);
          });
        };

        $scope.upload = function(file) {
          Upload.upload({
            url: '/upload',
            data: { item: file }
          }).then(function(res) {
            $scope.item.content.media = {
              fileName: res.data,
              fileUrl: 'http://localhost:3000/images/' + res.data,
              url: 'http://localhost:3000/images/' + res.data
            };
          }, function(err) {
            console.error(err);
          });
        };

        $scope.remove = function() {
          // TODO: Delete the image from the server
          $scope.item.content.media = { fileName: null, fileUrl: null, url: null };
        };

        $scope.delete = function() {
          Item.delete({ id: $scope.item._id });
        };

        $scope.prepareData = function() {
          if($scope.item.tags)
            $scope.item.tags = $scope.item.tags.map(tag => tag.text);

          if($scope.item.channels)
            $scope.item.channels = $scope.item.channels.map(channel => channel._id);
        };
      },
    };
  });
})();
