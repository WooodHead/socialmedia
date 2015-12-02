/**
 * Provides a preview of an item. Changes appearance depending on
 * the selected network
 *
 * @param {object} item - the item to preview
 * @param {boolean} edit - whether to display an edit button
 * @param {boolean} next - whether to display a link to the calendar
 *
 * @namespace Directives
 */
(function() {
  angular
    .module('SocialMedia')
    .directive('smView', smView);

  function smView() {
    return {
      restrict: 'A',
      templateUrl: 'views/item/sm-view.directive.jade',
      scope: {
        item: '=',
        edit: '=',
        next: '=',
      },
    };
  }
})();
