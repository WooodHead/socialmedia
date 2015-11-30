(function() {
  angular
    .module('SocialMedia')
    .controller('CrudRestCtrl', CrudRestCtrl);
})();

function CrudRestCtrl(objectsService, objectService) {
  var vm = this;

  vm.create = create;
  vm.delete = remove;
  vm.items = objectsService.get({});
  vm.update = update;

  function create() {
    console.log(vm.item);
    objectsService.save({}, vm.item, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };

  function update(item, data) {
    objectService.update({ id: item._id }, { name: data });
  };

  function remove(item) {
    objectService.delete({ id: item._id }, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };
}
