/**
 * socker.io
 *
 * @namespace Factories
 */
(function() {
  angular
    .module('SocialMedia.Core')
    .factory('socket', socket);

  function socket(socketFactory) {
    return socketFactory();
  }
})();
