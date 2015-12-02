/**
 * Displays items in a calendar and allow some interactions with the item.
 *
 * @namespace Modules
 */
(function() {
  angular
    .module('SocialMedia.Calendar', [
      'btford.socket-io',
      'ui.calendar',
      'ngLocationUpdate',
      'ngDialog',
    ]);
})();
