module.exports = {
  attach: function(browser) {
    function getId(id) { return browser.element(by.id(id)); }
    function click(id) { getId(id).click(); }
    function clear(id) { getId(id).clear(); }
    function type(id, text) { getId(id).sendKeys(text); }
    function getBinding(bind) { return browser.element(by.binding(bind)).getText(); }
    function selectOption(name) { browser.element(by.cssContainingText('option', name)).click(); }
    function toggleMultiSelect(id) { getId(id).click(); }
    function clickMultiSelectOption(index) {
      browser.element(by.repeater('item in filteredModel').row(index)).click();
    }

    return {
      browser: function() { return browser; },
      setChannel: function(index) {
        toggleMultiSelect('channels');
        clickMultiSelectOption(index);
        toggleMultiSelect('channels');
      },
      setNetwork: function(name) { selectOption(name); },
      setMessage: function(message) {
        clear('message');
        type('message', message);
      },
      publish: function() { click('publish'); },
      update: function() { click('update'); },
      delete: function() { click('delete'); },

      // Only after the item was published
      getId: function() { return getBinding('vm.item._id'); }
    };
  }
};
