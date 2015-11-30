(function() {
  angular
    .module('SocialMedia')
    .controller('PublishCtrl', PublishCtrl);

  function PublishCtrl($routeParams, Channels, Countries, Regions, Cities, Languages, Items, Item) {
    var vm = this;

    vm.channels = Channels.get({}, function() { tickAllSelected(); });
    vm.geo = {
      countries: Countries.get({}, function() { tickAllSelected(); }),
      regions: Regions.get({}, function() { tickAllSelected(); }),
      cities: Cities.get({}, function() { tickAllSelected(); }),
      languages: Languages.get({}, function() { tickAllSelected(); }),
    };
    vm.networks = ['Facebook', 'Twitter', 'Google+'];

    if($routeParams.id) {
      vm.item = Item.get({ id: $routeParams.id }, function(res) {
        vm.item.scheduled = new Date(vm.item.scheduled);
        tickAllSelected();
      }, function(err) {
        console.error(err);
      });
    } else {
      vm.item = { };
    }

    // HACK: Manually set the tick if the selected properties
    function tickAllSelected() {
      setTicked(vm.channels, vm.item.channels);
      setTicked(vm.geo.countries, vm.item.geo.countries);
      setTicked(vm.geo.regions, vm.item.geo.regions);
      setTicked(vm.geo.cities, vm.item.geo.cities);
      setTicked(vm.geo.languages, vm.item.geo.languages);
    }

    // HACK: Manually set the tick if the selected properties
    function setTicked(inputModel, outputModel) {
      console.log('setTicked', JSON.stringify(inputModel), JSON.stringify(outputModel));
      inputModel.forEach(function(input) {
        input.ticked = outputModel.indexOf(input._id) !== -1;
      });
    }
  }
})();
