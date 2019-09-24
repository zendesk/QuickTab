var browser = require('./browser.js'),
    Package  = require('json!../../../package.json');

var version = {

  CURRENT: Package.version,

  set: function() {
    browser.storage.set('currentversion', this.CURRENT);
  },

  hasUpdated: function() {
    var storedVersion = browser.storage.get('currentversion');

    return (this.current < storedVersion) ? true : false;
  },

  check: function() {
    var storedVersion = browser.storage.get('currentversion');

    if (!storedVersion) {
      this.panic();
    }
  },

  panic: function() {
    browser.storage.drop();
    this.set();
  }

};

version.check();

module.exports = version;
