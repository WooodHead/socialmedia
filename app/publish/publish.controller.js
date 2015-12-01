(function() {
  angular
    .module('SocialMedia')
    .controller('PublishCtrl', PublishCtrl);

  function PublishCtrl($q, $route, itemService, channelsService, countriesService, regionsService, citiesService, languagesService) {
    var vm = this;

    vm.item = null;
    vm.channels = null;
    vm.fetched = false;
    vm.geo = null;
    vm.networks = ['Facebook', 'Twitter'];

    var requests = {
      item: $route.current.params.id ?
        itemService.get({ id: $route.current.params.id }).$promise :
        function() { return null; },
      channels : channelsService.get().$promise,
      countries: countriesService.get().$promise,
      regions: regionsService.get().$promise,
      cities: citiesService.get().$promise,
      languages: languagesService.get().$promise,
    }

    $q.all(requests).then(function(values) {
      if($route.current.params.id)
        vm.item = requests.item.$$state.value;
      vm.channels = requests.channels.$$state.value;
      vm.geo = {
        countries: requests.countries.$$state.value,
        regions: requests.regions.$$state.value,
        cities: requests.cities.$$state.value,
        languages: requests.languages.$$state.value,
      };
      vm.fetched = true;

      if(vm.item) {
        vm.item.scheduled = new Date(vm.item.scheduled);

        // HACK: Manually set the tick if the selected properties
        setTicked(vm.channels, vm.item.channels);
        setTicked(vm.geo.countries, vm.item.geo.countries);
        setTicked(vm.geo.regions, vm.item.geo.regions);
        setTicked(vm.geo.cities, vm.item.geo.cities);
        setTicked(vm.geo.languages, vm.item.geo.languages);
      }
    });

    function setTicked(inputModel, outputModel) {
      console.log(inputModel);
      inputModel.forEach(function(input) {
        input.ticked = outputModel.indexOf(input._id) !== -1;
      });

      vm.finished = true;
    }
  }
})();
