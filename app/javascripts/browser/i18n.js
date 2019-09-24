var i18n = {
  getString: function(key) {
    return chrome.i18n.getMessage(key) || "String not found: " + key;
  }
}

module.exports = i18n;
