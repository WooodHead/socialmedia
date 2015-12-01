(function() {
  angular
    .module('SocialMedia')
    .controller('PublishCtrl', PublishCtrl);

  function PublishCtrl($q, $route, $location, itemService, channelsService, countriesService, regionsService, citiesService, languagesService) {
    var vm = this;
    var requests = { };

    vm.mode = getMode();
    vm.item = null;
    vm.channels = null;
    vm.fetched = false;
    vm.geo = null;
    vm.networks = ['Facebook', 'Twitter'];

    if (vm.mode !== 'publish') {
      requests.item = itemService.get({ id: $route.current.params.id }).$promise;
    }

    if (vm.mode !== 'view') {
      requests.channels = channelsService.get().$promise;
      requests.countries = countriesService.get().$promise;
      requests.regions = regionsService.get().$promise;
      requests.cities = citiesService.get().$promise;
      requests.languages = languagesService.get().$promise;
    }

    $q.all(requests).then(function requestsResolved(values) {
      if (vm.mode !== 'publish') {
        vm.item = values.item;
        vm.item.scheduled = new Date(vm.item.scheduled);
      }

      if (vm.mode !== 'view') {
        vm.channels = values.channels;
        vm.geo = {
          countries: values.countries,
          regions: values.regions,
          cities: values.cities,
          languages: values.languages,
        };

        if (vm.item) {
          // HACK: Manually set the tick if the selected properties
          setTicked(vm.channels, vm.item.channels);
          setTicked(vm.geo.countries, vm.item.geo.countries);
          setTicked(vm.geo.regions, vm.item.geo.regions);
          setTicked(vm.geo.cities, vm.item.geo.cities);
          setTicked(vm.geo.languages, vm.item.geo.languages);
        }
      }

      vm.fetched = true;
    });

    function getMode() {
      if ($location.path()[1] === 'v') return 'view';
      if ($location.path()[1] === 'e') return 'edit';
      if ($location.path() === '/publish/') return 'publish';
    }

    function setTicked(inputModel, outputModel) {
      inputModel.forEach(function iM(input) {
        outputModel.forEach(function oM(output) {
          if (input._id === output._id) { input.ticked = true; }
        });
      });

      vm.finished = true;
    }
  }
})();
