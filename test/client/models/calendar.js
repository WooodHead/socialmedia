module.exports = {
  attach: function(browser) {
    return {
      browser: function() { return browser; },
      navigate: function(date) {
        var path = date.getFullYear() + '/' + date.getMonth() + '/' + date.getUTCDate();

        browser.get('#/calendar/' + path);
        browser.refresh();
      },
      getEvent: function(id) { return browser.element(by.id(id)); },
      getMessage: function(event) { return event.element(by.css('.fc-title')).getText(); }
    };
  }
};
