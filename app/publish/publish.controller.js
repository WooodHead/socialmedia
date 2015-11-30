(function() {
  angular
    .module('SocialMedia')
    .controller('PublishCtrl', PublishCtrl);

  PublishCtrl.$inject = ['Item', 'Channels', 'Geo'];

  function PublishCtrl(Item, Channels, Geo) {
    var vm = this;

    vm.channels = Channels;
    vm.item = typeof(Item) === 'object' ? Item : null;
    vm.geo = Geo;
    vm.networks = ['Facebook', 'Twitter', 'Google+'];

    if(vm.item) {
      vm.item.scheduled = new Date(vm.item.scheduled);

      // HACK: Manually set the tick if the selected properties
      setTicked(vm.channels, vm.item.channels);
      setTicked(vm.geo.countries, vm.item.geo.countries);
      setTicked(vm.geo.regions, vm.item.geo.regions);
      setTicked(vm.geo.cities, vm.item.geo.cities);
      setTicked(vm.geo.languages, vm.item.geo.languages);
    }

    function setTicked(inputModel, outputModel) {
      console.log('setTicked', JSON.stringify(inputModel), JSON.stringify(outputModel));
      inputModel.forEach(function(input) {
        input.ticked = outputModel.indexOf(input._id) !== -1;
      });
    }
  }
})();
