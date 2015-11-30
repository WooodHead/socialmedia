(function() {
  angular.module('SocialMedia').controller('PublishCtrl', function($scope, $routeParams, Channels,
    Countries, Regions, Cities, Languages, Items, Item) {
      // HACK: Manually set the tick if the selected properties
      $scope.setTicked = function(inputModel, outputModel) {
        console.log('setTicked', JSON.stringify(inputModel), JSON.stringify(outputModel));
        inputModel.forEach(function(input) {
          input.ticked = outputModel.indexOf(input._id) !== -1;
        });
      };

      // HACK: Manually set the tick if the selected properties
      $scope.tickAllSelected = function() {
        $scope.setTicked($scope.channels, $scope.item.channels);
        $scope.setTicked($scope.geo.countries, $scope.item.geo.countries);
        $scope.setTicked($scope.geo.regions, $scope.item.geo.regions);
        $scope.setTicked($scope.geo.cities, $scope.item.geo.cities);
        $scope.setTicked($scope.geo.languages, $scope.item.geo.languages);
      };

      $scope.networks = ['Facebook', 'Twitter', 'Google+'];
      $scope.channels = Channels.get({}, function() { $scope.tickAllSelected(); });
      $scope.geo = {
        countries: Countries.get({}, function() { $scope.tickAllSelected(); }),
        regions: Regions.get({}, function() { $scope.tickAllSelected(); }),
        cities: Cities.get({}, function() { $scope.tickAllSelected(); }),
        languages: Languages.get({}, function() { $scope.tickAllSelected(); }),
      };

      if($routeParams.id) {
        $scope.item = Item.get({ id: $routeParams.id }, function(res) {
          $scope.item.scheduled = new Date($scope.item.scheduled);
          $scope.tickAllSelected();
        }, function(err) {
          console.error(err);
        });
      } else {
        $scope.item = { };
      }
    }
  );
})();
