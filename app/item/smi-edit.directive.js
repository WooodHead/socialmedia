(function() {
  angular
    .module('SocialMedia')
    .directive('smiEdit', smiEdit);
})();

function smiEdit() {
  return {
    restrict: 'A',
    templateUrl: 'views/item/smi-edit.directive.jade',
    scope: {
      item: '=',
      channels: '=',
      networks: '=',
      geo: '='
    },
    controller: SmiEditCtrl,
    controllerAs: 'vm',
    bindToController: true
  };
}

SmiEditCtrl.$inject = ['$scope', 'itemsService', 'itemService', 'Upload'];

function SmiEditCtrl($scope, itemsService, itemService, Upload) {
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
  vm.delete = remove;

  vm.prepareData = prepareData;
  vm.isScheduled = vm.item ? (new Date() < vm.item.scheduled) : false;

  function publish() {
    vm.prepareData();
    console.log(vm.item);
    vm.item = itemsService.save(vm.item, function(res) {
    }, function(err) {
      console.error(err);
    });
  };

  function update() {
    vm.prepareData();
    itemService.update({ id: vm.item._id }, vm.item, function(res) {
    }, function(err) {
      console.error(err);
    });
  };

  function upload(file) {
    Upload.upload({
      url: '/upload',
      data: { item: file }
    }).then(function(res) {
      vm.item.content.media = {
        fileName: res.data,
        fileUrl: 'http://localhost:3000/images/' + res.data,
        url: 'http://localhost:3000/images/' + res.data
      };
    }, function(err) {
      console.error(err);
    });
  };

  function clearImage() {
    // TODO: Delete the image from the server
    vm.item.content.media = { fileName: null, fileUrl: null, url: null };
  };

  function remove() {
    itemService.delete({ id: vm.item._id });
  };

  function prepareData() {
    if(vm.item.tags)
      vm.item.tags = vm.item.tags.map(tag => tag.text);

    if(vm.item.channels)
      vm.item.channels = vm.item.channels.map(channel => channel._id);
  };

  function setNothingSelectedText(translation, text) {
    translation = JSON.parse(JSON.stringify(vm.localLang));
    translation.nothingSelected = text;
    return translation;
  }

  function defaultMultiSelectLabels() {
    return {
      selectAll: 'Select all',
      selectNone: 'Select none',
      reset: 'Reset',
      search: 'Search...',
      nothingSelected: 'Nothing is selected'
    };
  }
};
