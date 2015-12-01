(function() {
  angular
    .module('SocialMedia')
    .controller('CrudRestCtrl', CrudRestCtrl);

  function CrudRestCtrl(objectsService, objectService) {
    var vm = this;

    vm.create = create;
    vm.delete = remove;
    vm.items = objectsService.get({});
    vm.update = update;

    function create() {
      objectsService.save({}, vm.item, null, function objectsSaved(err) {
        console.error(err);
      });
    }

    function update(item, data) {
      objectService.update({ id: item._id }, { name: data });
    }

    function remove(item) {
      objectService.delete({ id: item._id }, null, function objectSaveError(err) {
        console.error(err);
      });
    }
  }
})();
