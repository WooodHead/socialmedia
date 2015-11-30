(function() {
  angular
    .module('SocialMedia')
    .controller('CrudRestCtrl', CrudRestCtrl);
})();

function CrudRestCtrl(Items, Item) {
  var vm = this;

  vm.items = Items.get({});

  vm.create = function() {
    console.log(vm.item);
    Items.save({}, vm.item, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };

  vm.update = function(item, data) {
    Item.update({ id: item._id }, { name: data });
  };

  vm.delete = function(item) {
    Item.delete({ id: item._id }, function(res) {
      console.log(res);
    }, function(err) {
      console.error(err);
    });
  };
}
