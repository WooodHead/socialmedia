(function() {
  angular
    .module('SocialMedia')
    .controller('PublishCtrl', PublishCtrl);

  function PublishCtrl($routeParams, Channels, Countries, Regions, Cities, Languages, Items, Item) {
    var vm = this;

    // HACK: Manually set the tick if the selected properties
    vm.setTicked = function(inputModel, outputModel) {
      console.log('setTicked', JSON.stringify(inputModel), JSON.stringify(outputModel));
      inputModel.forEach(function(input) {
        input.ticked = outputModel.indexOf(input._id) !== -1;
      });
    };

    // HACK: Manually set the tick if the selected properties
    vm.tickAllSelected = function() {
      vm.setTicked(vm.channels, vm.item.channels);
      vm.setTicked(vm.geo.countries, vm.item.geo.countries);
      vm.setTicked(vm.geo.regions, vm.item.geo.regions);
      vm.setTicked(vm.geo.cities, vm.item.geo.cities);
      vm.setTicked(vm.geo.languages, vm.item.geo.languages);
    };

    vm.networks = ['Facebook', 'Twitter', 'Google+'];
    vm.channels = Channels.get({}, function() { vm.tickAllSelected(); });
    vm.geo = {
      countries: Countries.get({}, function() { vm.tickAllSelected(); }),
      regions: Regions.get({}, function() { vm.tickAllSelected(); }),
      cities: Cities.get({}, function() { vm.tickAllSelected(); }),
      languages: Languages.get({}, function() { vm.tickAllSelected(); }),
    };

    if($routeParams.id) {
      vm.item = Item.get({ id: $routeParams.id }, function(res) {
        vm.item.scheduled = new Date(vm.item.scheduled);
        vm.tickAllSelected();
      }, function(err) {
        console.error(err);
      });
    } else {
      vm.item = { };
    }
  }
})();
