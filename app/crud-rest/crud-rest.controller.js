(function() {
  angular
    .module('SocialMedia')
    .controller('CrudRestCtrl', CrudRestCtrl);
})();

function CrudRestCtrl(Items, Item) {
  var vm = this;

  vm.create = create;
  vm.delete = remove;
  vm.items = Items.get({});
  vm.update = update;

  function create() {
    console.log(vm.item);
    Items.save({}, vm.item, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };

  function update(item, data) {
    Item.update({ id: item._id }, { name: data });
  };

  function remove(item) {
    Item.delete({ id: item._id }, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };
}
