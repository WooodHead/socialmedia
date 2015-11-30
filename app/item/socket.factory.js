(function() {
  angular
    .module('SocialMedia')
    .factory('socket', socket);

  function socket(socketFactory) {
    return socketFactory();
  }
})();
