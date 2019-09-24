var templates = require('./templates.js'),
    browser   = require('./browser.js');

var popup = {

  init: function() {
    var self         = this,
        disabledFor  = browser.storage.get('disabledFor');

    templates.show('popup', { disabledDuration: disabledFor }, $("body"));
    this.bindings();
  },

  bindings: function() {
    var self = this;

    $("a").blur();
    $("#settings-url-types a").click(function() {
      var urlType = $(this).data('url-type');

      self.setUrlDetection(urlType);
    });

    $("#settings-help-welcome").click(function() {
      browser.openWelcome();
    });
  },

  disable: function(disableFor) {
    browser.pageAction.setIcon('disabled');
    this.closePopup();
  },

  enable: function() {
    browser.pageAction.setIcon('enabled');
    this.closePopup();
  },

  setUrlDetection: function(option) {
    var self = this;

    browser.storage.set('urlDetection', option);

    switch(option) {
      case 'allUrls':
      case 'ticketUrls':
        self.enable();
        break;
      case 'noUrls':
        self.disable();
    }
  },

  closePopup: function() {
    window.close();
  }
};

module.exports = popup;
