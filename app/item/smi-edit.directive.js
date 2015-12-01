(function() {
  angular
    .module('SocialMedia')
    .directive('smiEdit', smiEdit);

  function smiEdit() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/smi-edit.directive.jade',
      scope: {
        item: '=',
        channels: '=',
        networks: '=',
        geo: '=',
      },
      controller: SmiEditCtrl,
      controllerAs: 'vm',
      bindToController: true,
    };
  }

  function SmiEditCtrl($scope, $location, $log, itemsService, itemService, Upload) {
    var vm = this;

    // Form fields
    vm.clearImage = clearImage;
    vm.localLang = defaultMultiSelectLabels();
    vm.channelsText = setNothingSelectedText(vm.channelsText, 'Channels');
    vm.countriesText = setNothingSelectedText(vm.countriesText, 'Countries');
    vm.regionsText = setNothingSelectedText(vm.regionsText, 'Regions');
    vm.citiesText = setNothingSelectedText(vm.citiesText, 'Cities');
    vm.languagesText = setNothingSelectedText(vm.languagesText, 'Languages');

    // Send changes to server
    vm.upload = upload;
    vm.publish = publish;
    vm.update = update;
    vm.remove = remove;

    vm.prepareData = prepareData;
    vm.isScheduled = vm.item ? (new Date() < vm.item.scheduled) : false;

    function isValid() {
      vm.noChannels = vm.item.channels.length === 0;
      vm.noNetwork = !vm.item.content || !vm.item.content.network || vm.item.content.network.length === 0;
      return (!vm.noChannels && !vm.noNetwork);
    }

    function publish() {
      if (!isValid()) return;
      vm.prepareData();
      vm.item = itemsService.save(vm.item, function itemSaved() {
        vm.item.scheduled = new Date(vm.item.scheduled);
        $location.path('view/' + vm.item._id);
      }, function(err) {
        $log.error(err);
      });
    }

    function update() {
      if (!isValid()) return;
      vm.prepareData();
      vm.item = itemService.update({ id: vm.item._id }, vm.item, function itemSaved() {
        vm.item.scheduled = new Date(vm.item.scheduled);
        $location.path('view/' + vm.item._id);
      }, function(err) {
        $log.error(err);
      });
    }

    function upload(file) {
      Upload.upload({
        url: '/upload',
        data: { item: file },
      }).then(function uploadResolved(res) {
        vm.item.content.media = {
          fileName: res.data,
          fileUrl: 'http://localhost:3000/images/' + res.data,
          // url: 'http://localhost:3000/images/' + res.data
        };
      }, function uploadError(err) {
        $log.error(err);
      });
    }

    function clearImage() {
      // TODO: Delete the image from the server
      vm.item.content.media = { fileName: null, fileUrl: null, url: null };
    }

    function remove() {
      itemService.delete({ id: vm.item._id });
      $location.path('calendar');
    }

    function prepareData() {
      if (vm.item.tags) { vm.item.tags = vm.item.tags.map(function(tag) { return tag.text; }); }
      if (vm.item.channels) { vm.item.channels = vm.item.channels.map(function(channel) { return channel._id; }); }
    }

    function setNothingSelectedText(translation, text) {
      translation = angular.fromJson(angular.toJson(vm.localLang));
      translation.nothingSelected = text;
      return translation;
    }

    function defaultMultiSelectLabels() {
      return {
        selectAll: 'Select all',
        selectNone: 'Select none',
        reset: 'Reset',
        search: 'Search...',
        nothingSelected: 'Nothing is selected',
      };
    }
  }
})();
