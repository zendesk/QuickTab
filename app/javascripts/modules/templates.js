var browser = require('./browser.js');

var templates = {
  init: function() {
    this._registerHandlebarsHelpers();
  },

  render: function(template, context) {
    return Handlebars.templates[template](context);
  },

  show: function(template, context, $element) {
    var output = this.render(template, context);

    $element.prop("id", template).html(output);
  },

  _registerHandlebarsHelpers: function() {
    // Partial loading
    Handlebars.partials = Handlebars.templates;

    // i18n Helper
    Handlebars.registerHelper('t', function(text) {
      return new Handlebars.SafeString(
        browser.i18n.getString(text) || "String not found: " + text
      );
    });

    // ifSettingEnabled Helper
    Handlebars.registerHelper('enabledSetting', function(settingName, expectedSettingValue) {
      var settingEnabled = '',
          settingValue   = browser.storage.get(settingName);

      if (expectedSettingValue == settingValue) {
        settingEnabled = 'enabled';
      }

      return settingEnabled;
    });
  }
};

templates.init();

module.exports = templates;
